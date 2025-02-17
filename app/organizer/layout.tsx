"use client";

import { SideNav } from "@/components/SideNav";

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <SideNav />
      <div className="pl-64">{children}</div>
    </div>
  );
}
