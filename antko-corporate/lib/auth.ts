import { verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { FreshContext } from "$fresh/server.ts";

const JWT_SECRET = Deno.env.get("JWT_SECRET") || "your-secret-key-change-in-production";

export async function generateKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(JWT_SECRET);
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const key = await generateKey();
    const payload = await verify(token, key) as JWTPayload;
    return payload;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
}

export function extractToken(req: Request): string | null {
  const authHeader = req.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
}

export interface AuthState {
  user?: {
    id: string;
    email: string;
    role: string;
  };
  isAuthenticated: boolean;
}

export async function authMiddleware(
  req: Request,
  ctx: FreshContext<AuthState>
): Promise<Response> {
  const token = extractToken(req);
  
  if (token) {
    const payload = await verifyJWT(token);
    if (payload) {
      ctx.state.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };
      ctx.state.isAuthenticated = true;
    }
  }
  
  if (!ctx.state.isAuthenticated) {
    ctx.state.isAuthenticated = false;
  }
  
  const response = await ctx.next();
  return response;
}

export function requireAuth(roles?: string[]) {
  return async (req: Request, ctx: FreshContext<AuthState>): Promise<Response> => {
    if (!ctx.state.isAuthenticated) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    
    if (roles && !roles.includes(ctx.state.user!.role)) {
      return new Response(
        JSON.stringify({ error: "Insufficient permissions" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    
    const response = await ctx.next();
    return response;
  };
}

export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}

export function hasPermission(userRole: string, resource: string, action: string): boolean {
  const permissions = {
    admin: ["*"],
    "sales-manager": [
      "customers:read", "customers:write", "customers:delete",
      "leads:read", "leads:write", "leads:delete",
      "opportunities:read", "opportunities:write", "opportunities:delete",
      "activities:read", "activities:write", "activities:delete",
      "reports:read", "users:read"
    ],
    "sales-rep": [
      "customers:read", "customers:write",
      "leads:read", "leads:write",
      "opportunities:read", "opportunities:write",
      "activities:read", "activities:write"
    ]
  };
  
  const userPermissions = permissions[userRole as keyof typeof permissions] || [];
  const requiredPermission = `${resource}:${action}`;
  
  return userPermissions.includes("*") || userPermissions.includes(requiredPermission);
}