import { IconWhatsApp } from "@/lib/icons";
import { useState, useEffect } from "react";
import { contactInfo } from "@/constants/data";

export const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Get phone number from contact info
  const phoneContact = contactInfo.find(item => item.icon === 'phone');
  // Clean up the phone number - remove spaces and non-numeric characters except +
  const phoneNumber = phoneContact ? phoneContact.text.replace(/\s+/g, '').replace(/[^\d+]/g, '') : "+919948148890";
  const message = "Hello! I'm interested in M-Kite Kitchen.";
  
  // WhatsApp URL with pre-filled message
  const whatsappUrl = `https://wa.me/${+919948148890}?text=${encodeURIComponent(message)}`;

  // Show button after scrolling a bit
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Always visible by default
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center">
      <span className="mb-2 rounded-full bg-white px-3 py-1 text-xs font-medium shadow-md transition-all duration-300 hover:bg-gray-100">
        Chat on WhatsApp
      </span>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-75"></span>
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-green-500">
          <IconWhatsApp size={30} />
        </span>
      </a>
    </div>
  );
};

export default WhatsAppButton;