
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import HeroSection from "@/components/HeroSection";
import { BriefcaseIcon, UserIcon, ShieldIcon } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"user" | "worker" | "admin">("user");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <HeroSection />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Choose Your Login</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Access the platform based on your role
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className={`transition-all hover:shadow-lg ${activeTab === "user" ? "border-blue-500 shadow-md" : ""}`}
            onClick={() => setActiveTab("user")}>
            <CardHeader className="text-center">
              <div className="mx-auto bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="mt-4">User Login</CardTitle>
              <CardDescription>Find and hire service providers</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">Browse listings and connect with service providers for your needs</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link to="/user/login">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Continue as User</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className={`transition-all hover:shadow-lg ${activeTab === "worker" ? "border-blue-500 shadow-md" : ""}`}
            onClick={() => setActiveTab("worker")}>
            <CardHeader className="text-center">
              <div className="mx-auto bg-orange-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                <BriefcaseIcon className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="mt-4">Worker Login</CardTitle>
              <CardDescription>Offer your services and skills</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">Create listings for your services and connect with potential clients</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link to="/worker/login">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">Continue as Worker</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className={`transition-all hover:shadow-lg ${activeTab === "admin" ? "border-blue-500 shadow-md" : ""}`}
            onClick={() => setActiveTab("admin")}>
            <CardHeader className="text-center">
              <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                <ShieldIcon className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="mt-4">Admin Login</CardTitle>
              <CardDescription>Manage listings and approvals</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">Review and approve service listings to maintain quality standards</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link to="/admin/login">
                <Button className="w-full bg-green-600 hover:bg-green-700">Continue as Admin</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
