"use client";

import { CreditCard, DollarSign, Building, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PayoutsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Payouts</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Available Balance</span>
          </div>
          <div className="text-2xl font-bold">$0.00</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Pending</span>
          </div>
          <div className="text-2xl font-bold">$0.00</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Total Paid Out</span>
          </div>
          <div className="text-2xl font-bold">$0.00</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Payout Methods</h2>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No payout methods added yet</p>
            <Button className="bg-[#8BC34A] hover:bg-[#7CB342]">
              Add Payout Method
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
