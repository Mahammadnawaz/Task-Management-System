"use client";

import React from "react";
import {
  CheckCircle2,
  Clock,
  ListTodo,
  AlertOctagon,
} from "lucide-react";
import { DashboardMetrics } from "@/types";

interface MetricsGridProps {
  metrics: DashboardMetrics;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  const cards = [
    {
      title: "Total Tasks",
      value: metrics.totalTasks,
      subtitle: "Across all pipelines",
      icon: ListTodo,
      color: "text-brand-600 dark:text-brand-400",
      bg: "bg-brand-50 dark:bg-brand-950/50",
      border: "border-brand-100 dark:border-brand-900/40",
    },
    {
      title: "Pending Tasks",
      value: metrics.pendingTasks,
      subtitle: "In progress & to do",
      icon: Clock,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/50",
      border: "border-indigo-100 dark:border-indigo-900/40",
    },
    {
      title: "Completed Tasks",
      value: metrics.completedTasks,
      subtitle: `${metrics.completionRate}% completion rate`,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/50",
      border: "border-emerald-100 dark:border-emerald-900/40",
    },
    {
      title: "Overdue Tasks",
      value: metrics.overdueTasks,
      subtitle: "Action required immediately",
      icon: AlertOctagon,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-950/50",
      border: "border-rose-100 dark:border-rose-900/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`flex flex-col justify-between rounded-2xl border ${card.border} bg-white p-5 shadow-sm dark:bg-slate-900 transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} ${card.color}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                  {card.value}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
