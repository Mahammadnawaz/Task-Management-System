"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  KanbanSquare,
  ListTodo,
  BarChart3,
  PlusCircle,
  CheckSquare,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onCloseMobile?: () => void;
  onCreateTaskClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onCloseMobile,
  onCreateTaskClick,
}) => {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();

  const navItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Kanban Board",
      href: "/dashboard/kanban",
      icon: KanbanSquare,
    },
    {
      label: "Task List",
      href: "/dashboard/tasks",
      icon: ListTodo,
    },
    {
      label: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
  ];

  return (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-md shadow-brand-500/20">
            <CheckSquare className="h-6 w-6" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              TaskFlow
            </span>
            <span className="block text-[11px] font-medium text-slate-400">
              Enterprise Workspace
            </span>
          </div>
        </div>

        {onCreateTaskClick && (
          <button
            onClick={() => {
              onCreateTaskClick();
              if (onCloseMobile) onCloseMobile();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 active:scale-[0.99] transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create Task</span>
          </button>
        )}

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-semibold shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive
                      ? "text-brand-600 dark:text-brand-400"
                      : "text-slate-400 dark:text-slate-500"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-slate-700 text-brand-600 dark:text-brand-400">
            {isAdmin ? (
              <ShieldCheck className="h-4 w-4" />
            ) : (
              <UserCheck className="h-4 w-4" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
              {user?.name || "Active Session"}
            </p>
            <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
              {user?.email || "Signed in"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
