"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Bell, Search, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/lib/user-context";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/copilot": "AI Copilot",
  "/finance": "Finance",
  "/finance/chart-of-accounts": "Chart of Accounts",
  "/finance/journal-entries": "Journal Entries",
  "/finance/journal-entries/new": "New Entry",
  "/finance/accounts-payable": "Accounts Payable",
  "/finance/accounts-receivable": "Accounts Receivable",
  "/finance/reports": "Reports",
  "/crm": "CRM",
  "/crm/dashboard": "Dashboard",
  "/crm/companies": "Companies",
  "/crm/contacts": "Contacts",
  "/crm/leads": "Leads",
  "/crm/deals": "Deals",
  "/admin": "Admin",
  "/admin/dashboard": "Dashboard",
  "/admin/users": "Users",
  "/admin/roles": "Roles & Permissions",
  "/admin/departments": "Departments",
  "/admin/org-chart": "Org Chart",
  "/settings": "Settings",
};

export function Header() {
  const pathname = usePathname();
  const { currentUser, allUsers, setCurrentUser, logout } = useUser();

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const crumbs: { label: string; path: string }[] = [];
    let currentPath = "";
    for (const segment of segments) {
      currentPath += `/${segment}`;
      const label = breadcrumbMap[currentPath] || segment;
      crumbs.push({ label, path: currentPath });
    }
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const initials = currentUser ? `${currentUser.firstName[0]}${currentUser.lastName[0]}` : "?";

  // Group users by department
  const usersByDept = allUsers.reduce<Record<string, typeof allUsers>>((acc, u) => {
    const dept = u.department?.name || "Other";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(u);
    return acc;
  }, {});

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <nav className="flex items-center space-x-1 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            {index > 0 && <span className="text-muted-foreground">/</span>}
            <span className={index === breadcrumbs.length - 1 ? "font-medium text-foreground" : "text-muted-foreground"}>
              {crumb.label}
            </span>
          </React.Fragment>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        {/* User Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 rounded-full pl-1 pr-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {initials}
              </div>
              {currentUser && (
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-xs font-medium leading-tight">{currentUser.firstName} {currentUser.lastName}</span>
                  <span className="text-[10px] text-muted-foreground leading-tight">{currentUser.role?.name || "No role"}</span>
                </div>
              )}
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 max-h-[400px] overflow-y-auto">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Switch User</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.entries(usersByDept).map(([dept, users]) => (
              <React.Fragment key={dept}>
                <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/70 py-1">{dept}</DropdownMenuLabel>
                {users.map((user) => (
                  <DropdownMenuItem
                    key={user.id}
                    onClick={() => setCurrentUser(user)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{user.firstName} {user.lastName}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{user.title}</p>
                    </div>
                    {currentUser?.id === user.id && <Check className="h-3 w-3 text-primary shrink-0" />}
                  </DropdownMenuItem>
                ))}
              </React.Fragment>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
