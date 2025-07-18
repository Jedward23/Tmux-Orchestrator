// Authentication & Authorization System for Antko Corporate CRM
// Comprehensive security framework with role-based access control

import { UserRole, User, Permission, CRMResource, CRMAction } from "./crm-schema.ts";

// JWT Token Interface
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  brands: string[];
  exp: number;
  iat: number;
}

// Authentication Service
export class AuthService {
  private static readonly JWT_SECRET = Deno.env.get("JWT_SECRET") || "your-super-secret-key";
  private static readonly JWT_EXPIRES_IN = 24 * 60 * 60; // 24 hours in seconds
  private static readonly REFRESH_TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60; // 7 days

  // Password hashing using Web Crypto API
  static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + "salt-key");
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Verify password
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    const hashedPassword = await this.hashPassword(password);
    return hashedPassword === hash;
  }

  // Generate JWT Token
  static async generateToken(user: User): Promise<string> {
    const permissions = this.getUserPermissions(user.role);
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions,
      brands: this.getUserBrands(user.role),
      exp: Math.floor(Date.now() / 1000) + this.JWT_EXPIRES_IN,
      iat: Math.floor(Date.now() / 1000)
    };

    // Simple base64 encoding for demo (use proper JWT library in production)
    const header = { alg: "HS256", typ: "JWT" };
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const signature = await this.sign(`${encodedHeader}.${encodedPayload}`);
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  // Verify JWT Token
  static async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const [header, payload, signature] = token.split('.');
      
      // Verify signature
      const expectedSignature = await this.sign(`${header}.${payload}`);
      if (signature !== expectedSignature) {
        return null;
      }

      const decodedPayload = JSON.parse(atob(payload)) as JWTPayload;
      
      // Check expiration
      if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }

      return decodedPayload;
    } catch {
      return null;
    }
  }

  // Simple signature for demo (use proper HMAC in production)
  private static async sign(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(this.JWT_SECRET);
    const messageData = encoder.encode(data);
    
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signature = await crypto.subtle.sign("HMAC", key, messageData);
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  }

  // Get user permissions based on role
  static getUserPermissions(role: UserRole): Permission[] {
    const permissions: Record<UserRole, Permission[]> = {
      [UserRole.ADMIN]: [
        { resource: CRMResource.CUSTOMERS, actions: [CRMAction.CREATE, CRMAction.READ, CRMAction.UPDATE, CRMAction.DELETE, CRMAction.EXPORT] },
        { resource: CRMResource.LEADS, actions: [CRMAction.CREATE, CRMAction.READ, CRMAction.UPDATE, CRMAction.DELETE, CRMAction.EXPORT] },
        { resource: CRMResource.OPPORTUNITIES, actions: [CRMAction.CREATE, CRMAction.READ, CRMAction.UPDATE, CRMAction.DELETE, CRMAction.EXPORT] },
        { resource: CRMResource.CONTACTS, actions: [CRMAction.CREATE, CRMAction.READ, CRMAction.UPDATE, CRMAction.DELETE, CRMAction.EXPORT] },
        { resource: CRMResource.ACTIVITIES, actions: [CRMAction.CREATE, CRMAction.READ, CRMAction.UPDATE, CRMAction.DELETE, CRMAction.EXPORT] },
        { resource: CRMResource.QUOTES, actions: [CRMAction.CREATE, CRMAction.READ, CRMAction.UPDATE, CRMAction.DELETE, CRMAction.EXPORT] },
        { resource: CRMResource.REPORTS, actions: [CRMAction.READ, CRMAction.EXPORT] },
        { resource: CRMResource.USERS, actions: [CRMAction.CREATE, CRMAction.READ, CRMAction.UPDATE, CRMAction.DELETE] },
        { resource: CRMResource.PRODUCTS, actions: [CRMAction.CREATE, CRMAction.READ, CRMAction.UPDATE, CRMAction.DELETE] }
      ],
      [UserRole.SALES_MANAGER]: [
        { resource: CRMResource.CUSTOMERS, actions: [CRMAction.CREATE, CRMAction.READ, CRMAction.UPDATE, CRMAction.EXPORT] },
        { resource: CRMResource.LEADS, actions: [CRMAction.CREATE, CRMAction.READ, CRMAction.UPDATE, CRMAction.DELETE, CRMAction.EXPORT] },
        { resource: CRMResource.OPPORTUNITIES, actions: [CRMAction.CREATE, CRMAction.READ, CRMAction.UPDATE, CRMAction.DELETE, CRMAction.EXPORT] },
        { resource: CRMResource.CONTACTS, actions: [CRMAction.CREATE, CRMAction.READ, CRMAction.UPDATE, CRMAction.DELETE] },
        { resource: CRMResource.ACTIVITIES, actions: [CRMAction.CREATE, CRMAction.READ, CRMAction.UPDATE, CRMAction.DELETE] },
        { resource: CRMResource.QUOTES, actions: [CRMAction.CREATE, CRMAction.READ, CRMAction.UPDATE, CRMAction.DELETE] },
        { resource: CRMResource.REPORTS, actions: [CRMAction.READ, CRMAction.EXPORT] },
        { resource: CRMResource.USERS, actions: [CRMAction.READ] },
        { resource: CRMResource.PRODUCTS, actions: [CRMAction.READ, CRMAction.UPDATE] }
      ],
      [UserRole.SALES_REP]: [
        { resource: CRMResource.CUSTOMERS, actions: [CRMAction.CREATE, CRMAction.READ, CRMAction.UPDATE], ownOnly: true },
        { resource: CRMResource.LEADS, actions: [CRMAction.CREATE, CRMAction.READ, CRMAction.UPDATE], ownOnly: true },
        { resource: CRMResource.OPPORTUNITIES, actions: [CRMAction.CREATE, CRMAction.READ, CRMAction.UPDATE], ownOnly: true },
        { resource: CRMResource.CONTACTS, actions: [CRMAction.CREATE, CRMAction.READ, CRMAction.UPDATE], ownOnly: true },
        { resource: CRMResource.ACTIVITIES, actions: [CRMAction.CREATE, CRMAction.READ, CRMAction.UPDATE], ownOnly: true },
        { resource: CRMResource.QUOTES, actions: [CRMAction.CREATE, CRMAction.READ, CRMAction.UPDATE], ownOnly: true },
        { resource: CRMResource.REPORTS, actions: [CRMAction.READ], ownOnly: true },
        { resource: CRMResource.PRODUCTS, actions: [CRMAction.READ] }
      ],
      [UserRole.VIEWER]: [
        { resource: CRMResource.CUSTOMERS, actions: [CRMAction.READ] },
        { resource: CRMResource.LEADS, actions: [CRMAction.READ] },
        { resource: CRMResource.OPPORTUNITIES, actions: [CRMAction.READ] },
        { resource: CRMResource.CONTACTS, actions: [CRMAction.READ] },
        { resource: CRMResource.ACTIVITIES, actions: [CRMAction.READ] },
        { resource: CRMResource.QUOTES, actions: [CRMAction.READ] },
        { resource: CRMResource.REPORTS, actions: [CRMAction.READ] },
        { resource: CRMResource.PRODUCTS, actions: [CRMAction.READ] }
      ]
    };

    return permissions[role] || [];
  }

  // Get user accessible brands
  static getUserBrands(role: UserRole): string[] {
    // All roles can access all brands by default
    // This can be customized per user in the database
    return ["solucionesEnAgua", "wattersolutions", "acuafitting"];
  }

  // Check if user has permission for action
  static hasPermission(
    userPermissions: Permission[],
    resource: CRMResource,
    action: CRMAction,
    brand?: string,
    isOwner?: boolean
  ): boolean {
    const permission = userPermissions.find(p => p.resource === resource);
    if (!permission) return false;

    // Check if action is allowed
    if (!permission.actions.includes(action)) return false;

    // Check brand restrictions
    if (brand && permission.brands && !permission.brands.includes(brand as any)) {
      return false;
    }

    // Check ownership restrictions
    if (permission.ownOnly && !isOwner) {
      return false;
    }

    return true;
  }
}

