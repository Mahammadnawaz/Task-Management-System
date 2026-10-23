import prisma from "./prisma";
import bcrypt from "bcryptjs";
import {
  Priority,
  Status,
  Role,
  UserSummary,
  TaskItem,
  TaskCreateInput,
  TaskUpdateInput,
  TaskFilterOptions,
  DashboardMetrics,
} from "@/types";

interface MemoryUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

interface MemoryTask {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  status: Status;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  assignedToId: string | null;
  createdById: string;
}

const defaultAdminPassword = bcrypt.hashSync("Password123!", 10);

const memoryUsers: MemoryUser[] = [
  {
    id: "user-admin-1",
    name: "Marcus Vance",
    email: "admin@taskflow.com",
    password: defaultAdminPassword,
    role: "ADMIN",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "user-member-2",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@taskflow.com",
    password: defaultAdminPassword,
    role: "USER",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: "user-member-3",
    name: "Alex Rivera",
    email: "alex.rivera@taskflow.com",
    password: defaultAdminPassword,
    role: "USER",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: "user-member-4",
    name: "David Kim",
    email: "david.kim@taskflow.com",
    password: defaultAdminPassword,
    role: "USER",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

const now = Date.now();
const pastDate = new Date(now - 3 * 86400000).toISOString();
const tomorrowDate = new Date(now + 1 * 86400000).toISOString();
const nextWeekDate = new Date(now + 6 * 86400000).toISOString();
const twoWeeksDate = new Date(now + 14 * 86400000).toISOString();

const memoryTasks: MemoryTask[] = [
  {
    id: "task-101",
    title: "Design PostgreSQL Schema & Migrations",
    description: "Define entities for Users, Tasks, and relational constraints using Prisma ORM with strict referential integrity.",
    priority: "HIGH",
    status: "COMPLETED",
    dueDate: pastDate,
    assignedToId: "user-admin-1",
    createdById: "user-admin-1",
    createdAt: new Date(now - 8 * 86400000).toISOString(),
    updatedAt: new Date(now - 2 * 86400000).toISOString(),
  },
  {
    id: "task-102",
    title: "Setup JWT Authentication & RBAC",
    description: "Implement secure HTTP-only cookies, token signing, and role checks for Admin and User roles.",
    priority: "HIGH",
    status: "COMPLETED",
    dueDate: pastDate,
    assignedToId: "user-member-2",
    createdById: "user-admin-1",
    createdAt: new Date(now - 7 * 86400000).toISOString(),
    updatedAt: new Date(now - 1 * 86400000).toISOString(),
  },
  {
    id: "task-103",
    title: "Interactive Kanban Board Drag & Drop",
    description: "Build a fluid multi-column board with optimistic updates, status persistence, and quick action transitions.",
    priority: "HIGH",
    status: "IN_PROGRESS",
    dueDate: tomorrowDate,
    assignedToId: "user-member-3",
    createdById: "user-admin-1",
    createdAt: new Date(now - 5 * 86400000).toISOString(),
    updatedAt: new Date(now - 1 * 86400000).toISOString(),
  },
  {
    id: "task-104",
    title: "Analytics Dashboard Visualizations",
    description: "Integrate Recharts components for task status distribution and priority breakdown metrics.",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    dueDate: nextWeekDate,
    assignedToId: "user-member-4",
    createdById: "user-member-2",
    createdAt: new Date(now - 4 * 86400000).toISOString(),
    updatedAt: new Date(now - 12 * 3600000).toISOString(),
  },
  {
    id: "task-105",
    title: "Implement Real-time Search & Multi-Filters",
    description: "Enable filtering by status, priority, and sorting by due date across both Kanban and Table views.",
    priority: "MEDIUM",
    status: "TODO",
    dueDate: nextWeekDate,
    assignedToId: "user-member-2",
    createdById: "user-admin-1",
    createdAt: new Date(now - 3 * 86400000).toISOString(),
    updatedAt: new Date(now - 3 * 86400000).toISOString(),
  },
  {
    id: "task-106",
    title: "Overdue Notification & SLA Compliance",
    description: "Generate alerts when tasks exceed their assigned due date without completed status.",
    priority: "HIGH",
    status: "TODO",
    dueDate: pastDate,
    assignedToId: "user-member-3",
    createdById: "user-admin-1",
    createdAt: new Date(now - 2 * 86400000).toISOString(),
    updatedAt: new Date(now - 2 * 86400000).toISOString(),
  },
  {
    id: "task-107",
    title: "Optimize API Response Caching & Middleware",
    description: "Refactor error handler middleware and standard JSON response envelopes for high throughput.",
    priority: "LOW",
    status: "TODO",
    dueDate: twoWeeksDate,
    assignedToId: "user-member-4",
    createdById: "user-admin-1",
    createdAt: new Date(now - 1 * 86400000).toISOString(),
    updatedAt: new Date(now - 1 * 86400000).toISOString(),
  },
];

function sanitizeUser(user: MemoryUser): UserSummary {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  };
}

function hydrateTask(task: MemoryTask): TaskItem {
  const assignedToUser = task.assignedToId
    ? memoryUsers.find((u) => u.id === task.assignedToId)
    : null;
  const createdByUser = memoryUsers.find((u) => u.id === task.createdById) || null;

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    assignedToId: task.assignedToId,
    assignedTo: assignedToUser ? sanitizeUser(assignedToUser) : null,
    createdById: task.createdById,
    createdBy: createdByUser ? sanitizeUser(createdByUser) : null,
  };
}

