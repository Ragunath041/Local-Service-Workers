
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { useState } from "react";
import { SearchIcon, MapPinIcon, StarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock data for services
const services = [
  {
    id: 1,
    title: "Professional Plumbing Services",
    category: "Home Repair",
    rating: 4.8,
    reviews: 124,
    location: "New York, NY",
    description: "Expert plumbing services for residential and commercial properties. Available 24/7 for emergencies.",
    price: "$50/hr",
    status: "Approved"
  },
  {
    id: 2,
    title: "Interior House Painting",
    category: "Home Improvement",
    rating: 4.6,
    reviews: 89,
    location: "Brooklyn, NY",
    description: "Quality interior painting services with attention to detail. Free color consultation included.",
    price: "$35/hr",
    status: "Approved"
  },
  {
    id: 3,
    title: "Lawn Mowing & Garden Maintenance",
    category: "Landscaping",
    rating: 4.7,
    reviews: 56,
    location: "Queens, NY",
    description: "Regular lawn mowing, garden maintenance, and seasonal clean-ups for residential properties.",
    price: "$40/hr",
    status: "Approved"
  },
  {
    id: 4,
    title: "Professional Carpet Cleaning",
    category: "Cleaning",
    rating: 4.5,
    reviews: 72,
    location: "Bronx, NY",
    description: "Deep carpet cleaning using eco-friendly products. Removes stains, odors, and allergens.",
    price: "$0.30/sq ft",
    status: "Approved"
  }
];

const UserDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = [...new Set(services.map(service => service.category))];
  
  const filteredServices = services.filter(service => {
    return (
      (searchTerm === "" || 
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) &&
      (selectedCategory === null || service.category === selectedCategory)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userType="user" />
      
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
            
            <div className="grid grid-cols-1 gap-6">
              {filteredServices.length > 0 ? (
                filteredServices.map(service => (
                  <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow">
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
                          <div className="flex items-center">
                            <StarIcon className="h-5 w-5 text-yellow-500 mr-1" />
                            <span className="font-medium">{service.rating}</span>
                            <span className="text-gray-500 ml-1">({service.reviews} reviews)</span>
                          </div>
                          <div className="font-semibold">{service.price}</div>
                        </div>
                        
                        <div className="mt-6">
                          <Button className="w-full">Contact Provider</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No services found matching your criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
