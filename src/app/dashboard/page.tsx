"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Plus, RefreshCw, KanbanSquare } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { StatusChart } from "@/components/dashboard/StatusChart";
import { PriorityChart } from "@/components/dashboard/PriorityChart";
import { TaskTable } from "@/components/tasks/TaskTable";
import { TaskModal } from "@/components/tasks/TaskModal";
import { DeleteTaskModal } from "@/components/tasks/DeleteTaskModal";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { TaskItem, DashboardMetrics, Status } from "@/types";

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentTasks, setRecentTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [taskToEdit, setTaskToEdit] = useState<TaskItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<TaskItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [metricsRes, tasksRes] = await Promise.all([
        fetch("/api/analytics"),
        fetch("/api/tasks?sortBy=createdAt&sortOrder=desc"),
      ]);

      const metricsJson = await metricsRes.json();
      const tasksJson = await tasksRes.json();

      if (metricsJson.success && metricsJson.data) {
        setMetrics(metricsJson.data);
      }

      if (tasksJson.success && Array.isArray(tasksJson.data)) {
        setRecentTasks(tasksJson.data.slice(0, 5));
      }
    } catch {
      toastError("Failed to Load", "Unable to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (task: TaskItem, newStatus: Status) => {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update status.");
      }

      success("Status Updated", `Task moved to ${newStatus.replace("_", " ").toLowerCase()}.`);
      fetchData();
    } catch (err: any) {
      toastError("Update Error", err.message || "Failed to update task.");
    }
  };

  const handleEditTask = (task: TaskItem) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };

  const handleDeleteTask = (task: TaskItem) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  return (
    <DashboardLayout title="Overview Dashboard" onTaskCreated={fetchData}>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              Welcome back, {user?.name || "Team Member"}!
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Here is your workspace progress, priority breakdown, and recent tasks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              title="Refresh data"
              className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <Link
              href="/dashboard/kanban"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <KanbanSquare className="h-4 w-4" />
              <span>Open Kanban</span>
            </Link>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New Task</span>
            </button>
          </div>
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

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      Recent Tasks
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Latest additions and active work items
                    </p>
                  </div>
                  <Link
                    href="/dashboard/tasks"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 transition-colors"
                  >
                    <span>View All Tasks</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <TaskTable
                  tasks={recentTasks}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              </div>
            </>
          )
        )}
      </div>

      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => fetchData()}
      />

      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
        onSuccess={() => fetchData()}
      />

      <DeleteTaskModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        task={taskToDelete}
        onDeleted={() => fetchData()}
      />
    </DashboardLayout>
  );
}
