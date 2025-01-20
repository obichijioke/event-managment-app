"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { signInWithEmail, getSession } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Please enter a valid email address",
    }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const { data, error } = await signInWithEmail(
        values.email,
        values.password
      );

      if (error) {
        toast.error(error);
        return;
      }

      if (!data?.user) {
        toast.error("Login failed - no user data received");
        return;
      }

      // Get the intended destination from the URL or default to dashboard
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get("redirectTo") || "/organizer/dashboard";

      toast.success("Successfully signed in!");

      // Force a router refresh to update auth state
      router.refresh();

      // Wait for session to be established
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Verify session before redirect
      const { session, error: sessionError } = await getSession();
      if (sessionError || !session) {
        toast.error("Failed to establish session. Please try again.");
        return;
      }

      router.push(redirectTo);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        {...field}
                        type="email"
                        autoComplete="email"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        {...field}
                        type="password"
                        autoComplete="current-password"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
