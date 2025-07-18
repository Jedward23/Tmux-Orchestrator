import { FreshContext } from "$fresh/server.ts";
import { securityGuard } from "../../security-guard.ts";

export interface State {
  isAuthenticated: boolean;
}

export async function handler(req: Request, ctx: FreshContext<State>) {
  // 🚨 SECURITY GUARD - CUSTOMER DATA PROTECTION
  const securityResponse = await securityGuard(req, ctx);
  if (securityResponse) {
    return securityResponse;
  }

  const url = new URL(req.url);
  
  // Allow access to login page and logout
  if (url.pathname === "/admin" || url.pathname === "/admin/logout") {
    return await ctx.next();
  }
  
  // Check authentication for all other admin routes
  const cookies = req.headers.get("Cookie") || "";
  const isAuthenticated = cookies.includes("auth=authenticated");
  
  if (!isAuthenticated) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/admin" }
    });
  }
  
  ctx.state.isAuthenticated = true;
  return await ctx.next();
}