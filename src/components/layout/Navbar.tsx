"use client";

import React from "react";
import { Menu, LogOut, CheckSquare } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { getInitials } from "@/lib/utils";

interface NavbarProps {
  onOpenMobileSidebar: () => void;
  title?: string;
  onCreateTaskClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileSidebar,
  title = "Dashboard",
  onCreateTaskClick,
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 md:px-8 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white lg:hidden">
            <CheckSquare className="h-5 w-5" />
          </div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {onCreateTaskClick && (
          <button
            onClick={onCreateTaskClick}
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
          >
            <span>+ New Task</span>
          </button>
        )}

        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-sm font-semibold text-brand-700 dark:bg-brand-900/50 dark:text-brand-300 ring-2 ring-brand-500/20">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(user?.name || "User")
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                {user?.name || "Guest"}
              </p>
              <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                {user?.role || "USER"}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            title="Log out"
            className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
