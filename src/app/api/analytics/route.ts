import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getDashboardMetrics } from "@/lib/repository";
import { jsonSuccess, jsonError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return jsonError("Unauthorized access.", 401);
    }

    const metrics = await getDashboardMetrics();
    return jsonSuccess(metrics, "Analytics metrics retrieved successfully.");
  } catch (error) {
    return jsonError("Internal server error fetching analytics.", 500);
  }
}
