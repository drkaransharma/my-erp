"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/user-context";
import { ShieldX } from "lucide-react";
import type { ModuleName } from "@/types/admin";

interface RequirePermissionProps {
  module: ModuleName;
  action?: "view" | "create" | "edit" | "delete";
  children: React.ReactNode;
}

export function RequirePermission({ module, action = "view", children }: RequirePermissionProps) {
  const { hasPermission, loading, currentUser } = useUser();
  const router = useRouter();

  const allowed = hasPermission(module, action);

  useEffect(() => {
    if (!loading && currentUser && !allowed) {
      router.push("/dashboard");
    }
  }, [loading, currentUser, allowed, router]);

  if (loading || !currentUser) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;
  }

  if (!allowed) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <ShieldX className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium">Access Denied</h3>
        <p className="text-sm text-muted-foreground mt-1">You don't have permission to access this module.</p>
      </div>
    );
  }

  return <>{children}</>;
}
