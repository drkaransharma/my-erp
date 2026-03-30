"use client";

import { cn } from "@/lib/utils";
import type { AdminUser } from "@/types/admin";

interface OrgNode {
  user: AdminUser;
  children: OrgNode[];
}

function buildTree(users: AdminUser[]): OrgNode[] {
  const map = new Map<string, OrgNode>();
  users.forEach((u) => map.set(u.id, { user: u, children: [] }));

  const roots: OrgNode[] = [];
  users.forEach((u) => {
    const node = map.get(u.id)!;
    if (u.reportsToId && map.has(u.reportsToId)) {
      map.get(u.reportsToId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

function OrgCard({ user }: { user: AdminUser }) {
  const initials = `${user.firstName[0]}${user.lastName[0]}`;
  const isLeader = !user.reportsToId;

  return (
    <div className={cn(
      "inline-flex flex-col items-center rounded-xl border bg-card px-4 py-3 shadow-sm min-w-[160px]",
      isLeader && "border-primary/30 shadow-md"
    )}>
      <div className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold mb-2",
        isLeader ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
      )}>
        {initials}
      </div>
      <p className="text-sm font-semibold text-center">{user.firstName} {user.lastName}</p>
      <p className="text-[11px] text-muted-foreground text-center">{user.title || "No title"}</p>
      {user.department && (
        <span className="mt-1 inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
          {user.department.name}
        </span>
      )}
    </div>
  );
}

function OrgNodeComponent({ node, isLast, isFirst }: { node: OrgNode; isLast: boolean; isFirst: boolean }) {
  const hasChildren = node.children.length > 0;

  return (
    <li className="relative flex flex-col items-center pt-5">
      {/* Horizontal connector from parent */}
      <div className="absolute top-0 left-0 right-0 h-5">
        {/* Vertical line down from horizontal */}
        <div className="absolute left-1/2 top-0 w-px h-full bg-border" />
        {/* Horizontal line connecting siblings */}
        {!isFirst && <div className="absolute top-0 left-0 right-1/2 h-px bg-border" />}
        {!isLast && <div className="absolute top-0 left-1/2 right-0 h-px bg-border" />}
      </div>

      <OrgCard user={node.user} />

      {hasChildren && (
        <>
          {/* Vertical line down to children */}
          <div className="w-px h-5 bg-border" />
          <ul className="flex gap-0 relative">
            {node.children.map((child, i) => (
              <OrgNodeComponent
                key={child.user.id}
                node={child}
                isFirst={i === 0}
                isLast={i === node.children.length - 1}
              />
            ))}
          </ul>
        </>
      )}
    </li>
  );
}

interface OrgChartTreeProps {
  users: AdminUser[];
}

export function OrgChartTree({ users }: OrgChartTreeProps) {
  const roots = buildTree(users);

  if (roots.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        No organizational data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-8">
      <div className="inline-flex justify-center min-w-full">
        <ul className="flex gap-0">
          {roots.map((root) => (
            <li key={root.user.id} className="flex flex-col items-center">
              <OrgCard user={root.user} />
              {root.children.length > 0 && (
                <>
                  <div className="w-px h-5 bg-border" />
                  <ul className="flex gap-0 relative">
                    {root.children.map((child, i) => (
                      <OrgNodeComponent
                        key={child.user.id}
                        node={child}
                        isFirst={i === 0}
                        isLast={i === root.children.length - 1}
                      />
                    ))}
                  </ul>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
