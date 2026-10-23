"use client";

import React from "react";
import { Search, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Priority, Status, TaskFilterOptions } from "@/types";

interface TaskFiltersProps {
  filters: TaskFilterOptions;
  onChange: (updated: Partial<TaskFilterOptions>) => void;
  onReset: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  const isFiltered =
    Boolean(filters.search) ||
    (filters.status && filters.status !== "ALL") ||
    (filters.priority && filters.priority !== "ALL") ||
    filters.sortBy !== "createdAt";

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={filters.search || ""}
            onChange={(e) => onChange({ search: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-9 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:focus:bg-slate-900"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ search: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800/50">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <select
              value={filters.status || "ALL"}
              onChange={(e) => onChange({ status: e.target.value as Status | "ALL" })}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none dark:text-slate-300 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800/50">
            <select
              value={filters.priority || "ALL"}
              onChange={(e) =>
                onChange({ priority: e.target.value as Priority | "ALL" })
              }
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none dark:text-slate-300 cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800/50">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <select
              value={filters.sortBy || "createdAt"}
              onChange={(e) => {
                const sortBy = e.target.value as any;
                const sortOrder = sortBy === "dueDate" ? "asc" : "desc";
                onChange({ sortBy, sortOrder });
              }}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none dark:text-slate-300 cursor-pointer"
            >
              <option value="createdAt">Newest First</option>
              <option value="dueDate">Due Date (Soonest)</option>
              <option value="priority">Priority Level</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>

          {isFiltered && (
            <button
              onClick={onReset}
              className="rounded-xl px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
