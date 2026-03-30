"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ListTodo, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GeneratedTask } from "@/lib/task-generator";

const priorityConfig = {
  high: { label: "High", class: "bg-red-100 text-red-800 border-red-200" },
  medium: { label: "Med", class: "bg-amber-100 text-amber-800 border-amber-200" },
  low: { label: "Low", class: "bg-slate-100 text-slate-700 border-slate-200" },
};

const moduleConfig: Record<string, { label: string; class: string }> = {
  finance: { label: "Finance", class: "bg-blue-100 text-blue-800" },
  crm: { label: "CRM", class: "bg-purple-100 text-purple-800" },
  hr: { label: "HR", class: "bg-emerald-100 text-emerald-800" },
  inventory: { label: "Inventory", class: "bg-orange-100 text-orange-800" },
  general: { label: "General", class: "bg-slate-100 text-slate-800" },
};

interface TaskListProps {
  tasks: GeneratedTask[];
}

export function TaskList({ tasks }: TaskListProps) {
  const router = useRouter();
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const toggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const pendingTasks = tasks.filter((t) => !completed.has(t.id));
  const completedTasks = tasks.filter((t) => completed.has(t.id));

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <ListTodo className="h-4 w-4" />
            Weekly Pending Tasks
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            {completedTasks.length}/{tasks.length} done
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-2">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: tasks.length > 0 ? `${(completedTasks.length / tasks.length) * 100}%` : "0%" }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {pendingTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => router.push(task.href)}
              className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
            >
              <button onClick={(e) => toggle(e, task.id)} className="mt-0.5 shrink-0">
                <Circle className="h-5 w-5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-snug group-hover:text-primary transition-colors">{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn("inline-flex rounded-full px-1.5 py-0 text-[10px] font-medium border", priorityConfig[task.priority].class)}>
                    {priorityConfig[task.priority].label}
                  </span>
                  <span className={cn("inline-flex rounded-full px-1.5 py-0 text-[10px] font-medium", moduleConfig[task.module].class)}>
                    {moduleConfig[task.module].label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{task.dueLabel}</span>
                </div>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/0 group-hover:text-muted-foreground/50 mt-1 shrink-0 transition-colors" />
            </div>
          ))}

          {completedTasks.length > 0 && (
            <>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground/50 pt-3 pb-1 font-medium">
                Completed
              </div>
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={(e) => toggle(e, task.id)}
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors opacity-50"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm line-through">{task.title}</p>
                </div>
              ))}
            </>
          )}

          {tasks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No tasks for this week. You're all caught up!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
