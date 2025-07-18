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
      const url = new URL(req.url);
      const status = url.searchParams.get("status");
      const assignedTo = url.searchParams.get("assignedTo");
      const industry = url.searchParams.get("industry");
      const limit = parseInt(url.searchParams.get("limit") || "100");
      const offset = parseInt(url.searchParams.get("offset") || "0");
      const search = url.searchParams.get("search");
      
      let customers;
      
      if (search) {
        customers = await CustomerService.search(search);
      } else {
        customers = await CustomerService.list({
          status: status || undefined,
          assignedTo: assignedTo || undefined,
          industry: industry || undefined,
          limit,
          offset,
        });
      }
      
      // Sales reps can only see their own customers
      if (ctx.state.user!.role === "sales-rep") {
        customers = customers.filter(customer => 
          customer.assignedSalesperson === ctx.state.user!.id
        );
      }
      
      return new Response(
        JSON.stringify({ customers }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    } catch (error) {
      console.error("Get customers error:", error);
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
      const customerData = await req.json();
      
      // Validate required fields
      const requiredFields = [
        "companyName", "contactName", "email", "phone", 
        "address", "city", "state", "zipCode", "country", 
        "industry", "companySize", "status"
      ];
      
      for (const field of requiredFields) {
        if (!customerData[field]) {
          return new Response(
            JSON.stringify({ error: `${field} is required` }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          );
        }
      }
      
      // Check if customer with this email already exists
      const existingCustomer = await CustomerService.findByEmail(customerData.email);
      if (existingCustomer) {
        return new Response(
          JSON.stringify({ error: "Customer with this email already exists" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      // Set assigned salesperson
      if (!customerData.assignedSalesperson) {
        customerData.assignedSalesperson = ctx.state.user!.id;
      }
      
      const customer = await CustomerService.create(customerData);
      
      return new Response(
        JSON.stringify({ customer }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" }
        }
      );
    } catch (error) {
      console.error("Create customer error:", error);
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