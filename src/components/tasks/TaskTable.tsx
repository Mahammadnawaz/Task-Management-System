"use client";

import React from "react";
import {
  Calendar,
  Clock,
  Pencil,
  Trash2,
} from "lucide-react";
import { TaskItem, Status } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { formatDate, isOverdue, getInitials, cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";

interface TaskTableProps {
  tasks: TaskItem[];
  onEdit: (task: TaskItem) => void;
  onDelete: (task: TaskItem) => void;
  onStatusChange: (task: TaskItem, newStatus: Status) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
              <th className="py-3.5 pl-6 pr-3">Task Details</th>
              <th className="px-3 py-3.5">Priority</th>
              <th className="px-3 py-3.5">Status</th>
              <th className="px-3 py-3.5">Due Date</th>
              <th className="px-3 py-3.5">Assignee</th>
              <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {tasks.map((task) => {
              const overdue = isOverdue(task.dueDate, task.status);
              const canModify =
                isAdmin ||
                task.createdById === user?.id ||
                task.assignedToId === user?.id;

              return (
                <tr
                  key={task.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-4 pl-6 pr-3 max-w-xs md:max-w-md">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">
                        {task.description}
                      </p>
                    )}
                  </td>

                  <td className="px-3 py-4 whitespace-nowrap">
                    <Badge variant="priority" priority={task.priority} size="sm" />
                  </td>

                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          onStatusChange(task, e.target.value as Status)
                        }
                        className={cn(
                          "rounded-lg border px-2.5 py-1 text-xs font-semibold focus:outline-none cursor-pointer transition-colors",
                          task.status === "COMPLETED" &&
                            "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
                          task.status === "IN_PROGRESS" &&
                            "border-indigo-300 bg-indigo-50 text-indigo-800 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300",
                          task.status === "TODO" &&
                            "border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        )}
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </div>
                  </td>

                  <td className="px-3 py-4 whitespace-nowrap">
                    {task.dueDate ? (
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 text-xs",
                          overdue
                            ? "font-semibold text-rose-600 dark:text-rose-400"
                            : "text-slate-600 dark:text-slate-400"
                        )}
                      >
                        {overdue ? (
                          <Clock className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
                        ) : (
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        )}
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">None</span>
                    )}
                  </td>

                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-[11px] font-semibold text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
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
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {task.assignedTo?.name || "Unassigned"}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 pl-3 pr-6 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      {canModify && (
                        <button
                          onClick={() => onEdit(task)}
                          title="Edit Task"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                      {canModify && (
                        <button
                          onClick={() => onDelete(task)}
                          title="Delete Task"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
