"use client";

import React, { useState, useEffect, useCallback } from "react";
import { BarChart3, RefreshCw } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { StatusChart } from "@/components/dashboard/StatusChart";
import { PriorityChart } from "@/components/dashboard/PriorityChart";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/providers/ToastProvider";
import { DashboardMetrics } from "@/types";

export default function AnalyticsPage() {
  const { error: toastError } = useToast();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/analytics");
      const json = await res.json();
      if (json.success && json.data) {
        setMetrics(json.data);
      }
    } catch {
      toastError("Error", "Failed to retrieve analytics metrics.");
    } finally {
      setIsLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return (
    <DashboardLayout title="Analytics & Reports" onTaskCreated={fetchMetrics}>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-brand-600 dark:text-brand-400" />
              <span>Performance & Analytics</span>
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Aggregated insights across task completion rates, priorities, and deadlines.
            </p>
          </div>

          <button
            onClick={fetchMetrics}
            title="Refresh metrics"
            className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {isLoading && !metrics ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner size="lg" className="text-brand-600" />
          </div>
        ) : (
          metrics && (
            <>
              <MetricsGrid metrics={metrics} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StatusChart data={metrics.statusBreakdown} />
                <PriorityChart data={metrics.priorityBreakdown} />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                  Priority Completion Progress
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                  Completion percentage ratio across priority levels
                </p>

                <div className="space-y-5">
                  {metrics.priorityBreakdown.map((item) => {
                    const percent =
                      item.count > 0 ? Math.round((item.completed / item.count) * 100) : 0;

                    return (
                      <div key={item.priority} className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-800 dark:text-slate-200">
                            {item.priority} Priority
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            {item.completed} of {item.count} completed ({percent}%)
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-brand-600 dark:bg-brand-500 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )
        )}
      </div>
    </DashboardLayout>
  );
}
