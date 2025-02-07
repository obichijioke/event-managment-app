"use client";

import { Mail, Phone, Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">About EventHub</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              EventHub empowers event organizers to create unforgettable
              experiences. We provide the tools and platform you need to manage,
              promote, and sell tickets to your events with ease.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#8BC34A] mb-2">
                  1M+
                </div>
                <div className="text-sm text-gray-500">Tickets Sold</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#8BC34A] mb-2">
                  50k+
                </div>
                <div className="text-sm text-gray-500">Event Organizers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#8BC34A] mb-2">
                  100+
                </div>
                <div className="text-sm text-gray-500">Countries</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Latest Updates</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-[#8BC34A] pl-4">
                <div className="text-sm text-gray-500">March 2024</div>
                <div className="font-medium">New Analytics Dashboard</div>
                <p className="text-gray-600 text-sm">
                  Enhanced reporting features and real-time insights.
                </p>
              </div>
              <div className="border-l-4 border-[#8BC34A] pl-4">
                <div className="text-sm text-gray-500">February 2024</div>
                <div className="font-medium">Mobile App Launch</div>
                <p className="text-gray-600 text-sm">
                  Manage your events on the go with our new mobile app.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium">Email</div>
                  <a
                    href="mailto:support@eventhub.com"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    support@eventhub.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium">Phone</div>
                  <a
                    href="tel:+1-888-555-0123"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    +1 (888) 555-0123
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium">Website</div>
                  <a
                    href="https://eventhub.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    www.eventhub.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium">Address</div>
                  <div className="text-gray-600">
                    123 Event Street
                    <br />
                    San Francisco, CA 94105
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#8BC34A] to-[#7CB342] p-6 rounded-lg shadow-lg text-white">
            <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
            <p className="mb-4">
              Our support team is available 24/7 to assist you with any
              questions.
            </p>
            <Button
              variant="secondary"
              className="w-full bg-white text-[#8BC34A] hover:bg-gray-100"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
