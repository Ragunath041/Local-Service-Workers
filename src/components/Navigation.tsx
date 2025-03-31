import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Messages } from "@/components/Messages";
import { LogOut } from "lucide-react";

export function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <span className="text-xl font-bold">Local Service Workers</span>
          {user?.role === 'admin' && (
            <>
              <a href="/admin/dashboard" className="text-sm font-medium">
                Dashboard
              </a>
              <a href="/admin/approvals" className="text-sm font-medium">
                Approvals
              </a>
            </>
          )}
        </div>
        <div className="ml-auto flex items-center space-x-4">
          {user && (
            <>
              {user.role !== 'admin' && <Messages />}
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
