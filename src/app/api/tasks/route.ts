import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getTasks, createTask } from "@/lib/repository";
import { validateTaskInput } from "@/lib/validations";
import { jsonSuccess, jsonError } from "@/lib/api-response";
import { Priority, Status } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return jsonError("Unauthorized access.", 401);
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const status = (searchParams.get("status") as Status | "ALL") || undefined;
    const priority = (searchParams.get("priority") as Priority | "ALL") || undefined;
    const sortBy = (searchParams.get("sortBy") as any) || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
    const assignedToId = searchParams.get("assignedToId") || undefined;

    const tasks = await getTasks({
      search,
      status,
      priority,
      sortBy,
      sortOrder,
      assignedToId,
    });

    return jsonSuccess(tasks, "Tasks retrieved successfully.");
  } catch (error) {
    return jsonError("Internal server error fetching tasks.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return jsonError("Unauthorized access. Please log in.", 401);
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return jsonError("Request body is missing or malformed.", 400);
    }

    const validation = validateTaskInput(body);
    if (!validation.isValid) {
      return jsonError(validation.error || "Invalid task input.", 400);
    }

    const newTask = await createTask(
      {
        title: body.title,
        description: body.description,
        priority: body.priority || "MEDIUM",
        status: body.status || "TODO",
        dueDate: body.dueDate,
        assignedToId: body.assignedToId || null,
      },
      user.id
    );

    return jsonSuccess(newTask, "Task created successfully.", 201);
  } catch (error) {
    return jsonError("Internal server error creating task.", 500);
  }
}
