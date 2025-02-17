"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">System Settings</h1>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">General Settings</h2>

              <div className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    placeholder="Enter site name"
                    defaultValue="Event App"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    placeholder="Enter site URL"
                    defaultValue="https://eventapp.com"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="UTC">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">EST</SelectItem>
                      <SelectItem value="PST">PST</SelectItem>
                      <SelectItem value="GMT">GMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">
                      Enable maintenance mode to prevent user access
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Security Settings</h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">
                      Require 2FA for admin accounts
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Strong Password Policy</Label>
                    <p className="text-sm text-gray-500">
                      Enforce strong password requirements
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="sessionTimeout">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    placeholder="Enter timeout in minutes"
                    defaultValue="60"
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Email Settings</h2>

              <div className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input id="smtpHost" placeholder="Enter SMTP host" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    placeholder="Enter SMTP port"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input id="smtpUser" placeholder="Enter SMTP username" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="smtpPass">SMTP Password</Label>
                  <Input
                    id="smtpPass"
                    type="password"
                    placeholder="Enter SMTP password"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Enable system email notifications
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                Integration Settings
              </h2>

              <div className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="stripeKey">Stripe API Key</Label>
                  <Input
                    id="stripeKey"
                    type="password"
                    placeholder="Enter Stripe API key"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="googleApiKey">Google Maps API Key</Label>
                  <Input
                    id="googleApiKey"
                    type="password"
                    placeholder="Enter Google Maps API key"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Social Login</Label>
                    <p className="text-sm text-gray-500">
                      Enable social media login options
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end gap-4">
        <Button variant="outline">Reset Changes</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
