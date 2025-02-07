"use client";

import { useState } from "react";
import { Search, UserPlus, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Contact List</h1>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-[#8BC34A] hover:bg-[#7CB342]">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="border-b pb-4 mb-4">
            <h3 className="text-lg font-semibold">Contact Groups</h3>
          </div>
          <div className="text-center text-gray-500">
            <p>No contacts found. Start by adding your first contact!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
