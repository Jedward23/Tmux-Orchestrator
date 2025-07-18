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
      const url = new URL(req.url);
      const status = url.searchParams.get("status");
      const assignedTo = url.searchParams.get("assignedTo");
      const source = url.searchParams.get("source");
      const minScore = url.searchParams.get("minScore");
      const maxScore = url.searchParams.get("maxScore");
      const limit = parseInt(url.searchParams.get("limit") || "100");
      const offset = parseInt(url.searchParams.get("offset") || "0");
      const search = url.searchParams.get("search");
      
      let leads;
      
      if (search) {
        leads = await LeadService.search(search);
      } else {
        leads = await LeadService.list({
          status: status || undefined,
          assignedTo: assignedTo || undefined,
          source: source || undefined,
          minScore: minScore ? parseInt(minScore) : undefined,
          maxScore: maxScore ? parseInt(maxScore) : undefined,
          limit,
          offset,
        });
      }
      
      // Sales reps can only see their own leads
      if (ctx.state.user!.role === "sales-rep") {
        leads = leads.filter(lead => 
          lead.assignedTo === ctx.state.user!.id
        );
      }
      
      return new Response(
        JSON.stringify({ leads }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    } catch (error) {
      console.error("Get leads error:", error);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  },
  
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
      const leadData = await req.json();
      
      // Validate required fields
      const requiredFields = [
        "firstName", "lastName", "email", "phone", 
        "company", "jobTitle", "source", "status"
      ];
      
      for (const field of requiredFields) {
        if (!leadData[field]) {
          return new Response(
            JSON.stringify({ error: `${field} is required` }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          );
        }
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(leadData.email)) {
        return new Response(
          JSON.stringify({ error: "Invalid email format" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      // Check if lead with this email already exists
      const existingLead = await LeadService.findByEmail(leadData.email);
      if (existingLead) {
        return new Response(
          JSON.stringify({ error: "Lead with this email already exists" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      // Set default values
      leadData.score = leadData.score || 0;
      leadData.notes = leadData.notes || "";
      
      // Set assigned salesperson
      if (!leadData.assignedTo) {
        leadData.assignedTo = ctx.state.user!.id;
      }
      
      const lead = await LeadService.create(leadData);
      
      return new Response(
        JSON.stringify({ lead }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" }
        }
      );
    } catch (error) {
      console.error("Create lead error:", error);
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