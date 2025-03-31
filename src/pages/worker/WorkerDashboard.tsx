import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { PlusIcon, CheckCircle2Icon, XCircleIcon, ClockIcon, MapPinIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { servicesApi, Service } from "@/lib/services";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const WorkerDashboard = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchServices = async () => {
      if (!user?._id) {
        toast.error("User ID not found. Please try logging in again.");
        return;
      }

      try {
        const data = await servicesApi.getWorkerServices(user._id);
        setServices(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to fetch services");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [user?._id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2Icon className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
            <p className="text-gray-600 mt-2">Manage your service listings</p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={() => navigate("/worker/services/create")}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add New Service
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner className="h-8 w-8" />
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <Card key={service._id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{service.title}</CardTitle>
                    {getStatusBadge(service.status)}
                  </div>
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center mt-2">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      <span>{service.location}</span>
                    </div>
                    <div className="mt-1">Added on {new Date(service.createdAt).toLocaleDateString()}</div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="font-semibold text-lg">{service.price}</div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="flex items-center">
                    {getStatusIcon(service.status)}
                    <span className="ml-2 text-sm text-gray-600">{service.status}</span>
                  </div>
                  <Button variant="outline" onClick={() => navigate(`/worker/services/edit/${service._id}`)}>
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">You haven't created any services yet</p>
            <Button 
              onClick={() => navigate("/worker/services/create")}
              className="mt-4 bg-orange-600 hover:bg-orange-700"
            >
              Create Your First Service
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkerDashboard;
