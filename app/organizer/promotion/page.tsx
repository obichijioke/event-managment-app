"use client";

import { Megaphone, Mail, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PromotionPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Promotion Tools</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Email Marketing</h3>
          <p className="text-gray-600 mb-4">
            Create and send beautiful email campaigns to promote your events.
          </p>
          <Button variant="outline" className="w-full">
            Create Campaign
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Share2 className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Social Media</h3>
          <p className="text-gray-600 mb-4">
            Share your events across multiple social media platforms.
          </p>
          <Button variant="outline" className="w-full">
            Share Events
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Megaphone className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Promotional Codes</h3>
          <p className="text-gray-600 mb-4">
            Create discount codes and special offers for your events.
          </p>
          <Button variant="outline" className="w-full">
            Create Promo Code
          </Button>
        </div>
      </div>
    </div>
  );
}
