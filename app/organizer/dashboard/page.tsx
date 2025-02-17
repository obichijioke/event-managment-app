"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Package,
  Users,
  Eye,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample data for the graph
const data = [
  { name: "Mon", value: 4 },
  { name: "Tue", value: 8 },
  { name: "Wed", value: 6 },
  { name: "Thu", value: 7 },
  { name: "Fri", value: 6 },
  { name: "Sat", value: 4 },
  { name: "Sun", value: 8 },
];

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState(
    "1st April, 2022 - 30th April, 2022"
  );

  const handleDateChange = (direction: "prev" | "next") => {
    // This is a placeholder function that would normally calculate the actual date range
    if (direction === "prev") {
      setDateRange("1st March, 2022 - 31st March, 2022");
    } else {
      setDateRange("1st May, 2022 - 31st May, 2022");
    }
  };

  return (
    <div className="p-8">
      {/* Date Navigation */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDateChange("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDateChange("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-sm">{dateRange}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Selected Events (1)
          </span>
          <Select defaultValue="monthly">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 bg-[#8B5CF6] text-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">REVENUE (AUD)</h3>
            <DollarSign className="h-6 w-6 opacity-75" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold">$550.00</p>
            <p className="text-sm opacity-75">0.00% From Previous Period</p>
          </div>
        </Card>

        <Card className="p-6 bg-[#F87171] text-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">ORDERS</h3>
            <Package className="h-6 w-6 opacity-75" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold">2</p>
            <p className="text-sm opacity-75">0.00% From Previous Period</p>
          </div>
        </Card>

        <Card className="p-6 bg-[#60A5FA] text-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">PAGE VIEWS</h3>
            <Eye className="h-6 w-6 opacity-75" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold">30</p>
            <p className="text-sm opacity-75">0.00% From Previous Period</p>
          </div>
        </Card>

        <Card className="p-6 bg-[#4ADE80] text-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">TICKET SALES</h3>
            <Users className="h-6 w-6 opacity-75" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold">3</p>
            <p className="text-sm opacity-75">0.00% From Previous Period</p>
          </div>
        </Card>
      </div>

      {/* Revenue Graph */}
      <Card className="p-6">
        <div className="mb-4">
          <Select defaultValue="revenue">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="orders">Orders</SelectItem>
              <SelectItem value="pageViews">Page Views</SelectItem>
              <SelectItem value="ticketSales">Ticket Sales</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-2">
            See the graphical representation below
          </p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8BC34A"
                strokeWidth={2}
                dot={{ fill: "#8BC34A" }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
