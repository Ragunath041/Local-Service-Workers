import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { CheckIcon, XIcon, ClockIcon, UserIcon, BriefcaseIcon, MapPinIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { servicesApi, Service } from "@/lib/services";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const AdminDashboard = () => {
  const [pendingServices, setPendingServices] = useState<Service[]>([]);
  const [approvedServices, setApprovedServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const [pending, approved] = await Promise.all([
          servicesApi.getPendingServices(),
          servicesApi.getApprovedServices()
        ]);
        setPendingServices(pending);
        setApprovedServices(approved);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch services");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Stats derived from real data
  const stats = {
    pendingApprovals: pendingServices.length,
    approvedServices: approvedServices.length,
  };
  
  const handleApprove = async (serviceId: string) => {
    try {
      await servicesApi.approveService(serviceId);
      toast.success("Service approved successfully");
      
      // Update local state
      const approvedService = pendingServices.find(s => s._id === serviceId);
      if (approvedService) {
        setPendingServices(prev => prev.filter(s => s._id !== serviceId));
        setApprovedServices(prev => [...prev, { ...approvedService, status: 'approved' }]);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to approve service");
    }
  };
  
  const handleReject = async (serviceId: string) => {
    try {
      await servicesApi.rejectService(serviceId);
      toast.success("Service rejected successfully");
      
      // Update local state
      setPendingServices(prev => prev.filter(s => s._id !== serviceId));
    } catch (error: any) {
      toast.error(error.message || "Failed to reject service");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <Spinner className="h-8 w-8" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage service listings and approvals</p>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending Approvals</CardDescription>
              <CardTitle className="text-2xl">{stats.pendingApprovals}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 text-yellow-600 mr-1" />
                <span className="text-sm text-gray-500">Awaiting review</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Approved Services</CardDescription>
              <CardTitle className="text-2xl">{stats.approvedServices}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckIcon className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-gray-500">Live listings</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs for different sections */}
        <Tabs defaultValue="pending">
          <TabsList className="mb-6">
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
            <TabsTrigger value="approved">Approved Services</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <div className="space-y-6">
              {pendingServices.map(service => (
                <Card key={service._id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{service.title}</h3>
                          <Badge variant="outline">{service.category}</Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span>{service.location}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                          Submitted on {new Date(service.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-gray-700 mb-4">{service.description}</p>
                        <div className="font-medium">{service.price}</div>
                      </div>
                      
                      <div className="flex flex-col gap-2 min-w-[140px]">
                        <Button 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(service._id)}
                        >
                          <CheckIcon className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleReject(service._id)}
                        >
                          <XIcon className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {pendingServices.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No pending approvals at this time</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="approved">
            <div className="space-y-6">
              {approvedServices.map(service => (
                <Card key={service._id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{service.title}</h3>
                          <Badge variant="outline">{service.category}</Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span>{service.location}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                          Provider: {service.workerName}
                        </p>
                        <p className="text-gray-700 mb-4">{service.description}</p>
                        <div className="font-medium">{service.price}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {approvedServices.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No approved services yet</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
