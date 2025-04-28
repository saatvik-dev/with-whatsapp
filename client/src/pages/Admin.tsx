import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconArrowRight, IconMapPin, IconPhone, IconMail } from "@/lib/icons";
import { LogOut } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  message?: string;
  kitchenSize?: string;
  budget?: string;
  createdAt: string;
}

interface Newsletter {
  id: number;
  email: string;
  subscribedAt: string;
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState("contacts");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { 
    data: contactsResponse, 
    isLoading: contactsLoading, 
    error: contactsError 
  } = useQuery<{success: boolean, data: Contact[]}>({
    queryKey: ['/api/admin/contacts'],
  });

  const { 
    data: newslettersResponse, 
    isLoading: newslettersLoading, 
    error: newslettersError 
  } = useQuery<{success: boolean, data: Newsletter[]}>({
    queryKey: ['/api/admin/newsletters'],
  });
  
  // Extract the actual data arrays from the response
  const contacts = contactsResponse?.data;
  const newsletters = newslettersResponse?.data;

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    setLocation("/admin-login");
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP p');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button 
              variant="destructive" 
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut size={18} /> Logout
            </Button>
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2">
                <IconArrowRight className="rotate-180" /> Back to Website
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="contacts" onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="contacts">Contact Form Submissions</TabsTrigger>
            <TabsTrigger value="newsletters">Newsletter Subscriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Contact Form Submissions</CardTitle>
                <CardDescription>
                  View all contact inquiries submitted through the website.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {contactsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-amber-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Loading contact submissions...</p>
                  </div>
                ) : contactsError ? (
                  <div className="text-center py-8 text-red-500">
                    <p>Error loading contact submissions. Please try again later.</p>
                  </div>
                ) : contacts && contacts.length > 0 ? (
                  <div className="space-y-6">
                    {contacts.map((contact) => (
                      <div key={contact.id} className="bg-slate-50 p-6 rounded-lg shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                          <h3 className="font-bold text-xl mb-2 sm:mb-0">{contact.name}</h3>
                          <span className="text-sm text-slate-500">{formatDate(contact.createdAt)}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <IconMail className="text-teal-600" />
                            <a href={`mailto:${contact.email}`} className="text-teal-600 hover:underline">
                              {contact.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <IconPhone className="text-teal-600" />
                            <a href={`tel:${contact.phone}`} className="text-teal-600 hover:underline">
                              {contact.phone}
                            </a>
                          </div>
                        </div>
                        {(contact.kitchenSize || contact.budget) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-slate-600">
                            {contact.kitchenSize && (
                              <div>
                                <span className="font-medium">Kitchen Size:</span> {contact.kitchenSize}
                              </div>
                            )}
                            {contact.budget && (
                              <div>
                                <span className="font-medium">Budget:</span> {contact.budget}
                              </div>
                            )}
                          </div>
                        )}
                        {contact.message && (
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Message:</h4>
                            <p className="text-slate-600 whitespace-pre-line">{contact.message}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-lg">
                    <p className="text-lg text-slate-600">No contact form submissions yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="newsletters">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Subscriptions</CardTitle>
                <CardDescription>
                  View all newsletter subscribers from the website.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {newslettersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-amber-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Loading newsletter subscriptions...</p>
                  </div>
                ) : newslettersError ? (
                  <div className="text-center py-8 text-red-500">
                    <p>Error loading newsletter subscriptions. Please try again later.</p>
                  </div>
                ) : newsletters && newsletters.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="text-left p-4 rounded-tl-lg">Email</th>
                          <th className="text-left p-4 rounded-tr-lg">Subscribed On</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {newsletters.map((newsletter) => (
                          <tr key={newsletter.id} className="hover:bg-slate-50">
                            <td className="p-4">
                              <a href={`mailto:${newsletter.email}`} className="text-teal-600 hover:underline">
                                {newsletter.email}
                              </a>
                            </td>
                            <td className="p-4 text-slate-600">{formatDate(newsletter.subscribedAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-lg">
                    <p className="text-lg text-slate-600">No newsletter subscriptions yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;