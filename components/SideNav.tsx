"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarDays,
  Megaphone,
  Users,
  Wallet2,
  BarChart3,
  Cog,
  Settings2,
  UserCircle2,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/organizer/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Events",
    href: "/organizer/events",
    icon: CalendarDays,
  },
  {
    name: "Promotion",
    href: "/organizer/promotion",
    icon: Megaphone,
  },
  {
    name: "Contact List",
    href: "/organizer/contacts",
    icon: Users,
  },
  {
    name: "Payouts",
    href: "/organizer/payouts",
    icon: Wallet2,
  },
  {
    name: "Reports",
    href: "/organizer/reports",
    icon: BarChart3,
  },
  {
    name: "Subscription",
    href: "/organizer/subscription",
    icon: Cog,
  },
  {
    name: "Conversion Setup",
    href: "/organizer/conversion",
    icon: Settings2,
  },
  {
    name: "About",
    href: "/organizer/about",
    icon: UserCircle2,
  },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-white border-r h-screen fixed left-0 top-0 pt-4">
      <div className="px-3 py-2">
        <Link href="/" className="flex items-center gap-2 px-4 py-3 mb-6">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            EventHub
          </span>
        </Link>
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Menu</h2>
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  isActive
                    ? "bg-[#8BC34A] text-white"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
