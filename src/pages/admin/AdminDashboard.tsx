
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { CheckIcon, XIcon, ClockIcon, UserIcon, BriefcaseIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Mock data for pending approvals
const pendingServices = [
  {
    id: 1,
    title: "Home Network Setup",
    category: "Tech Support",
    provider: "John Smith",
    providerId: "worker123",
    price: "$80/hr",
    description: "Setup and configuration of home networks, WiFi, and smart home devices.",
    createdAt: "2023-05-18"
  },
  {
    id: 2,
    title: "Deep House Cleaning",
    category: "Cleaning",
    provider: "Maria Garcia",
    providerId: "worker456",
    price: "$120/session",
    description: "Thorough cleaning of all areas in your home, including kitchen, bathrooms, and living areas.",
    createdAt: "2023-05-20"
  },
  {
    id: 3,
    title: "Furniture Assembly",
    category: "Home Improvement",
    provider: "David Johnson",
    providerId: "worker789",
    price: "$50/hr",
    description: "Professional assembly of flat-pack furniture from IKEA, Wayfair, and other retailers.",
    createdAt: "2023-05-22"
  }
];

const AdminDashboard = () => {
  // This would typically come from a state management solution or API
  const stats = {
    totalUsers: 125,
    totalWorkers: 48,
    pendingApprovals: pendingServices.length,
    approvedServices: 86,
    rejectedServices: 12
  };
  
  const handleApprove = (id: number) => {
    console.log(`Approved service ${id}`);
    // This would trigger an API call in a real application
  };
  
  const handleReject = (id: number) => {
    console.log(`Rejected service ${id}`);
    // This would trigger an API call in a real application
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userType="admin" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage service listings and approvals</p>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-2xl">{stats.totalUsers}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <UserIcon className="h-4 w-4 text-blue-600 mr-1" />
                <span className="text-sm text-gray-500">Active accounts</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Service Providers</CardDescription>
              <CardTitle className="text-2xl">{stats.totalWorkers}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BriefcaseIcon className="h-4 w-4 text-orange-600 mr-1" />
                <span className="text-sm text-gray-500">Registered workers</span>
              </div>
            </CardContent>
          </Card>
          
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
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Rejected Services</CardDescription>
              <CardTitle className="text-2xl">{stats.rejectedServices}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <XIcon className="h-4 w-4 text-red-600 mr-1" />
                <span className="text-sm text-gray-500">Declined listings</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs for different sections */}
        <Tabs defaultValue="pending">
          <TabsList className="mb-6">
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
            <TabsTrigger value="approved">Approved Services</TabsTrigger>
            <TabsTrigger value="rejected">Rejected Services</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <div className="space-y-6">
              {pendingServices.map(service => (
                <Card key={service.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{service.title}</h3>
                          <Badge variant="outline">{service.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                          Submitted by {service.provider} on {service.createdAt}
                        </p>
                        <p className="text-gray-700 mb-4">{service.description}</p>
                        <div className="font-medium">{service.price}</div>
                      </div>
                      
                      <div className="flex flex-col gap-2 min-w-[140px]">
                        <Button 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(service.id)}
                        >
                          <CheckIcon className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleReject(service.id)}
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
            <div className="text-center py-12">
              <p className="text-gray-500">No approved services to display in this demo</p>
              <p className="text-sm text-gray-400 mt-2">This would show a list of approved services in the actual application</p>
            </div>
          </TabsContent>
          
          <TabsContent value="rejected">
            <div className="text-center py-12">
              <p className="text-gray-500">No rejected services to display in this demo</p>
              <p className="text-sm text-gray-400 mt-2">This would show a list of rejected services in the actual application</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
