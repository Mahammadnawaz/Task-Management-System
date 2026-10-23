import Link from "next/link";
import {
  CheckSquare,
  KanbanSquare,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      <header className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-20 bg-slate-950/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-lg shadow-brand-500/20">
              <CheckSquare className="h-6 w-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              TaskFlow
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded-xl shadow-md shadow-brand-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-500/30 bg-brand-950/40 text-brand-300 text-xs font-semibold mb-8 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5 text-brand-400" />
          <span>Next-Generation Agile Workflow Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1]">
          Modern Task Management for High-Velocity Teams.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
          Streamline operations with interactive Kanban boards, role-based governance, real-time analytics, and instant multi-dimensional task filters.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-base shadow-lg shadow-brand-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold text-base transition-colors"
          >
            <span>View Demo Account</span>
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full max-w-5xl">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:border-slate-700 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center text-indigo-400 mb-4">
              <KanbanSquare className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Interactive Kanban Board</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Organize tasks across To Do, In Progress, and Completed columns with fluid transitions, color-coded priorities, and due date tracking.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:border-slate-700 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center text-emerald-400 mb-4">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Real-Time Analytics</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Gain deep visibility into team velocity, overdue tasks, priority distributions, and pipeline completion ratios via interactive charts.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:border-slate-700 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-brand-950/80 border border-brand-800/50 flex items-center justify-center text-brand-400 mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Enterprise Security & RBAC</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Enforce role-based access control with distinct Admin and Member privileges, protected API routes, and secure HTTP-only JWT cookies.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        TaskFlow Enterprise Management System. Built with Next.js, Prisma, and Tailwind CSS.
      </footer>
    </div>
  );
}