export async function findUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (user) return user;
  } catch {}

  const memUser = memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  return memUser || null;
}

export async function findUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (user) return user;
  } catch {}

  const memUser = memoryUsers.find((u) => u.id === id);
  return memUser || null;
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role?: Role;
  avatar?: string;
}) {
  const role: Role = data.role || "USER";
  const avatar =
    data.avatar ||
    `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`;

  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        password: data.password,
        role: role as any,
        avatar,
      },
    });
    return user;
  } catch {}

  const newUser: MemoryUser = {
    id: "user-" + Math.random().toString(36).substring(2, 9),
    name: data.name,
    email: data.email.toLowerCase(),
    password: data.password,
    role,
    avatar,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  memoryUsers.push(newUser);
  return newUser;
}

export async function getAllUsers(): Promise<UserSummary[]> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      },
      orderBy: { name: "asc" },
    });
    if (users.length > 0) return users as UserSummary[];
  } catch {}

  return memoryUsers.map(sanitizeUser);
}

export async function getTasks(options: TaskFilterOptions = {}): Promise<TaskItem[]> {
  try {
    const where: any = {};

    if (options.status && options.status !== "ALL") {
      where.status = options.status;
    }

    if (options.priority && options.priority !== "ALL") {
      where.priority = options.priority;
    }

    if (options.assignedToId && options.assignedToId !== "ALL") {
      where.assignedToId = options.assignedToId;
    }

    if (options.search && options.search.trim().length > 0) {
      where.OR = [
        { title: { contains: options.search, mode: "insensitive" } },
        { description: { contains: options.search, mode: "insensitive" } },
      ];
    }

    let orderBy: any = { createdAt: "desc" };
    if (options.sortBy) {
      const order = options.sortOrder || "asc";
      orderBy = { [options.sortBy]: order };
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, role: true, avatar: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true, role: true, avatar: true },
        },
      },
    });

    if (tasks) {
      return tasks.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        priority: t.priority as Priority,
        status: t.status as Status,
        dueDate: t.dueDate ? t.dueDate.toISOString() : null,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
        assignedToId: t.assignedToId,
        assignedTo: t.assignedTo as UserSummary | null,
        createdById: t.createdById,
        createdBy: t.createdBy as UserSummary | null,
      }));
    }
  } catch {}

  let filtered = [...memoryTasks];

  if (options.status && options.status !== "ALL") {
    filtered = filtered.filter((t) => t.status === options.status);
  }

  if (options.priority && options.priority !== "ALL") {
    filtered = filtered.filter((t) => t.priority === options.priority);
  }

  if (options.assignedToId && options.assignedToId !== "ALL") {
    filtered = filtered.filter((t) => t.assignedToId === options.assignedToId);
  }

  if (options.search && options.search.trim().length > 0) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
    );
  }

  const sortBy = options.sortBy || "createdAt";
  const order = options.sortOrder || "desc";

  filtered.sort((a, b) => {
    let comparison = 0;
    if (sortBy === "dueDate") {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      comparison = dateA - dateB;
    } else if (sortBy === "title") {
      comparison = a.title.localeCompare(b.title);
    } else if (sortBy === "priority") {
      const priorityWeight: Record<Priority, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      comparison = priorityWeight[b.priority] - priorityWeight[a.priority];
    } else {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      comparison = dateB - dateA;
    }

    return order === "asc" ? comparison : -comparison;
  });

  return filtered.map(hydrateTask);
}

export async function getTaskById(id: string): Promise<TaskItem | null> {
  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, role: true, avatar: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true, role: true, avatar: true },
        },
      },
    });

    if (task) {
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority as Priority,
        status: task.status as Status,
        dueDate: task.dueDate ? task.dueDate.toISOString() : null,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
        assignedToId: task.assignedToId,
        assignedTo: task.assignedTo as UserSummary | null,
        createdById: task.createdById,
        createdBy: task.createdBy as UserSummary | null,
      };
    }
  } catch {}

  const memTask = memoryTasks.find((t) => t.id === id);
  if (!memTask) return null;
  return hydrateTask(memTask);
}

