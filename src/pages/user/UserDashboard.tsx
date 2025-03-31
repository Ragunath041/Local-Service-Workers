import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { useEffect, useState } from "react";
import { SearchIcon, MapPinIcon, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { servicesApi, Service } from "@/lib/services";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { SendMessageDialog } from "@/components/SendMessageDialog";
import { useAuth } from "@/lib/auth-context";

const UserDashboard = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const { user } = useAuth();

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await servicesApi.getServiceCategories();
        setCategories(data);
      } catch (error) {
        toast.error(
          error instanceof Error 
            ? error.message 
            : "Failed to fetch categories"
        );
      }
    };

    fetchCategories();
  }, []);

  // Fetch services based on selected category
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        let data: Service[];
        if (selectedCategory) {
          data = await servicesApi.getServicesByCategory(selectedCategory);
        } else {
          data = await servicesApi.getApprovedServices();
        }
        setServices(data);
      } catch (error) {
        toast.error(
          error instanceof Error 
            ? error.message 
            : "Failed to fetch services"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [selectedCategory]);

  const filteredServices = services.filter(service => {
    return (
      searchTerm === "" || 
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Services</h1>
          <p className="text-gray-600 mt-2">Discover and connect with service providers in your area</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle>Filter Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant={selectedCategory === null ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedCategory(null)}
                      >
                        All
                      </Badge>
                      {categories.map(category => (
                        <Badge 
                          key={category}
                          variant={selectedCategory === category ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="w-full md:w-3/4">
            <div className="mb-6">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search for services..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner className="h-8 w-8" />
              </div>
            ) : filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredServices.map(service => (
                  <Card key={service._id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold">{service.title}</h3>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <MapPinIcon className="h-4 w-4 mr-1" />
                              <span>{service.location}</span>
                            </div>
                          </div>
                          <Badge>{service.category}</Badge>
                        </div>
                        
                        <p className="mt-4 text-gray-600">{service.description}</p>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center text-gray-600">
                            <span className="font-medium">Provider:</span>
                            <span className="ml-2">{service.workerName}</span>
                          </div>
                          <div className="font-semibold">{service.price}</div>
                        </div>
                        
                        <div className="mt-6">
                          <Button 
                            className="w-full flex items-center justify-center"
                            onClick={() => {
                              if (!user) {
                                toast.error("Please log in to contact providers");
                                return;
                              }
                              setSelectedService(service);
                              setMessageDialogOpen(true);
                            }}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Contact Provider
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No services found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedService && (
        <SendMessageDialog
          open={messageDialogOpen}
          onOpenChange={setMessageDialogOpen}
          receiverId={selectedService.workerId}
          receiverName={selectedService.providerName || "Provider"}
          serviceId={selectedService._id}
          serviceTitle={selectedService.title}
          providerPhone={selectedService.providerPhone}
          providerEmail={selectedService.providerEmail}
        />
      )}
    </div>
  );
};

export default UserDashboard;
