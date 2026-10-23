import { NextResponse } from "next/server";
import { ApiResponse } from "@/types";

export function jsonSuccess<T>(
  data?: T,
  message?: string,
  status: number = 200,
  headers?: HeadersInit
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    {
      status,
      headers,
    }
  );
}

export function jsonError(
  message: string,
  status: number = 400,
  error?: string
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      message,
      error: error || message,
    },
    {
      status,
    }
  );
}
