
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Find Trusted Service Providers In Your Area
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Connect with skilled professionals for all your service needs
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/user/login">
                <Button className="bg-white text-blue-600 hover:bg-blue-50">
                  Find Services
                </Button>
              </Link>
              <Link to="/worker/login">
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-blue-700">
                  Offer Services
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-12">
            <div className="bg-white p-1 rounded-lg shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                alt="Person searching for services" 
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
