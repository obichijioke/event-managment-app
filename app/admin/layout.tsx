import { AdminSideNav } from "@/components/admin/AdminSideNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSideNav />
      <div className="pl-64">{children}</div>
    </div>
  );
}
