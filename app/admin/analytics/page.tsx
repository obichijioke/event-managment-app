"use client";

import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock data - replace with actual API data
const revenueData = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 2000 },
  { month: "Apr", revenue: 2780 },
  { month: "May", revenue: 1890 },
  { month: "Jun", revenue: 2390 },
];

const userActivityData = [
  { name: "Mon", users: 120 },
  { name: "Tue", users: 150 },
  { name: "Wed", users: 180 },
  { name: "Thu", users: 140 },
  { name: "Fri", users: 160 },
  { name: "Sat", users: 190 },
  { name: "Sun", users: 130 },
];

const eventCategoryData = [
  { name: "Music", value: 400 },
  { name: "Technology", value: 300 },
  { name: "Sports", value: 300 },
  { name: "Arts", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <Select defaultValue="30">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Revenue Chart */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ fill: "#8884d8" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* User Activity Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">User Activity</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Event Categories Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Event Categories</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {eventCategoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Total Revenue
          </h3>
          <p className="text-3xl font-bold">$16,060</p>
          <p className="text-sm text-green-600 mt-2">+12% from last month</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Active Users
          </h3>
          <p className="text-3xl font-bold">1,234</p>
          <p className="text-sm text-green-600 mt-2">+8% from last month</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Total Events
          </h3>
          <p className="text-3xl font-bold">56</p>
          <p className="text-sm text-green-600 mt-2">+15% from last month</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Ticket Sales
          </h3>
          <p className="text-3xl font-bold">892</p>
          <p className="text-sm text-red-600 mt-2">-3% from last month</p>
        </Card>
      </div>
    </div>
  );
}