// Middleware for route protection
export interface AuthState {
  user?: User;
  permissions?: Permission[];
  isAuthenticated: boolean;
}

export class AuthMiddleware {
  static async authenticate(request: Request): Promise<AuthState> {
    const authHeader = request.headers.get("Authorization");
    const cookieHeader = request.headers.get("Cookie");
    
    let token: string | null = null;
    
    // Check Bearer token first
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
    
    // Check cookie as fallback
    if (!token && cookieHeader) {
      const cookies = cookieHeader.split(";").map(c => c.trim());
      const authCookie = cookies.find(c => c.startsWith("auth_token="));
      if (authCookie) {
        token = authCookie.split("=")[1];
      }
    }
    
    if (!token) {
      return { isAuthenticated: false };
    }
    
    const payload = await AuthService.verifyToken(token);
    if (!payload) {
      return { isAuthenticated: false };
    }
    
    // In production, fetch user from database
    const user: User = {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
      firstName: "User",
      lastName: "Name",
      password: "",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return {
      user,
      permissions: payload.permissions,
      isAuthenticated: true
    };
  }

  // Route permission decorator
  static requirePermission(resource: CRMResource, action: CRMAction, brand?: string) {
    return async (request: Request, authState: AuthState) => {
      if (!authState.isAuthenticated || !authState.permissions) {
        return new Response("Unauthorized", { status: 401 });
      }

      const hasPermission = AuthService.hasPermission(
        authState.permissions,
        resource,
        action,
        brand
      );

      if (!hasPermission) {
        return new Response("Forbidden", { status: 403 });
      }

      return null; // Allow access
    };
  }
}

// Session management
export class SessionManager {
  private static sessions = new Map<string, { userId: string; expiresAt: Date }>();

