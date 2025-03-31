import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navigation } from "@/components/Navigation";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { servicesApi } from "@/lib/services";
import { useAuth } from "@/lib/auth-context";
import { Spinner } from "@/components/ui/spinner";

const categories = [
  "Home Repair",
  "Home Improvement",
  "Cleaning",
  "Landscaping",
  "Electrical",
  "Plumbing",
  "Personal Services",
  "Tech Support",
  "Other"
];

const EditService = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) {
        toast.error("Service ID not found");
        navigate("/worker/dashboard");
        return;
      }
      
      try {
        console.log("Fetching service with ID:", serviceId);
        const service = await servicesApi.getService(serviceId);
        console.log("Fetched service:", service);
        
        if (!service) {
          toast.error("Service not found");
          navigate("/worker/dashboard");
          return;
        }

        // Verify the service belongs to the current worker
        if (service.workerId !== user?._id) {
          toast.error("You don't have permission to edit this service");
          navigate("/worker/dashboard");
          return;
        }

        setTitle(service.title);
        setDescription(service.description);
        setCategory(service.category);
        setPrice(service.price);
        setLocation(service.location);
      } catch (error: any) {
        console.error("Error fetching service:", error);
        toast.error(error.response?.data?.error || "Failed to fetch service");
        navigate("/worker/dashboard");
      } finally {
        setIsFetching(false);
      }
    };

    fetchService();
  }, [serviceId, navigate, user?._id]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceId) {
      toast.error("Service ID not found");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await servicesApi.updateService(serviceId, {
        title,
        description,
        price,
        category,
        location
      });
      
      toast.success("Service updated successfully!");
      navigate("/worker/dashboard");
    } catch (error: any) {
      console.error("Error updating service:", error);
      toast.error(error.response?.data?.error || "Failed to update service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <Spinner className="h-8 w-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Service</h1>
          <p className="text-gray-600 mt-2">Update your service listing details</p>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
            <CardDescription>
              Update the form below to modify your service listing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Service Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Professional Plumbing Services"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your service in detail..."
                  rows={5}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g., $50/hr or $200 flat rate"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., New York, NY"
                  required
                />
              </div>
              
              <div className="pt-4 flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/worker/dashboard")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-orange-600 hover:bg-orange-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Service"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EditService; 