"use client";

import { Code2, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConversionPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Conversion Setup</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Website Integration
              </h3>
              <p className="text-gray-600 mb-4">
                Add ticket purchasing directly to your website with our
                customizable widget.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <code className="text-sm text-gray-800">
                  {`<script src="https://eventhub.com/widget.js"></script>`}
                </code>
              </div>
              <Button variant="outline" className="w-full">
                Copy Code
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Code2 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">API Integration</h3>
              <p className="text-gray-600 mb-4">
                Access our powerful API to create custom integrations and
                automations.
              </p>
              <Button className="w-full bg-[#8BC34A] hover:bg-[#7CB342]">
                View API Documentation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Integration Status</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium">Website Widget</h4>
              <p className="text-sm text-gray-500">Not installed</p>
            </div>
            <Button variant="outline" size="sm">
              Verify Installation
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium">API Access</h4>
              <p className="text-sm text-gray-500">Not configured</p>
            </div>
            <Button variant="outline" size="sm">
              Generate API Key
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
