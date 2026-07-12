import { currentUser } from "@clerk/nextjs/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Bell,
  Eye,
  Palette,
} from "lucide-react";

export const metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const user = await currentUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight mb-8">Settings</h1>

        {/* Account Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              Account Information
            </CardTitle>
            <CardDescription>
              Your personal account details managed by Clerk.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <User className="size-3.5" />
                Name
              </span>
              <span className="text-sm font-medium">
                {user?.fullName ?? "Not set"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="size-3.5" />
                Email
              </span>
              <span className="text-sm font-medium">
                {user?.primaryEmailAddress?.emailAddress ?? "Not available"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Shield className="size-3.5" />
                Account ID
              </span>
              <span className="text-xs font-mono text-muted-foreground truncate max-w-[200px]">
                {user?.id ?? "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="size-3.5" />
                Member Since
              </span>
              <span className="text-sm font-medium">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="size-5" />
              Preferences
            </CardTitle>
            <CardDescription>
              Customize your Pigmentra experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium flex items-center gap-2">
                  <Bell className="size-3.5" />
                  Email Notifications
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Receive updates about your generations and account.
                </p>
              </div>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium flex items-center gap-2">
                  <Eye className="size-3.5" />
                  Default Style
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Set your preferred default style for new generations.
                </p>
              </div>
              <Badge variant="outline">Classic Oil</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <Shield className="size-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions for your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Delete Account</div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Permanently delete your account and all associated data.
                </p>
              </div>
              <Button variant="destructive" size="sm" disabled>
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
