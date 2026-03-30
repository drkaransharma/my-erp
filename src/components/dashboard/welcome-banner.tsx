"use client";

import { Badge } from "@/components/ui/badge";
import type { AdminUser } from "@/types/admin";

interface WelcomeBannerProps {
  user: AdminUser;
  taskCount: number;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function WelcomeBanner({ user, taskCount }: WelcomeBannerProps) {
  return (
    <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {getGreeting()}, {user.firstName}
          </h1>
          <p className="text-muted-foreground mt-1">
            {user.title || "Team Member"} &middot; {user.department?.name || "No Department"} &middot;{" "}
            <span className="text-primary font-medium">{user.role?.name || "No Role"}</span>
          </p>
        </div>
        <div className="hidden sm:flex flex-col items-center rounded-xl bg-card border px-5 py-3 shadow-sm">
          <span className="text-3xl font-bold text-primary">{taskCount}</span>
          <span className="text-xs text-muted-foreground">Pending Tasks</span>
        </div>
      </div>
    </div>
  );
}