  static createSession(userId: string): string {
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    this.sessions.set(sessionId, { userId, expiresAt });
    return sessionId;
  }

  static getSession(sessionId: string): { userId: string; expiresAt: Date } | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    
    if (session.expiresAt < new Date()) {
      this.sessions.delete(sessionId);
      return null;
    }
    
    return session;
  }

  static deleteSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  static cleanupExpiredSessions(): void {
    const now = new Date();
    for (const [sessionId, session] of this.sessions) {
      if (session.expiresAt < now) {
        this.sessions.delete(sessionId);
      }
    }
  }
}

// Rate limiting
export class RateLimiter {
  private static attempts = new Map<string, { count: number; resetTime: Date }>();
  private static readonly MAX_ATTEMPTS = 5;
  private static readonly RESET_INTERVAL = 15 * 60 * 1000; // 15 minutes

  static checkRateLimit(identifier: string): boolean {
    const now = new Date();
    const attempt = this.attempts.get(identifier);
    
    if (!attempt) {
      this.attempts.set(identifier, { count: 1, resetTime: new Date(now.getTime() + this.RESET_INTERVAL) });
      return true;
    }
    
    if (attempt.resetTime < now) {
      this.attempts.set(identifier, { count: 1, resetTime: new Date(now.getTime() + this.RESET_INTERVAL) });
      return true;
    }
    
    if (attempt.count >= this.MAX_ATTEMPTS) {
      return false;
    }
    
    attempt.count++;
    return true;
  }

  static getRemainingAttempts(identifier: string): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt) return this.MAX_ATTEMPTS;
    
    if (attempt.resetTime < new Date()) {
      this.attempts.delete(identifier);
      return this.MAX_ATTEMPTS;
    }
    
    return Math.max(0, this.MAX_ATTEMPTS - attempt.count);
  }
}

// Security headers
export class SecurityHeaders {
  static getHeaders(): Record<string, string> {
    return {
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
    };
  }
}

// Audit logging
export class AuditLogger {
  static async log(
    action: string,
    resource: string,
    resourceId: string,
    userId: string,
    ipAddress?: string,
    userAgent?: string,
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>
  ): Promise<void> {
    const auditEntry = {
      id: crypto.randomUUID(),
      action,
      resource,
      resourceId,
      userId,
      ipAddress,
      userAgent,
      oldValues,
      newValues,
      timestamp: new Date().toISOString()
    };

    // In production, save to database
    console.log("AUDIT LOG:", JSON.stringify(auditEntry, null, 2));
  }
}

// Input validation and sanitization
export class InputValidator {
  static sanitizeString(input: string): string {
    return input.replace(/[<>&"']/g, (char) => {
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '"': return '&quot;';
        case "'": return '&#x27;';
        default: return char;
      }
    });
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone);
  }

  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    
    return { isValid: errors.length === 0, errors };
  }
}