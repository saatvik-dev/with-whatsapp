import React, { useEffect, useState } from "react";
import { Route, useLocation } from "wouter";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType;
}

const ProtectedRoute = ({ path, component: Component }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem("adminAuthenticated");
    console.log("Auth check - authStatus:", authStatus);
    
    setIsAuthenticated(authStatus === "true");

    // Redirect to login if not authenticated
    if (authStatus !== "true") {
      console.log("Not authenticated, redirecting to login");
      setLocation("/admin-login");
    } else {
      console.log("User is authenticated, showing admin page");
    }
  }, [setLocation]);

  if (isAuthenticated === null) {
    return (
      <Route path={path}>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        </div>
      </Route>
    );
  }

  if (isAuthenticated) {
    return (
      <Route path={path}>
        <Component />
      </Route>
    );
  }

  // Return empty route to prevent rendering until redirect happens
  return <Route path={path}>{() => null}</Route>;
};

export default ProtectedRoute;