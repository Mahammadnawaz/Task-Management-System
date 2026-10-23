import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash("Password123!", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Marcus Vance",
      email: "admin@taskflow.com",
      password: passwordHash,
      role: "ADMIN",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  const sarah = await prisma.user.create({
    data: {
      name: "Sarah Jenkins",
      email: "sarah.jenkins@taskflow.com",
      password: passwordHash,
      role: "USER",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
  });

  const alex = await prisma.user.create({
    data: {
      name: "Alex Rivera",
      email: "alex.rivera@taskflow.com",
      password: passwordHash,
      role: "USER",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
  });

  const david = await prisma.user.create({
    data: {
      name: "David Kim",
      email: "david.kim@taskflow.com",
      password: passwordHash,
      role: "USER",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
  });

  const now = new Date();
  const pastDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const tomorrow = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const initialTasks = [
    {
      title: "Design PostgreSQL Schema & Migrations",
      description: "Define entities for Users, Tasks, and relational constraints with Prisma ORM.",
      priority: "HIGH" as const,
      status: "COMPLETED" as const,
      dueDate: pastDate,
      assignedToId: admin.id,
      createdById: admin.id,
    },
    {
      title: "Setup JWT Authentication & RBAC",
      description: "Implement secure HTTP-only cookies, token signing, and role checks for Admin and User roles.",
      priority: "HIGH" as const,
      status: "COMPLETED" as const,
      dueDate: pastDate,
      assignedToId: sarah.id,
      createdById: admin.id,
    },
    {
      title: "Interactive Kanban Board Drag & Drop",
      description: "Build a fluid multi-column board with optimistic updates and status persistence.",
      priority: "HIGH" as const,
      status: "IN_PROGRESS" as const,
      dueDate: tomorrow,
      assignedToId: alex.id,
      createdById: admin.id,
    },
    {
      title: "Analytics Dashboard Visualizations",
      description: "Integrate Recharts components for task status distribution and priority breakdown metrics.",
      priority: "MEDIUM" as const,
      status: "IN_PROGRESS" as const,
      dueDate: nextWeek,
      assignedToId: david.id,
      createdById: sarah.id,
    },
    {
      title: "Implement Real-time Search & Multi-Filters",
      description: "Enable filtering by status, priority, and sorting by due date across both Kanban and Table views.",
      priority: "MEDIUM" as const,
      status: "TODO" as const,
      dueDate: nextWeek,
      assignedToId: sarah.id,
      createdById: admin.id,
    },
    {
      title: "Overdue Notification & SLA Compliance",
      description: "Generate alerts when tasks exceed their assigned due date without completion status.",
      priority: "HIGH" as const,
      status: "TODO" as const,
      dueDate: pastDate,
      assignedToId: alex.id,
      createdById: admin.id,
    },
    {
      title: "Optimize API Response Caching & Middleware",
      description: "Refactor error handler middleware and standard JSON response envelopes.",
      priority: "LOW" as const,
      status: "TODO" as const,
      dueDate: twoWeeks,
      assignedToId: david.id,
      createdById: admin.id,
    },
  ];

  for (const task of initialTasks) {
    await prisma.task.create({
      data: task,
    });
  }
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
