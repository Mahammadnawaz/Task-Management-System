"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";
import { TaskItem, Priority, Status, UserSummary } from "@/types";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (task: TaskItem) => void;
  taskToEdit?: TaskItem | null;
  defaultStatus?: Status;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  taskToEdit,
  defaultStatus = "TODO",
}) => {
  const { success, error: toastError } = useToast();
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [status, setStatus] = useState<Status>(defaultStatus);
  const [dueDate, setDueDate] = useState("");
  const [assignedToId, setAssignedToId] = useState("");
  const [errors, setErrors] = useState<{ title?: string; general?: string }>({});

  useEffect(() => {
    if (isOpen) {
      fetch("/api/users")
        .then((res) => res.json())
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setUsers(res.data);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || "");
      setDescription(taskToEdit.description || "");
      setPriority(taskToEdit.priority || "MEDIUM");
      setStatus(taskToEdit.status || "TODO");
      setDueDate(
        taskToEdit.dueDate
          ? new Date(taskToEdit.dueDate).toISOString().split("T")[0]
          : ""
      );
      setAssignedToId(taskToEdit.assignedToId || "");
    } else {
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setStatus(defaultStatus);
      setDueDate("");
      setAssignedToId("");
    }
    setErrors({});
  }, [taskToEdit, defaultStatus, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrors({ title: "Task title is required." });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        assignedToId: assignedToId || null,
      };

      const url = taskToEdit ? `/api/tasks/${taskToEdit.id}` : "/api/tasks";
      const method = taskToEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to save task.");
      }

      success(
        taskToEdit ? "Task Updated" : "Task Created",
        `Task "${title}" was saved successfully.`
      );

      onSuccess(json.data);
      onClose();
    } catch (err: any) {
      toastError("Action Failed", err.message || "Unable to save task.");
      setErrors({ general: err.message || "Unable to save task." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorityOptions = [
    { value: "LOW", label: "Low Priority" },
    { value: "MEDIUM", label: "Medium Priority" },
    { value: "HIGH", label: "High Priority" },
  ];

  const statusOptions = [
    { value: "TODO", label: "To Do" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "COMPLETED", label: "Completed" },
  ];

  const userOptions = [
    { value: "", label: "Unassigned" },
    ...users.map((u) => ({
      value: u.id,
      label: `${u.name} (${u.role})`,
    })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? "Edit Task" : "Create New Task"}
      description={
        taskToEdit
          ? "Update details, progress status, and assignee."
          : "Assign work, establish priorities, and set due dates."
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-600 dark:bg-rose-950/40 dark:text-rose-300">
            {errors.general}
          </div>
        )}

        <Input
          label="Task Title"
          placeholder="e.g., Integrate Payment Gateway API"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          required
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add detailed task requirements, context, or acceptance criteria..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Priority Level"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            options={priorityOptions}
          />

          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            options={statusOptions}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <Select
            label="Assignee"
            value={assignedToId}
            onChange={(e) => setAssignedToId(e.target.value)}
            options={userOptions}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {taskToEdit ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
