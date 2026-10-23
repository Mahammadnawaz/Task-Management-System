"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckSquare, User, Mail, Lock, Shield, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { Role } from "@/types";

export default function RegisterPage() {
  const { register } = useAuth();
  const { success, error: toastError } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("USER");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const validate = () => {
    const errs: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name.trim() || name.trim().length < 2) {
      errs.name = "Full name must be at least 2 characters.";
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Please enter a valid email address.";
    }

    if (!password || password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    const result = await register(name, email, password, role);
    setIsLoading(false);

    if (result.success) {
      success("Registration complete", "Your account has been created.");
    } else {
      toastError("Registration Failed", result.error || "Unable to register account.");
      setErrors({ general: result.error || "Unable to register account." });
    }
  };

  const roleOptions = [
    { value: "USER", label: "Team Member (Standard User)" },
    { value: "ADMIN", label: "Workspace Administrator (Full Access)" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-xl shadow-brand-500/20 mb-4">
            <CheckSquare className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Create your Account
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Join your organization on TaskFlow
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          {errors.general && (
            <div className="mb-4 rounded-xl bg-rose-950/60 border border-rose-800/80 p-3 text-xs font-semibold text-rose-300">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Elena Rostov"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              leftIcon={<User className="h-4 w-4" />}
              required
            />

            <Input
              label="Work Email"
              type="email"
              placeholder="elena@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              leftIcon={<Mail className="h-4 w-4" />}
              required
            />

            <Select
              label="Account Role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              options={roleOptions}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              leftIcon={<Lock className="h-4 w-4" />}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              leftIcon={<Shield className="h-4 w-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Complete Registration
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already registered?{" "}
          <Link
            href="/login"
            className="font-semibold text-brand-400 hover:text-brand-300 underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
