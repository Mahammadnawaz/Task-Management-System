import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { validateRegisterInput } from "@/lib/validations";
import { findUserByEmail, createUser } from "@/lib/repository";
import { signToken } from "@/lib/jwt";
import { jsonSuccess, jsonError } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return jsonError("Request body is missing or malformed.", 400);
    }

    const validation = validateRegisterInput(body);
    if (!validation.isValid) {
      return jsonError(validation.error || "Invalid registration input.", 400);
    }

    const existingUser = await findUserByEmail(body.email);
    if (existingUser) {
      return jsonError("An account with this email already exists.", 409);
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = await createUser({
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      password: hashedPassword,
      role: body.role || "USER",
    });

    const token = signToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });

    const userSummary = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
    };

    const response = jsonSuccess(
      { user: userSummary, token },
      "User registered successfully.",
      201
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
    return jsonError("Internal server error during registration.", 500);
  }
}
