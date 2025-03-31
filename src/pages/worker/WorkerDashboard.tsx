
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { PlusIcon, CheckCircle2Icon, XCircleIcon, ClockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

// Mock data for worker's services
const services = [
  {
    id: 1,
    title: "Expert Electrical Repairs",
    description: "Professional electrical repair services for residential and commercial properties.",
    price: "$65/hr",
    status: "Approved",
    createdAt: "2023-05-15"
  },
  {
    id: 2,
    title: "Home Network Setup",
    description: "Setup and configuration of home networks, WiFi, and smart home devices.",
    price: "$80/hr",
    status: "Pending",
    createdAt: "2023-05-18"
  },
  {
    id: 3,
    title: "Electrical System Inspection",
    description: "Thorough inspection of electrical systems to identify and prevent potential issues.",
    price: "$100/inspection",
    status: "Rejected",
    feedback: "Please provide more details about your qualifications and the inspection process.",
    createdAt: "2023-05-10"
  }
];

const WorkerDashboard = () => {
  const navigate = useNavigate();
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return null;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle2Icon className="h-5 w-5 text-green-600" />;
      case "Pending":
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case "Rejected":
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userType="worker" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
            <p className="text-gray-600 mt-2">Manage your service listings</p>
          </div>
          <Button 
            onClick={() => navigate("/worker/services/create")}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add New Service
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <Card key={service.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{service.title}</CardTitle>
                  {getStatusBadge(service.status)}
                </div>
                <CardDescription>Added on {service.createdAt}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="font-semibold text-lg">{service.price}</div>
                
                {service.status === "Rejected" && service.feedback && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
                    <p className="text-sm font-medium text-red-800">Feedback:</p>
                    <p className="text-sm text-red-600">{service.feedback}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex items-center">
                  {getStatusIcon(service.status)}
                  <span className="ml-2 text-sm text-gray-600">{service.status}</span>
                </div>
                <Button variant="outline" onClick={() => navigate(`/worker/services/${service.id}`)}>
                  Edit
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default WorkerDashboard;
