import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getTaskById, updateTask, deleteTask } from "@/lib/repository";
import { validateTaskInput } from "@/lib/validations";
import { jsonSuccess, jsonError } from "@/lib/api-response";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return jsonError("Unauthorized access.", 401);
    }

    const { id } = params;
    const task = await getTaskById(id);

    if (!task) {
      return jsonError("Task not found.", 404);
    }

    return jsonSuccess(task, "Task retrieved successfully.");
  } catch (error) {
    return jsonError("Internal server error fetching task.", 500);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return jsonError("Unauthorized access.", 401);
    }

    const { id } = params;
    const existingTask = await getTaskById(id);

    if (!existingTask) {
      return jsonError("Task not found.", 404);
    }

    const isCreator = existingTask.createdById === user.id;
    const isAssigned = existingTask.assignedToId === user.id;
    const isAdminUser = user.role === "ADMIN";

    if (!isAdminUser && !isCreator && !isAssigned) {
      return jsonError("Forbidden. You do not have permission to update this task.", 403);
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return jsonError("Request body is missing or malformed.", 400);
    }

    if (body.title !== undefined) {
      const validation = validateTaskInput(body);
      if (!validation.isValid) {
        return jsonError(validation.error || "Invalid task input.", 400);
      }
    }

    const updated = await updateTask(id, {
      title: body.title,
      description: body.description,
      priority: body.priority,
      status: body.status,
      dueDate: body.dueDate,
      assignedToId: body.assignedToId,
    });

    if (!updated) {
      return jsonError("Failed to update task.", 404);
    }

    return jsonSuccess(updated, "Task updated successfully.");
  } catch (error) {
    return jsonError("Internal server error updating task.", 500);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  return PATCH(request, { params });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return jsonError("Unauthorized access.", 401);
    }

    const { id } = params;
    const existingTask = await getTaskById(id);

    if (!existingTask) {
      return jsonError("Task not found.", 404);
    }

    const isCreator = existingTask.createdById === user.id;
    const isAdminUser = user.role === "ADMIN";

    if (!isAdminUser && !isCreator) {
      return jsonError("Forbidden. Only administrators or task creators can delete tasks.", 403);
    }

    const success = await deleteTask(id);
    if (!success) {
      return jsonError("Failed to delete task.", 404);
    }

    return jsonSuccess({ id }, "Task deleted successfully.");
  } catch (error) {
    return jsonError("Internal server error deleting task.", 500);
  }
}
