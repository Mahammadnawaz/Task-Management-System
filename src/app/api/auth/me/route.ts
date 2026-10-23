import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { findUserById } from "@/lib/repository";
import { jsonSuccess, jsonError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const authPayload = getAuthUser(request);
    if (!authPayload) {
      return jsonError("Unauthorized. Please log in.", 401);
    }

    const user = await findUserById(authPayload.id);
    if (!user) {
      return jsonError("User account not found.", 404);
    }

    const userSummary = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    };

    return jsonSuccess({ user: userSummary }, "Session verified.");
  } catch (error) {
    return jsonError("Internal server error verifying session.", 500);
  }
}
