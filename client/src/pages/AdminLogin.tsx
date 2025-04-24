import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconCube } from "@/lib/icons";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

// Hard-coded credentials for simplicity
// In a real application, this would be validated against a database
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "M-Kite2025";

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Check if already logged in
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (isAuthenticated === "true") {
      setLocation("/admin");
    }
  }, [setLocation]);
  
  // Form setup
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);
    
    // Log the credentials for debugging
    console.log("Login attempt:", {
      entered: { username: data.username, password: data.password },
      expected: { username: ADMIN_USERNAME, password: ADMIN_PASSWORD }
    });
    
    // Try a simpler approach for authentication
    try {
      // Simple authentication check - using exact string comparison
      const usernameMatches = data.username.trim() === ADMIN_USERNAME.trim();
      const passwordMatches = data.password.trim() === ADMIN_PASSWORD.trim();
      
      console.log("Login check:", { usernameMatches, passwordMatches });
      
      if (usernameMatches && passwordMatches) {
        // Store authentication state in localStorage
        window.localStorage.setItem("adminAuthenticated", "true");
        console.log("Authentication successful, localStorage set");
        
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
        
        // Short timeout to ensure localStorage is set
        setTimeout(() => {
          // Redirect to admin dashboard
          setLocation("/admin");
        }, 100);
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password. Please try admin/M-Kite2025",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-teal-600 text-3xl"><IconCube size={28} /></span>
              <h1 className="text-2xl font-['Montserrat'] font-bold tracking-tight">
                <span className="text-slate-800">M-Kite</span>
                <span className="text-teal-600">Kitchen</span>
              </h1>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
          <div className="mt-2 text-teal-600 font-medium text-center">
            Username: admin / Password: M-Kite2025
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter username" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter password" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-teal-600 hover:bg-teal-700" 
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-slate-500">
            This is a restricted area. Unauthorized access is prohibited.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;