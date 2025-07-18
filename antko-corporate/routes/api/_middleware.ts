import { FreshContext } from "$fresh/server.ts";
import { AuthState, authMiddleware } from "../../lib/auth.ts";

export async function handler(req: Request, ctx: FreshContext<AuthState>) {
  // Apply authentication middleware to all API routes
  return await authMiddleware(req, ctx);
}