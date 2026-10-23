import { Priority, Status } from "@/types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegisterInput(data: {
  name?: unknown;
  email?: unknown;
  password?: unknown;
  role?: unknown;
}): { isValid: boolean; error?: string } {
  if (!data.name || typeof data.name !== "string" || data.name.trim().length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters long." };
  }

  if (!data.email || typeof data.email !== "string" || !EMAIL_REGEX.test(data.email.trim())) {
    return { isValid: false, error: "A valid email address is required." };
  }

  if (!data.password || typeof data.password !== "string" || data.password.length < 6) {
    return { isValid: false, error: "Password must be at least 6 characters long." };
  }

  if (data.role && data.role !== "ADMIN" && data.role !== "USER") {
    return { isValid: false, error: "Role must be either ADMIN or USER." };
  }

  return { isValid: true };
}

export function validateLoginInput(data: {
  email?: unknown;
  password?: unknown;
}): { isValid: boolean; error?: string } {
  if (!data.email || typeof data.email !== "string" || !EMAIL_REGEX.test(data.email.trim())) {
    return { isValid: false, error: "A valid email address is required." };
  }

  if (!data.password || typeof data.password !== "string" || data.password.length === 0) {
    return { isValid: false, error: "Password is required." };
  }

  return { isValid: true };
}

export function validateTaskInput(data: {
  title?: unknown;
  priority?: unknown;
  status?: unknown;
  dueDate?: unknown;
}): { isValid: boolean; error?: string } {
  if (!data.title || typeof data.title !== "string" || data.title.trim().length === 0) {
    return { isValid: false, error: "Task title is required." };
  }

  if (data.title.trim().length > 150) {
    return { isValid: false, error: "Task title must not exceed 150 characters." };
  }

  const validPriorities: Priority[] = ["LOW", "MEDIUM", "HIGH"];
  if (data.priority && !validPriorities.includes(data.priority as Priority)) {
    return { isValid: false, error: "Priority must be LOW, MEDIUM, or HIGH." };
  }

  const validStatuses: Status[] = ["TODO", "IN_PROGRESS", "COMPLETED"];
  if (data.status && !validStatuses.includes(data.status as Status)) {
    return { isValid: false, error: "Status must be TODO, IN_PROGRESS, or COMPLETED." };
  }

  if (data.dueDate && typeof data.dueDate === "string") {
    const timestamp = Date.parse(data.dueDate);
    if (isNaN(timestamp)) {
      return { isValid: false, error: "Due date must be a valid date format." };
    }
  }

  return { isValid: true };
}
