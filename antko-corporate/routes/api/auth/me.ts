import { Handlers } from "$fresh/server.ts";
import { AuthState, authMiddleware, requireAuth } from "../../../lib/auth.ts";
import { UserService } from "../../../lib/users.ts";

export const handler: Handlers<any, AuthState> = {
  async GET(req, ctx) {
    // Apply auth middleware
    await authMiddleware(req, ctx);
    
    // Require authentication
    const authCheck = await requireAuth()(req, ctx);
    if (authCheck.status !== 200) {
      return authCheck;
    }
    
    try {
      const user = await UserService.findById(ctx.state.user!.id);
      
      if (!user) {
        return new Response(
          JSON.stringify({ error: "User not found" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      return new Response(
        JSON.stringify({
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            territory: user.territory,
            quota: user.quota,
            active: user.active
          }
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    } catch (error) {
      console.error("User info error:", error);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  }
};