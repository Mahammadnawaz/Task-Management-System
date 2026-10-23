"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";
import { TaskItem } from "@/types";

interface DeleteTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleted: (taskId: string) => void;
  task: TaskItem | null;
}

export const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({
  isOpen,
  onClose,
  onDeleted,
  task,
}) => {
  const { success, error: toastError } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!task) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to delete task.");
      }

      success("Task Deleted", `Task "${task.title}" has been permanently removed.`);
      onDeleted(task.id);
      onClose();
    } catch (err: any) {
      toastError("Delete Failed", err.message || "Could not delete task.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 mb-4">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Delete Task
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Are you sure you want to permanently delete{" "}
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            &ldquo;{task.title}&rdquo;
          </span>
          ? This action cannot be undone.
        </p>

        <div className="mt-6 flex w-full items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            className="w-full"
            isLoading={isDeleting}
            onClick={handleDelete}
          >
            Delete Task
          </Button>
        </div>
      </div>
    </Modal>
  );
};
