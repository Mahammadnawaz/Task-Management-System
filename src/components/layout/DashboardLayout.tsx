"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { TaskModal } from "@/components/tasks/TaskModal";
import { TaskItem, Status } from "@/types";
import { useAuth } from "@/components/providers/AuthProvider";
import { Spinner } from "@/components/ui/Spinner";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  onTaskCreated?: (task: TaskItem) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title = "Dashboard",
  onTaskCreated,
}) => {
  const { isLoading, user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [modalDefaultStatus, setModalDefaultStatus] = useState<Status>("TODO");

  const openCreateModal = (status: Status = "TODO") => {
    setModalDefaultStatus(status);
    setCreateModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" className="text-brand-600" />
          <p className="text-xs font-semibold text-slate-500">Loading TaskFlow...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar onCreateTaskClick={() => openCreateModal("TODO")} />
      </div>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex w-full max-w-xs flex-1 flex-col">
            <Sidebar
              onCloseMobile={() => setMobileSidebarOpen(false)}
              onCreateTaskClick={() => {
                setMobileSidebarOpen(false);
                openCreateModal("TODO");
              }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar
          title={title}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onCreateTaskClick={() => openCreateModal("TODO")}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      <TaskModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        defaultStatus={modalDefaultStatus}
        onSuccess={(task) => {
          if (onTaskCreated) onTaskCreated(task);
        }}
      />
    </div>
  );
};
