import type { Request } from "express";

export function getSessionCookieOptions(_req: Request) {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    path: "/",
  };
}
