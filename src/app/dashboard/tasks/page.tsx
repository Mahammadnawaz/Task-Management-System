"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, RefreshCw, ListTodo } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskTable } from "@/components/tasks/TaskTable";
import { TaskModal } from "@/components/tasks/TaskModal";
import { DeleteTaskModal } from "@/components/tasks/DeleteTaskModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/providers/ToastProvider";
import { TaskItem, TaskFilterOptions, Status } from "@/types";

export default function TaskListPage() {
  const { success, error: toastError } = useToast();

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<TaskFilterOptions>({
    search: "",
    status: "ALL",
    priority: "ALL",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [taskToEdit, setTaskToEdit] = useState<TaskItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<TaskItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.status && filters.status !== "ALL") params.set("status", filters.status);
      if (filters.priority && filters.priority !== "ALL") params.set("priority", filters.priority);
      if (filters.sortBy) params.set("sortBy", filters.sortBy);
      if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);

      const res = await fetch(`/api/tasks?${params.toString()}`);
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        setTasks(json.data);
      }
    } catch {
      toastError("Error", "Failed to retrieve tasks.");
    } finally {
      setIsLoading(false);
    }
  }, [filters, toastError]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleStatusChange = async (task: TaskItem, newStatus: Status) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    );

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

      success("Status Updated", `Moved to ${newStatus.replace("_", " ").toLowerCase()}.`);
    } catch (err: any) {
      toastError("Update Error", err.message || "Failed to persist status change.");
      fetchTasks();
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
    <DashboardLayout title="Task List" onTaskCreated={fetchTasks}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ListTodo className="h-6 w-6 text-brand-600 dark:text-brand-400" />
              <span>All Tasks</span>
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Detailed tabular view with filters, sorting, and inline updates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchTasks}
              title="Refresh task list"
              className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        <TaskFilters
          filters={filters}
          onChange={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
          onReset={() =>
            setFilters({
              search: "",
              status: "ALL",
              priority: "ALL",
              sortBy: "createdAt",
              sortOrder: "desc",
            })
          }
        />

        {isLoading && tasks.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner size="lg" className="text-brand-600" />
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No tasks found"
            description="No work items match your current search and filter selections."
            actionLabel="Create New Task"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <TaskTable
            tasks={tasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>

      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => fetchTasks()}
      />

      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
        onSuccess={() => fetchTasks()}
      />

      <DeleteTaskModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        task={taskToDelete}
        onDeleted={() => fetchTasks()}
      />
    </DashboardLayout>
  );
}
