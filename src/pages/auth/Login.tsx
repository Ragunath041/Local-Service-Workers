import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authService } from '@/lib/auth';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import { BriefcaseIcon, UserIcon, ShieldIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

type Role = 'user' | 'worker' | 'admin';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('user');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(formData);
      
      // Verify that the returned role matches the selected role
      if (response.role !== selectedRole) {
        toast.error(`Invalid credentials for ${selectedRole} login`);
        setLoading(false);
        return;
      }
      
      // Use the auth context to set the user
      login(response);
      
      // Navigate to the return URL or role-specific dashboard
      const redirectTo = from === '/' ? `/${response.role}/dashboard` : from;
      navigate(redirectTo, { replace: true });
      
      toast.success('Login successful!');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign in to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedRole} onValueChange={(value: Role) => setSelectedRole(value)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="user" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                User
              </TabsTrigger>
              <TabsTrigger value="worker" className="flex items-center gap-2">
                <BriefcaseIcon className="h-4 w-4" />
                Worker
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <ShieldIcon className="h-4 w-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>

              <div className="text-center text-sm">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  {selectedRole !== 'admin' && (
                    <a
                      href={`/register/${selectedRole}`}
                      className="font-medium text-orange-600 hover:text-orange-500"
                    >
                      Register here
                    </a>
                  )}
                </p>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 