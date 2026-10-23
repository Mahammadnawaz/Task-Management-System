import jwt, { SignOptions } from "jsonwebtoken";
import { Role } from "@/types";

export interface JwtPayload {
  id: string;
  email: string;
  name: string;
  role: Role;
}

const JWT_SECRET = process.env.JWT_SECRET || "taskflow_production_default_secret_key_2026";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}
