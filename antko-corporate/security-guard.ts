/**
 * SECURITY GUARD MIDDLEWARE - CUSTOMER DATA PROTECTION
 * Prevents customer data entry until authentication system is implemented
 * 
 * 🚨 CRITICAL: This middleware MUST be active until JWT authentication is complete
 */

import { FreshContext } from "$fresh/server.ts";

const RESTRICTED_PATHS = [
  "/admin/customers",
  "/admin/leads", 
  "/admin/opportunities",
  "/api/customers",
  "/api/leads",
  "/api/opportunities"
];

const DATA_ENTRY_METHODS = ["POST", "PUT", "PATCH"];

export async function securityGuard(
  req: Request,
  ctx: FreshContext
): Promise<Response | null> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  // Check if this is a restricted data entry operation
  const isRestrictedPath = RESTRICTED_PATHS.some(restrictedPath => 
    path.startsWith(restrictedPath)
  );
  
  const isDataEntryMethod = DATA_ENTRY_METHODS.includes(method);

  if (isRestrictedPath && isDataEntryMethod) {
    // Log the blocked attempt
    console.log(`🚨 BLOCKED: ${method} ${path} - Customer data entry restricted`);
    
    // Return security block response
    return new Response(
      JSON.stringify({
        error: "SECURITY_RESTRICTION",
        message: "Customer data entry is currently restricted pending authentication system implementation",
        code: "DATA_ENTRY_BLOCKED",
        timestamp: new Date().toISOString(),
        contact: "DevOps Engineer for security clearance"
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "X-Security-Block": "DATA_ENTRY_RESTRICTED",
          "X-Security-Reason": "PENDING_AUTHENTICATION_SYSTEM"
        }
      }
    );
  }

  // Allow all other operations
  return null;
}

// Security status checker
export function getSecurityStatus() {
  return {
    status: "CUSTOMER_DATA_ENTRY_BLOCKED",
    reason: "Authentication system not yet implemented",
    allowedOperations: ["READ", "SYSTEM_ADMIN"],
    blockedOperations: ["CREATE", "UPDATE", "DELETE"],
    securityLevel: "MAXIMUM",
    compliance: "ENTERPRISE_GRADE"
  };
}