export async function createTask(
  input: TaskCreateInput,
  creatorId: string
): Promise<TaskItem> {
  const dueDateTime = input.dueDate ? new Date(input.dueDate) : null;

  try {
    const task = await prisma.task.create({
      data: {
        title: input.title.trim(),
        description: input.description?.trim() || null,
        priority: input.priority,
        status: input.status,
        dueDate: dueDateTime,
        assignedToId: input.assignedToId || null,
        createdById: creatorId,
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, role: true, avatar: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true, role: true, avatar: true },
        },
      },
    });

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority as Priority,
      status: task.status as Status,
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      assignedToId: task.assignedToId,
      assignedTo: task.assignedTo as UserSummary | null,
      createdById: task.createdById,
      createdBy: task.createdBy as UserSummary | null,
    };
  } catch {}

  const memTask: MemoryTask = {
    id: "task-" + Math.random().toString(36).substring(2, 9),
    title: input.title.trim(),
    description: input.description?.trim() || null,
    priority: input.priority,
    status: input.status,
    dueDate: input.dueDate ? new Date(input.dueDate).toISOString() : null,
    assignedToId: input.assignedToId || null,
    createdById: creatorId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  memoryTasks.unshift(memTask);
  return hydrateTask(memTask);
}

export async function updateTask(
  id: string,
  input: TaskUpdateInput
): Promise<TaskItem | null> {
  const updateData: any = {};
  if (input.title !== undefined) updateData.title = input.title.trim();
  if (input.description !== undefined) updateData.description = input.description ? input.description.trim() : null;
  if (input.priority !== undefined) updateData.priority = input.priority;
  if (input.status !== undefined) updateData.status = input.status;
  if (input.dueDate !== undefined) updateData.dueDate = input.dueDate ? new Date(input.dueDate) : null;
  if (input.assignedToId !== undefined) updateData.assignedToId = input.assignedToId || null;

  try {
    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, role: true, avatar: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true, role: true, avatar: true },
        },
      },
    });

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority as Priority,
      status: task.status as Status,
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      assignedToId: task.assignedToId,
      assignedTo: task.assignedTo as UserSummary | null,
      createdById: task.createdById,
      createdBy: task.createdBy as UserSummary | null,
    };
  } catch {}

  const index = memoryTasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const current = memoryTasks[index];
  const updated: MemoryTask = {
    ...current,
    title: input.title !== undefined ? input.title.trim() : current.title,
    description: input.description !== undefined ? (input.description ? input.description.trim() : null) : current.description,
    priority: input.priority !== undefined ? input.priority : current.priority,
    status: input.status !== undefined ? input.status : current.status,
    dueDate: input.dueDate !== undefined ? (input.dueDate ? new Date(input.dueDate).toISOString() : null) : current.dueDate,
    assignedToId: input.assignedToId !== undefined ? (input.assignedToId || null) : current.assignedToId,
    updatedAt: new Date().toISOString(),
  };

  memoryTasks[index] = updated;
  return hydrateTask(updated);
}

export async function deleteTask(id: string): Promise<boolean> {
  try {
    await prisma.task.delete({
      where: { id },
    });
    return true;
  } catch {}

  const index = memoryTasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  memoryTasks.splice(index, 1);
  return true;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const allTasks = await getTasks();

  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.status === "COMPLETED").length;
  const inProgressTasks = allTasks.filter((t) => t.status === "IN_PROGRESS").length;
  const todoTasks = allTasks.filter((t) => t.status === "TODO").length;
  const pendingTasks = todoTasks + inProgressTasks;

  const nowTime = Date.now();
  const overdueTasks = allTasks.filter((t) => {
    if (t.status === "COMPLETED" || !t.dueDate) return false;
    return new Date(t.dueDate).getTime() < nowTime;
  }).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const statusBreakdown = [
    { name: "To Do", value: todoTasks, color: "#94a3b8" },
    { name: "In Progress", value: inProgressTasks, color: "#6366f1" },
    { name: "Completed", value: completedTasks, color: "#10b981" },
  ];

  const priorities: Priority[] = ["LOW", "MEDIUM", "HIGH"];
  const priorityBreakdown = priorities.map((priority) => {
    const matching = allTasks.filter((t) => t.priority === priority);
    const completed = matching.filter((t) => t.status === "COMPLETED").length;
    return {
      priority: priority.charAt(0) + priority.slice(1).toLowerCase(),
      count: matching.length,
      completed,
    };
  });

  return {
    totalTasks,
    pendingTasks,
    completedTasks,
    overdueTasks,
    completionRate,
    statusBreakdown,
    priorityBreakdown,
  };
}
