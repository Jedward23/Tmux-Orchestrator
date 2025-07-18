import { Handlers } from "$fresh/server.ts";
import { AuthState, authMiddleware, requireAuth, hasPermission } from "../../../lib/auth.ts";
import { CustomerService } from "../../../lib/customers.ts";

export const handler: Handlers<any, AuthState> = {
  async GET(req, ctx) {
    // Apply auth middleware
    await authMiddleware(req, ctx);
    
    // Require authentication
    const authCheck = await requireAuth()(req, ctx);
    if (authCheck.status !== 200) {
      return authCheck;
    }
    
    // Check permissions
    if (!hasPermission(ctx.state.user!.role, "customers", "read")) {
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
      const customer = await CustomerService.findById(id);
      
      if (!customer) {
        return new Response(
          JSON.stringify({ error: "Customer not found" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      // Sales reps can only see their own customers
      if (ctx.state.user!.role === "sales-rep" && customer.assignedSalesperson !== ctx.state.user!.id) {
        return new Response(
          JSON.stringify({ error: "Access denied" }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      return new Response(
        JSON.stringify({ customer }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    } catch (error) {
      console.error("Get customer error:", error);
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
    // Apply auth middleware
    await authMiddleware(req, ctx);
    
    // Require authentication
    const authCheck = await requireAuth()(req, ctx);
    if (authCheck.status !== 200) {
      return authCheck;
    }
    
    // Check permissions
    if (!hasPermission(ctx.state.user!.role, "customers", "write")) {
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
      
      // Check if customer exists
      const existingCustomer = await CustomerService.findById(id);
      if (!existingCustomer) {
        return new Response(
          JSON.stringify({ error: "Customer not found" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      // Sales reps can only update their own customers
      if (ctx.state.user!.role === "sales-rep" && existingCustomer.assignedSalesperson !== ctx.state.user!.id) {
        return new Response(
          JSON.stringify({ error: "Access denied" }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      // If email is being updated, check for conflicts
      if (updates.email && updates.email !== existingCustomer.email) {
        const emailExists = await CustomerService.findByEmail(updates.email);
        if (emailExists) {
          return new Response(
            JSON.stringify({ error: "Customer with this email already exists" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          );
        }
      }
      
      const customer = await CustomerService.update(id, updates);
      
      return new Response(
        JSON.stringify({ customer }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    } catch (error) {
      console.error("Update customer error:", error);
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
    // Apply auth middleware
    await authMiddleware(req, ctx);
    
    // Require authentication
    const authCheck = await requireAuth()(req, ctx);
    if (authCheck.status !== 200) {
      return authCheck;
    }
    
    // Check permissions
    if (!hasPermission(ctx.state.user!.role, "customers", "delete")) {
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
      
      // Check if customer exists
      const existingCustomer = await CustomerService.findById(id);
      if (!existingCustomer) {
        return new Response(
          JSON.stringify({ error: "Customer not found" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      const success = await CustomerService.delete(id);
      
      if (!success) {
        return new Response(
          JSON.stringify({ error: "Failed to delete customer" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      return new Response(
        JSON.stringify({ message: "Customer deleted successfully" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    } catch (error) {
      console.error("Delete customer error:", error);
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