"use client";

import React from "react";
import {
  Calendar,
  MoreVertical,
  Clock,
  ArrowRight,
  ArrowLeft,
  Pencil,
  Trash2,
} from "lucide-react";
import { TaskItem, Status } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { formatDate, isOverdue, getInitials, cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";

interface TaskCardProps {
  task: TaskItem;
  onEdit: (task: TaskItem) => void;
  onDelete: (task: TaskItem) => void;
  onStatusChange: (task: TaskItem, newStatus: Status) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const { user, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const overdue = isOverdue(task.dueDate, task.status);

  const canModify =
    isAdmin || task.createdById === user?.id || task.assignedToId === user?.id;

  const nextStatusMap: Record<Status, Status | null> = {
    TODO: "IN_PROGRESS",
    IN_PROGRESS: "COMPLETED",
    COMPLETED: null,
  };

  const prevStatusMap: Record<Status, Status | null> = {
    TODO: null,
    IN_PROGRESS: "TODO",
    COMPLETED: "IN_PROGRESS",
  };

  const nextStatus = nextStatusMap[task.status];
  const prevStatus = prevStatusMap[task.status];

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="priority" priority={task.priority} size="sm" />

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-7 z-30 w-36 rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  {canModify && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onEdit(task);
                      }}
                      className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit Details
                    </button>
                  )}
                  {canModify && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete(task);
                      }}
                      className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete Task
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
            {task.title}
          </h4>
          {task.description && (
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {task.dueDate ? (
            <div
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium",
                overdue
                  ? "text-rose-600 dark:text-rose-400 font-semibold"
                  : "text-slate-500 dark:text-slate-400"
              )}
            >
              {overdue ? (
                <Clock className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
              ) : (
                <Calendar className="h-3.5 w-3.5" />
              )}
              <span>{formatDate(task.dueDate)}</span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-400">No deadline</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {prevStatus && (
            <button
              onClick={() => onStatusChange(task, prevStatus)}
              title={`Move back to ${prevStatus.toLowerCase()}`}
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
          )}

          {nextStatus && (
            <button
              onClick={() => onStatusChange(task, nextStatus)}
              title={`Advance to ${nextStatus.toLowerCase()}`}
              className="rounded p-1 text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-950/40"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}

          <div
            title={
              task.assignedTo ? `Assigned to ${task.assignedTo.name}` : "Unassigned"
            }
            className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 ring-1 ring-slate-300 dark:ring-slate-700 shrink-0"
          >
            {task.assignedTo?.avatar ? (
              <img
                src={task.assignedTo.avatar}
                alt={task.assignedTo.name}
                className="h-full w-full object-cover"
              />
            ) : (
              getInitials(task.assignedTo?.name || "?")
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
