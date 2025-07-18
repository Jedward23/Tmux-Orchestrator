import { Handlers } from "$fresh/server.ts";
import { AuthState, requireAuth, hasPermission } from "../../../lib/auth.ts";
import { LeadService } from "../../../lib/leads.ts";

export const handler: Handlers<any, AuthState> = {
  async GET(req, ctx) {
    // Require authentication
    const authCheck = await requireAuth()(req, ctx);
    if (authCheck.status !== 200) {
      return authCheck;
    }
    
    // Check permissions
    if (!hasPermission(ctx.state.user!.role, "leads", "read")) {
      return new Response(
        JSON.stringify({ error: "Insufficient permissions" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    
    try {
      const { id } = ctx.params;
      const lead = await LeadService.findById(id);
      
      if (!lead) {
        return new Response(
          JSON.stringify({ error: "Lead not found" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      // Sales reps can only see their own leads
      if (ctx.state.user!.role === "sales-rep" && lead.assignedTo !== ctx.state.user!.id) {
        return new Response(
          JSON.stringify({ error: "Access denied" }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      return new Response(
        JSON.stringify({ lead }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    } catch (error) {
      console.error("Get lead error:", error);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  },
  
  async PUT(req, ctx) {
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
      const { id } = ctx.params;
      const updates = await req.json();
      
      // Check if lead exists
      const existingLead = await LeadService.findById(id);
      if (!existingLead) {
        return new Response(
          JSON.stringify({ error: "Lead not found" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      // Sales reps can only update their own leads
      if (ctx.state.user!.role === "sales-rep" && existingLead.assignedTo !== ctx.state.user!.id) {
        return new Response(
          JSON.stringify({ error: "Access denied" }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      // Validate email format if being updated
      if (updates.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updates.email)) {
          return new Response(
            JSON.stringify({ error: "Invalid email format" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          );
        }
        
        // Check for email conflicts
        if (updates.email !== existingLead.email) {
          const emailExists = await LeadService.findByEmail(updates.email);
          if (emailExists) {
            return new Response(
              JSON.stringify({ error: "Lead with this email already exists" }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" }
              }
            );
          }
        }
      }
      
      // Validate score range if being updated
      if (updates.score !== undefined && (updates.score < 0 || updates.score > 100)) {
        return new Response(
          JSON.stringify({ error: "Score must be between 0 and 100" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      const lead = await LeadService.update(id, updates);
      
      return new Response(
        JSON.stringify({ lead }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    } catch (error) {
      console.error("Update lead error:", error);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  },
  
  async DELETE(req, ctx) {
    // Require authentication
    const authCheck = await requireAuth()(req, ctx);
    if (authCheck.status !== 200) {
      return authCheck;
    }
    
    // Check permissions
    if (!hasPermission(ctx.state.user!.role, "leads", "delete")) {
      return new Response(
        JSON.stringify({ error: "Insufficient permissions" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    
    try {
      const { id } = ctx.params;
      
      // Check if lead exists
      const existingLead = await LeadService.findById(id);
      if (!existingLead) {
        return new Response(
          JSON.stringify({ error: "Lead not found" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      const success = await LeadService.delete(id);
      
      if (!success) {
        return new Response(
          JSON.stringify({ error: "Failed to delete lead" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      return new Response(
        JSON.stringify({ message: "Lead deleted successfully" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    } catch (error) {
      console.error("Delete lead error:", error);
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