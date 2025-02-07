"use client";

import {
  BarChart3,
  PieChart,
  Download,
  DollarSign,
  Ticket,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Total Sales</h3>
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold">$0.00</p>
          <p className="text-sm text-gray-500 mt-2">Last 30 days</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Tickets Sold</h3>
            <Ticket className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold">0</p>
          <p className="text-sm text-gray-500 mt-2">Last 30 days</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Active Events</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold">0</p>
          <p className="text-sm text-gray-500 mt-2">Current</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">Sales Overview</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center border-t">
            <p className="text-gray-500">No data available</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">Ticket Types Distribution</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center border-t">
            <p className="text-gray-500">No data available</p>
          </div>
        </div>
      </div>
    </div>
  );
}
