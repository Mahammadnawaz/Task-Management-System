import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getAllUsers } from "@/lib/repository";
import { jsonSuccess, jsonError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return jsonError("Unauthorized access.", 401);
    }

    const users = await getAllUsers();
    return jsonSuccess(users, "Users retrieved successfully.");
  } catch (error) {
    return jsonError("Internal server error fetching users.", 500);
  }
}
