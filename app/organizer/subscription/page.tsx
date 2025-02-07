"use client";

import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubscriptionPage() {
  const plans = [
    {
      name: "Basic",
      price: "Free",
      features: [
        "Up to 2 events per month",
        "Basic analytics",
        "Email support",
        "Standard ticketing fees",
      ],
      current: true,
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      features: [
        "Unlimited events",
        "Advanced analytics",
        "Priority support",
        "Reduced ticketing fees",
        "Custom branding",
        "Promotional tools",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "All Pro features",
        "Dedicated account manager",
        "Custom integration",
        "Lowest ticketing fees",
        "API access",
        "SLA guarantee",
      ],
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Subscription Plans</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-white rounded-lg shadow-lg overflow-hidden ${
              plan.highlighted
                ? "ring-2 ring-[#8BC34A] transform scale-105"
                : ""
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                {plan.highlighted && (
                  <Star className="h-5 w-5 text-[#8BC34A]" fill="#8BC34A" />
                )}
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                )}
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-[#8BC34A]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  plan.current
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : plan.highlighted
                    ? "bg-[#8BC34A] hover:bg-[#7CB342]"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={plan.current}
              >
                {plan.current ? "Current Plan" : "Upgrade"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
