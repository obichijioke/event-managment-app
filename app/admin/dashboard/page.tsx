"use client";

import { Card } from "@/components/ui/card";
import {
  Users,
  CalendarDays,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold mt-2">1,234</h3>
              <div className="flex items-center mt-2 text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm">12% increase</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Events</p>
              <h3 className="text-2xl font-bold mt-2">56</h3>
              <div className="flex items-center mt-2 text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm">8% increase</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CalendarDays className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-2">$12,345</h3>
              <div className="flex items-center mt-2 text-red-600">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                <span className="text-sm">3% decrease</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">System Status</p>
              <h3 className="text-2xl font-bold mt-2">98.9%</h3>
              <div className="flex items-center mt-2 text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm">Healthy</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  New User Registration
                </TableCell>
                <TableCell>john.doe@example.com</TableCell>
                <TableCell>Completed profile setup</TableCell>
                <TableCell>2 minutes ago</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Event Created</TableCell>
                <TableCell>sarah.smith@example.com</TableCell>
                <TableCell>Summer Music Festival 2024</TableCell>
                <TableCell>1 hour ago</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Payment Processed</TableCell>
                <TableCell>mike.brown@example.com</TableCell>
                <TableCell>$250.00 for Tech Conference</TableCell>
                <TableCell>3 hours ago</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Category Added</TableCell>
                <TableCell>admin@example.com</TableCell>
                <TableCell>New category: "Virtual Events"</TableCell>
                <TableCell>5 hours ago</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
