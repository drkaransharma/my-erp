"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/lib/user-context";
import type { ModuleName } from "@/types/admin";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  CreditCard,
  Receipt,
  BarChart3,
  Users,
  UserCircle,
  Package,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  ChevronDown,
  Sparkles,
  Shield,
  Network,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  disabled?: boolean;
}

interface NavGroup {
  title: string;
  icon: React.ElementType;
  items: NavItem[];
  disabled?: boolean;
  defaultOpen?: boolean;
  module?: ModuleName; // if set, only shown when user has view permission
}

const navGroups: NavGroup[] = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    defaultOpen: true,
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "AI Copilot", href: "/copilot", icon: Sparkles },
    ],
  },
  {
    title: "Finance",
    icon: CreditCard,
    defaultOpen: true,
    module: "finance",
    items: [
      { title: "Chart of Accounts", href: "/finance/chart-of-accounts", icon: BookOpen },
      { title: "Journal Entries", href: "/finance/journal-entries", icon: FileText },
      { title: "Accounts Payable", href: "/finance/accounts-payable", icon: CreditCard },
      { title: "Accounts Receivable", href: "/finance/accounts-receivable", icon: Receipt },
      { title: "Reports", href: "/finance/reports", icon: BarChart3 },
    ],
  },
  {
    title: "CRM",
    icon: Users,
    defaultOpen: true,
    module: "crm",
    items: [
      { title: "Dashboard", href: "/crm/dashboard", icon: BarChart3 },
      { title: "Companies", href: "/crm/companies", icon: Building2 },
      { title: "Contacts", href: "/crm/contacts", icon: UserCircle },
      { title: "Leads", href: "/crm/leads", icon: Users },
      { title: "Deals", href: "/crm/deals", icon: CreditCard },
    ],
  },
  {
    title: "HR",
    icon: UserCircle,
    disabled: true,
    module: "hr",
    items: [
      { title: "Employees", href: "#", icon: UserCircle, disabled: true, badge: "Soon" },
    ],
  },
  {
    title: "Inventory",
    icon: Package,
    disabled: true,
    module: "inventory",
    items: [
      { title: "Products", href: "#", icon: Package, disabled: true, badge: "Soon" },
    ],
  },
  {
    title: "Admin",
    icon: Shield,
    defaultOpen: false,
    module: "admin",
    items: [
      { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { title: "Users", href: "/admin/users", icon: Users },
      { title: "Roles", href: "/admin/roles", icon: Shield },
      { title: "Departments", href: "/admin/departments", icon: Building2 },
      { title: "Org Chart", href: "/admin/org-chart", icon: Network },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { hasPermission } = useUser();
  const [collapsed, setCollapsed] = useState(false);

  const filteredGroups = useMemo(() => {
    return navGroups.filter((group) => {
      if (!group.module) return true; // Overview always visible
      return hasPermission(group.module, "view");
    });
  }, [hasPermission]);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(navGroups.map((g) => [g.title, g.defaultOpen ?? false]))
  );

  const toggleGroup = (title: string) => {
    if (collapsed) return;
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <Building2 className="h-8 w-8 shrink-0 text-primary" />
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-lg font-bold">MyERP</span>
            <span className="text-[10px] text-muted-foreground">AI-Augmented Platform</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        {filteredGroups.map((group) => (
          <div key={group.title} className="mb-1">
            <button
              onClick={() => toggleGroup(group.title)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-accent/50",
                collapsed && "justify-center px-0",
                group.disabled && "opacity-50"
              )}
            >
              {collapsed ? (
                <group.icon className="h-4 w-4" />
              ) : (
                <>
                  <span className="flex-1 text-left">{group.title}</span>
                  {group.disabled && <Badge variant="secondary" className="text-[9px] px-1 py-0">Soon</Badge>}
                  {!group.disabled && (
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 transition-transform",
                        openGroups[group.title] && "rotate-180"
                      )}
                    />
                  )}
                </>
              )}
            </button>

            {!collapsed && openGroups[group.title] && !group.disabled && (
              <div className="ml-2 space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.disabled ? "#" : item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        item.disabled && "pointer-events-none opacity-50"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-[10px]">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      <Separator />

      {/* Bottom section */}
      <div className="p-2">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
            collapsed && "justify-center",
            pathname === "/settings" && "bg-primary/10 text-primary font-medium"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("mt-1 w-full", collapsed ? "justify-center" : "justify-start")}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && <span className="ml-2 text-xs">Collapse</span>}
        </Button>
      </div>
    </aside>
  );
}
