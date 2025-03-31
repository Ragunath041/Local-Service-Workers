
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";

type NavigationProps = {
  userType?: "user" | "worker" | "admin" | null;
};

const Navigation = ({ userType }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">WorkHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {userType ? (
              <>
                <NavLinks userType={userType} />
                <Button variant="ghost" className="ml-4 text-red-600 hover:text-red-700 hover:bg-red-50">
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/user/login">
                  <Button variant="ghost">User Login</Button>
                </Link>
                <Link to="/worker/login">
                  <Button variant="ghost">Worker Login</Button>
                </Link>
                <Link to="/admin/login">
                  <Button variant="ghost">Admin Login</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <XIcon /> : <MenuIcon />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {userType ? (
              <div className="flex flex-col space-y-2">
                <MobileNavLinks userType={userType} />
                <Button variant="ghost" className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link to="/user/login">
                  <Button variant="ghost" className="w-full justify-start">User Login</Button>
                </Link>
                <Link to="/worker/login">
                  <Button variant="ghost" className="w-full justify-start">Worker Login</Button>
                </Link>
                <Link to="/admin/login">
                  <Button variant="ghost" className="w-full justify-start">Admin Login</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

const NavLinks = ({ userType }: { userType: string }) => {
  if (userType === "user") {
    return (
      <>
        <Link to="/user/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
        <Link to="/user/services">
          <Button variant="ghost">Browse Services</Button>
        </Link>
        <Link to="/user/profile">
          <Button variant="ghost">My Profile</Button>
        </Link>
      </>
    );
  } else if (userType === "worker") {
    return (
      <>
        <Link to="/worker/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
        <Link to="/worker/services">
          <Button variant="ghost">My Services</Button>
        </Link>
        <Link to="/worker/profile">
          <Button variant="ghost">My Profile</Button>
        </Link>
      </>
    );
  } else if (userType === "admin") {
    return (
      <>
        <Link to="/admin/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
        <Link to="/admin/approvals">
          <Button variant="ghost">Approvals</Button>
        </Link>
        <Link to="/admin/settings">
          <Button variant="ghost">Settings</Button>
        </Link>
      </>
    );
  }
  return null;
};

const MobileNavLinks = ({ userType }: { userType: string }) => {
  if (userType === "user") {
    return (
      <>
        <Link to="/user/dashboard">
          <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
        </Link>
        <Link to="/user/services">
          <Button variant="ghost" className="w-full justify-start">Browse Services</Button>
        </Link>
        <Link to="/user/profile">
          <Button variant="ghost" className="w-full justify-start">My Profile</Button>
        </Link>
      </>
    );
  } else if (userType === "worker") {
    return (
      <>
        <Link to="/worker/dashboard">
          <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
        </Link>
        <Link to="/worker/services">
          <Button variant="ghost" className="w-full justify-start">My Services</Button>
        </Link>
        <Link to="/worker/profile">
          <Button variant="ghost" className="w-full justify-start">My Profile</Button>
        </Link>
      </>
    );
  } else if (userType === "admin") {
    return (
      <>
        <Link to="/admin/dashboard">
          <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
        </Link>
        <Link to="/admin/approvals">
          <Button variant="ghost" className="w-full justify-start">Approvals</Button>
        </Link>
        <Link to="/admin/settings">
          <Button variant="ghost" className="w-full justify-start">Settings</Button>
        </Link>
      </>
    );
  }
  return null;
};

export default Navigation;
