import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@/lib/icons";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button
            variant="outline"
            className="mb-8 flex items-center gap-2"
          >
            <IconArrowRight className="rotate-180" /> Back to Home
          </Button>
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-slate-600 mb-8">Last Updated: April 24, 2025</p>

        <div className="prose prose-slate max-w-none">
          <h2>Introduction</h2>
          <p>
            M-Kite Kitchen ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
          
          <h2>Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul>
            <li><strong>Personal Information:</strong> Name, email address, phone number, and other contact details you provide when filling out our contact form or subscribing to our newsletter.</li>
            <li><strong>Usage Information:</strong> Information about how you use our website, including pages visited, time spent on those pages, and other statistics.</li>
            <li><strong>Device Information:</strong> Information about the device you use to access our website, including IP address, browser type, and operating system.</li>
          </ul>
          
          <h2>How We Use Your Information</h2>
          <p>We may use the information we collect for various purposes, including:</p>
          <ul>
            <li>To provide and maintain our services</li>
            <li>To respond to your inquiries and provide customer support</li>
            <li>To send you marketing and promotional communications (with your consent)</li>
            <li>To improve our website and services</li>
            <li>To analyze usage patterns and trends</li>
            <li>To protect against fraudulent or illegal activity</li>
          </ul>
          
          <h2>Information Sharing and Disclosure</h2>
          <p>We may share your information in the following situations:</p>
          <ul>
            <li><strong>Service Providers:</strong> We may share your information with third-party vendors who provide services on our behalf, such as hosting, email delivery, and customer service.</li>
            <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</li>
            <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
          </ul>
          
          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure.
          </p>
          
          <h2>Your Rights</h2>
          <p>Depending on your location, you may have the following rights regarding your personal information:</p>
          <ul>
            <li>Access and receive a copy of your personal information</li>
            <li>Rectify inaccurate or incomplete information</li>
            <li>Request deletion of your personal information</li>
            <li>Restrict or object to processing of your information</li>
            <li>Data portability</li>
            <li>Withdraw consent (where processing is based on consent)</li>
          </ul>
          
          <h2>Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
          
          <h2>Children's Privacy</h2>
          <p>
            Our services are not intended for individuals under the age of 16. We do not knowingly collect personal information from children under 16. If we become aware that we have collected personal information from a child under 16, we will take steps to delete that information.
          </p>
          
          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
          
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p>
            Email: 18squarehd@gmail.com<br />
            Address:HINCH, Hafeezpet, Gopalnagar, Hyderabad, Telangana - 500072<br />
            Phone: +91 9515133774
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;