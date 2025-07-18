import { Handlers } from "$fresh/server.ts";
import { AuthState, requireAuth, hasPermission } from "../../../lib/auth.ts";
import { LeadService } from "../../../lib/leads.ts";

export const handler: Handlers<any, AuthState> = {
  async POST(req, ctx) {
    // Require authentication
    const authCheck = await requireAuth()(req, ctx);
    if (authCheck.status !== 200) {
      return authCheck;
    }
    
    // Check permissions
    if (!hasPermission(ctx.state.user!.role, "leads", "write")) {
      return new Response(
        JSON.stringify({ error: "Insufficient permissions" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    
    try {
      const { leadId } = await req.json();
      
      if (!leadId) {
        return new Response(
          JSON.stringify({ error: "Lead ID is required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      // Check if lead exists
      const lead = await LeadService.findById(leadId);
      if (!lead) {
        return new Response(
          JSON.stringify({ error: "Lead not found" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      // Sales reps can only convert their own leads
      if (ctx.state.user!.role === "sales-rep" && lead.assignedTo !== ctx.state.user!.id) {
        return new Response(
          JSON.stringify({ error: "Access denied" }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      const result = await LeadService.convertToCustomer(leadId);
      
      if (!result.success) {
        return new Response(
          JSON.stringify({ error: result.error }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          message: "Lead converted successfully",
          customerId: result.customerId 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    } catch (error) {
      console.error("Convert lead error:", error);
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