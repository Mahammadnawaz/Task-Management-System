import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { validateLoginInput } from "@/lib/validations";
import { findUserByEmail } from "@/lib/repository";
import { signToken } from "@/lib/jwt";
import { jsonSuccess, jsonError } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return jsonError("Request body is missing or malformed.", 400);
    }

    const validation = validateLoginInput(body);
    if (!validation.isValid) {
      return jsonError(validation.error || "Invalid login credentials.", 400);
    }

    const user = await findUserByEmail(body.email);
    if (!user) {
      return jsonError("Invalid email or password.", 401);
    }

    const passwordMatches = await bcrypt.compare(body.password, user.password);
    if (!passwordMatches) {
      return jsonError("Invalid email or password.", 401);
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const userSummary = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    };

    const response = jsonSuccess(
      { user: userSummary, token },
      "Login successful."
    );

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    return jsonError("Internal server error during authentication.", 500);
  }
}
