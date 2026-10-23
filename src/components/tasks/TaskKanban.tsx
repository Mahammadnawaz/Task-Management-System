"use client";

import React from "react";
import { CircleDot, PlayCircle, CheckCircle2, Plus } from "lucide-react";
import { TaskItem, Status } from "@/types";
import { TaskCard } from "./TaskCard";

interface TaskKanbanProps {
  tasks: TaskItem[];
  onEdit: (task: TaskItem) => void;
  onDelete: (task: TaskItem) => void;
  onStatusChange: (task: TaskItem, newStatus: Status) => void;
  onAddTask: (status: Status) => void;
}

export const TaskKanban: React.FC<TaskKanbanProps> = ({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  onAddTask,
}) => {
  const columns: {
    status: Status;
    title: string;
    icon: React.ReactNode;
    colorClasses: string;
    badgeClasses: string;
  }[] = [
    {
      status: "TODO",
      title: "To Do",
      icon: <CircleDot className="h-4 w-4 text-slate-500" />,
      colorClasses: "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40",
      badgeClasses: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    },
    {
      status: "IN_PROGRESS",
      title: "In Progress",
      icon: <PlayCircle className="h-4 w-4 text-indigo-500" />,
      colorClasses: "border-indigo-100 dark:border-indigo-950/60 bg-indigo-50/20 dark:bg-indigo-950/20",
      badgeClasses: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300",
    },
    {
      status: "COMPLETED",
      title: "Completed",
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      colorClasses: "border-emerald-100 dark:border-emerald-950/60 bg-emerald-50/20 dark:bg-emerald-950/20",
      badgeClasses: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {columns.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.status);

        return (
          <div
            key={column.status}
            className={`flex flex-col rounded-2xl border ${column.colorClasses} p-4 shadow-sm min-h-[500px]`}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2">
                {column.icon}
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {column.title}
                </h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${column.badgeClasses}`}
                >
                  {columnTasks.length}
                </span>
              </div>

              <button
                onClick={() => onAddTask(column.status)}
                title={`Add task to ${column.title}`}
                className="flex items-center justify-center h-7 w-7 rounded-lg text-slate-500 hover:bg-white hover:text-brand-600 hover:shadow-sm dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-brand-400 transition-all"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
              {columnTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 py-12 text-center text-slate-400">
                  <p className="text-xs">No tasks in this column</p>
                  <button
                    onClick={() => onAddTask(column.status)}
                    className="mt-2 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    + Create one now
                  </button>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
