import { IconMapPin, IconPhone, IconMail, IconClock, IconSend } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { quickLinks, socialLinks, footerLinks } from '@/constants/data';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { IconFacebook, IconTwitter, IconInstagram, IconLinkedin, IconWhatsApp } from '@/lib/icons';
import logoImg from '../assets/m-kitelogo.png';

const getSocialIcon = (iconName: string) => {
  switch (iconName) {
    case 'facebook':
      return <IconFacebook />;
    case 'twitter':
      return <IconTwitter />;
    case 'instagram':
      return <IconInstagram />;
    case 'linkedin':
      return <IconLinkedin />;
    case 'whatsapp':
      return <IconWhatsApp className="text-green-500" />;
    default:
      return null;
  }
};

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    console.log("Submitting newsletter subscription for:", email);
    
    try {
      // Use the proper URL format for both Netlify and local development
      // Netlify functions will be at /.netlify/functions/api/subscribe
      const url = window.location.hostname.includes('netlify') 
        ? '/.netlify/functions/api/subscribe' 
        : '/api/subscribe';
        
      console.log("Submitting newsletter to:", url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      console.log("Response status:", response.status);
      
      // Get the raw text first for better error diagnostics
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      
      // Try to parse as JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log("Server response (parsed):", responseData);
      } catch (jsonError) {
        console.error("Failed to parse response as JSON:", jsonError);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
      }
      
      if (response.ok && responseData.success) {
        toast({
          title: "Success!",
          description: "You've been subscribed to our newsletter.",
        });
        setEmail('');
      } else {
        console.error("Subscription error:", responseData);
        throw new Error(responseData.message || 'Failed to subscribe');
      }
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: "Error",
        description: `There was a problem subscribing to the newsletter: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-4 mb-6 w-full max-w-lg">
              <img 
                src={logoImg} 
                alt="M-Kite Logo" 
                className="h-[80px] sm:h-[85px] md:h-[85px] lg:h-[80px] w-auto transition-all" 
              />
              <div className="flex flex-col">
                <h1 className="text-2xl sm:text-2xl md:text-2xl lg:text-[28px] font-['Montserrat'] font-bold tracking-tight whitespace-nowrap text-center sm:text-left">
                  <span className="text-white">M-Kite</span>
                  <span className="text-amber-400"> Kitchen</span>
                </h1>
                <span className="text-[9px] sm:text-[9px] md:text-[10px] text-amber-400 font-medium mt-0.5 leading-tight text-center sm:text-left">
                  Aluminum Premium Modular Kitchen Cabinets
                </span>
              </div>
            </div>
            
            <p className="text-slate-300 mb-6">
              Revolutionizing modular kitchens with aluminum innovation. Built to last a lifetime with zero maintenance.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                    ${link.icon === 'whatsapp' 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-slate-800 text-slate-300 hover:bg-amber-600 hover:text-white'}`}
                  aria-label={`${link.icon === 'whatsapp' ? 'Chat with us on' : 'Follow us on'} ${link.icon}`}
                >
                  {getSocialIcon(link.icon)}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-['Montserrat'] font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-slate-300 hover:text-amber-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-['Montserrat'] font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <IconMapPin className="text-amber-400 mt-1 mr-3" />
                <span className="text-slate-300">123 Innovation Street, Design District, Mumbai, India - 400001</span>
              </li>
              <li className="flex items-center">
                <IconPhone className="text-amber-400 mr-3" />
                <span className="text-slate-300">+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <IconMail className="text-amber-400 mr-3" />
                <span className="text-slate-300">info@mkitekitchen.com</span>
              </li>
              <li className="flex items-center">
                <IconClock className="text-amber-400 mr-3" />
                <span className="text-slate-300">Mon-Sat: 10:00 AM - 7:00 PM</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-['Montserrat'] font-bold mb-6">Newsletter</h3>
            <p className="text-slate-300 mb-4">Subscribe to get the latest updates on our products and offers.</p>
            
            <form className="mb-4" onSubmit={handleSubscribe}>
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-2 rounded-l-lg border-none outline-none text-slate-800"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
                <Button 
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 rounded-r-lg transition-colors"
                  disabled={isSubmitting}
                >
                  <IconSend size={18} />
                </Button>
              </div>
            </form>
            
            <p className="text-slate-400 text-sm">
              By subscribing, you agree to our <Link href="/privacy-policy"><span className="text-amber-400 hover:underline cursor-pointer">Privacy Policy</span></Link> and consent to receive updates from our company.
            </p>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} M-Kite Kitchen. All rights reserved.
            </p>
            
            <div className="flex space-x-6">
              {footerLinks.map((link, index) => (
                link.href.startsWith('/') ? (
                  <Link key={index} href={link.href}>
                    <span className="text-slate-400 hover:text-amber-400 text-sm transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                ) : (
                  <a key={index} href={link.href} className="text-slate-400 hover:text-amber-400 text-sm transition-colors">
                    {link.label}
                  </a>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
