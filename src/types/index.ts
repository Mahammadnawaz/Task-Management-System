export type Role = "ADMIN" | "USER";

export type Priority = "LOW" | "MEDIUM" | "HIGH";

export type Status = "TODO" | "IN_PROGRESS" | "COMPLETED";

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string | null;
}

export interface UserProfile extends UserSummary {
  createdAt: string;
  updatedAt: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string | null;
  priority: Priority;
  status: Status;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
  assignedToId?: string | null;
  assignedTo?: UserSummary | null;
  createdById: string;
  createdBy?: UserSummary | null;
}

export interface TaskCreateInput {
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate?: string | null;
  assignedToId?: string | null;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string | null;
  priority?: Priority;
  status?: Status;
  dueDate?: string | null;
  assignedToId?: string | null;
}

export interface TaskFilterOptions {
  search?: string;
  status?: Status | "ALL";
  priority?: Priority | "ALL";
  sortBy?: "dueDate" | "createdAt" | "priority" | "title";
  sortOrder?: "asc" | "desc";
  assignedToId?: string | "ALL";
}

export interface DashboardMetrics {
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
  statusBreakdown: { name: string; value: number; color: string }[];
  priorityBreakdown: { priority: string; count: number; completed: number }[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface AuthSession {
  user: UserSummary | null;
  token: string | null;
}
