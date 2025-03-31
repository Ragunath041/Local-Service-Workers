import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "./Navigation";

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle: string;
  userType: "user" | "worker" | "admin";
};

const AuthLayout = ({ children, title, subtitle, userType }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            <p className="mt-2 text-gray-600">{subtitle}</p>
          </div>
          
          <div className="bg-white py-8 px-6 shadow-md rounded-lg">
            {children}
          </div>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to={`/${userType}/register`}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Register here
              </Link>
            </p>
            <Link
              to="/"
              className="block mt-4 font-medium text-gray-500 hover:text-gray-700"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
