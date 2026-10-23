import { NextRequest } from "next/server";
import { verifyToken, JwtPayload } from "./jwt";

export function getAuthUser(request: NextRequest): JwtPayload | null {
  const cookieToken =
    request.cookies.get("auth_token")?.value ||
    request.cookies.get("token")?.value;

  if (cookieToken) {
    const verified = verifyToken(cookieToken);
    if (verified) return verified;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    const verified = verifyToken(token);
    if (verified) return verified;
  }

  return null;
}

export function isAuthenticated(request: NextRequest): boolean {
  return getAuthUser(request) !== null;
}

export function isAdmin(request: NextRequest): boolean {
  const user = getAuthUser(request);
  return user?.role === "ADMIN";
}
