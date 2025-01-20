"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const { session, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Signed out successfully");
    router.push("/login");
    router.refresh();
  };

  const isActive = (path: string) => pathname === path;

  if (isLoading) {
    return (
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <span className="text-xl font-semibold">Event App</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-semibold">
              Event App
            </Link>
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Home
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {session.user.email}
                </span>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="text-sm"
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className={`text-sm ${
                      isActive("/login")
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    variant="default"
                    className={`text-sm ${
                      isActive("/signup") ? "opacity-90" : ""
                    }`}
                  >
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
