# TaskFlow - Enterprise Task Management & Kanban System

A complete, full-stack, production-grade Task Management System built with Next.js 14 (App Router), Tailwind CSS, TypeScript, Prisma ORM, PostgreSQL, Lucide React, and Recharts.

---

## Architecture Overview

```
task-management-system/
├── prisma/
│   ├── schema.prisma              # PostgreSQL database models (User, Task, Enums)
│   └── seed.ts                    # Database seeder with sample accounts & tasks
├── src/
│   ├── types/
│   │   └── index.ts               # Core TypeScript interface and type declarations
│   ├── lib/
│   │   ├── prisma.ts              # Global PrismaClient singleton
│   │   ├── repository.ts          # Database repository with fallback resilience
│   │   ├── auth.ts                # Route handler authentication & RBAC middleware
│   │   ├── jwt.ts                 # JWT signing and verification utility
│   │   ├── validations.ts         # Server-side input validation
│   │   ├── api-response.ts        # Standardized JSON response envelopes
│   │   └── utils.ts               # Class merging, date formatters, styling helpers
│   ├── components/
│   │   ├── ui/                    # Button, Input, Select, Modal, Badge, Spinner, EmptyState
│   │   ├── layout/                # DashboardLayout, Navbar, Sidebar
│   │   ├── dashboard/             # MetricsGrid, StatusChart, PriorityChart
│   │   ├── tasks/                 # TaskKanban, TaskTable, TaskCard, TaskFilters, TaskModal, DeleteTaskModal
│   │   └── providers/             # AuthProvider, ToastProvider
│   ├── app/
│   │   ├── layout.tsx             # Root layout with font imports and providers
│   │   ├── globals.css            # Tailwind directives and CSS variables
│   │   ├── page.tsx               # Public landing page
│   │   ├── login/page.tsx         # Login page with demo credentials
│   │   ├── register/page.tsx      # Registration page with role assignment
│   │   ├── dashboard/
│   │   │   ├── page.tsx           # Overview dashboard with metrics & charts
│   │   │   ├── kanban/page.tsx    # Interactive 3-column Kanban board
│   │   │   ├── tasks/page.tsx     # Tabular task list with inline status changes
│   │   │   └── analytics/page.tsx # Analytics reports & priority breakdown
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── register/route.ts
│   │       │   ├── login/route.ts
│   │       │   ├── logout/route.ts
│   │       │   └── me/route.ts
│   │       ├── tasks/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── users/route.ts
│   │       └── analytics/route.ts
│   └── middleware.ts              # Edge session authentication route protector
├── .env.example
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## Core Specifications Implemented

### 1. Authentication & Role-Based Access Control (RBAC)
- **Token Signing & Storage**: Issues JSON Web Tokens (JWT) stored in HTTP-only, secure, `SameSite=lax` cookies, with fallback support for Authorization Bearer headers.
- **Password Security**: Strong hashing via `bcryptjs` with 10 salt rounds.
- **Roles Supported**:
  - `ADMIN`: Global task management, ability to edit/delete any task, manage assignments, and access full team analytics.
  - `USER`: Personal task management, creating tasks, editing assigned work items, updating pipeline status.

### 2. Interactive Kanban Board & Task Lifecycle
- **Columns**: `To Do`, `In Progress`, `Completed`.
- **Interactions**:
  - Direct status transitions with advance/regress controls.
  - Color-coded priority badges (`High`, `Medium`, `Low`).
  - Due date tracking with automatic overdue alerts and visual warning cues.
  - Inline "+ Add Task" button scoped to specific pipeline columns.
  - Detail drawer/modal for full attribute inspection and modifications.

### 3. Data Visualization & Analytics (Recharts)
- **KPI Metrics Cards**: Total Tasks, Pending Tasks, Completed Tasks, Overdue Tasks, and Completion Rate (%).
- **Interactive Charts**:
  - Status Breakdown Donut/Pie chart.
  - Priority Distribution Bar chart comparing total volume against completed items.
  - Priority SLA compliance progress bars.

### 4. Search, Multi-Filter & Sorting Engine
- Real-time debounced search bar matching against titles and descriptions.
- Instant status filter (`All`, `To Do`, `In Progress`, `Completed`).
- Instant priority filter (`All`, `High`, `Medium`, `Low`).
- Due date sorting (`Soonest Due`, `Newest Created`, `Priority Tier`, `Alphabetical`).

### 5. RESTful API Architecture
- `POST /api/auth/register` - Create user accounts (status: 201, 400, 409).
- `POST /api/auth/login` - Authenticate and establish HTTP-only cookie (status: 200, 401).
- `POST /api/auth/logout` - Clear authentication session cookie (status: 200).
- `GET /api/auth/me` - Validate active JWT and return user profile (status: 200, 401).
- `GET /api/tasks` - Filtered, sorted query list of tasks (status: 200, 401).
- `POST /api/tasks` - Create new task item (status: 201, 400, 401).
- `GET /api/tasks/[id]` - Retrieve individual task details (status: 200, 401, 404).
- `PATCH /api/tasks/[id]` - Partial updates with RBAC verification (status: 200, 400, 401, 403, 404).
- `DELETE /api/tasks/[id]` - Remove task with permission checks (status: 200, 401, 403, 404).
- `GET /api/users` - Retrieve team members list for assignments (status: 200, 401).
- `GET /api/analytics` - Summary KPI metrics and chart distributions (status: 200, 401).

---

## Database Schema (Prisma PostgreSQL)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  USER
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}

enum Status {
  TODO
  IN_PROGRESS
  COMPLETED
}

model User {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  password      String
  role          Role      @default(USER)
  avatar        String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  assignedTasks Task[]    @relation("AssignedTasks")
  createdTasks  Task[]    @relation("CreatedTasks")
}

model Task {
  id           String    @id @default(uuid())
  title        String
  description  String?
  priority     Priority  @default(MEDIUM)
  status       Status    @default(TODO)
  dueDate      DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  assignedToId String?
  assignedTo   User?     @relation("AssignedTasks", fields: [assignedToId], references: [id], onDelete: SetNull)
  createdById  String
  createdBy    User      @relation("CreatedTasks", fields: [createdById], references: [id], onDelete: Cascade)
}
```

---

## Seeded Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@taskflow.com` | `Password123!` |
| **Team Member** | `sarah.jenkins@taskflow.com` | `Password123!` |
| **Team Member** | `alex.rivera@taskflow.com` | `Password123!` |
| **Team Member** | `david.kim@taskflow.com` | `Password123!` |
