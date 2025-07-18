// Security Protocols for Antko Corporate CRM
// Comprehensive security framework with enterprise-grade protection

export interface SecurityConfig {
  encryption: {
    algorithm: string;
    keyLength: number;
    ivLength: number;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
    algorithm: string;
  };
  password: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    maxAttempts: number;
    lockoutDuration: number;
  };
  session: {
    maxAge: number;
    secure: boolean;
    httpOnly: boolean;
    sameSite: 'strict' | 'lax' | 'none';
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
    skipSuccessfulRequests: boolean;
  };
}

export const SECURITY_CONFIG: SecurityConfig = {
  encryption: {
    algorithm: 'AES-256-GCM',
    keyLength: 32,
    ivLength: 16
  },
  jwt: {
    secret: Deno.env.get('JWT_SECRET') || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: '24h',
    refreshExpiresIn: '7d',
    algorithm: 'HS256'
  },
  password: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAttempts: 5,
    lockoutDuration: 900000 // 15 minutes
  },
  session: {
    maxAge: 86400000, // 24 hours
    secure: true,
    httpOnly: true,
    sameSite: 'strict'
  },
  rateLimit: {
    windowMs: 900000, // 15 minutes
    maxRequests: 100,
    skipSuccessfulRequests: false
  }
};

// Data Encryption Service
export class EncryptionService {
  private static readonly ENCRYPTION_KEY = new TextEncoder().encode(
    SECURITY_CONFIG.jwt.secret.padEnd(32, '0').substring(0, 32)
  );

  // Encrypt sensitive data
  static async encrypt(data: string): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);
    
    const key = await crypto.subtle.importKey(
      'raw',
      this.ENCRYPTION_KEY,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encodedData
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode(...combined));
  }

  // Decrypt sensitive data
  static async decrypt(encryptedData: string): Promise<string> {
    const combined = new Uint8Array(
      atob(encryptedData).split('').map(c => c.charCodeAt(0))
    );
    
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    
    const key = await crypto.subtle.importKey(
      'raw',
      this.ENCRYPTION_KEY,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );
    
    return new TextDecoder().decode(decrypted);
  }

  // Hash passwords with salt
  static async hashPassword(password: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    
    const key = await crypto.subtle.importKey(
      'raw',
      passwordData,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      key,
      256
    );
    
    // Combine salt and hash
    const combined = new Uint8Array(salt.length + derivedBits.byteLength);
    combined.set(salt);
    combined.set(new Uint8Array(derivedBits), salt.length);
    
    return btoa(String.fromCharCode(...combined));
  }

  // Verify password
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const combined = new Uint8Array(
      atob(hashedPassword).split('').map(c => c.charCodeAt(0))
    );
    
    const salt = combined.slice(0, 16);
    const hash = combined.slice(16);
    
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    
    const key = await crypto.subtle.importKey(
      'raw',
      passwordData,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      key,
      256
    );
    
    const newHash = new Uint8Array(derivedBits);
    
    // Compare hashes
    if (newHash.length !== hash.length) return false;
    
    let result = 0;
    for (let i = 0; i < newHash.length; i++) {
      result |= newHash[i] ^ hash[i];
    }
    
    return result === 0;
  }
}

// Field-Level Encryption for sensitive data
export class FieldEncryption {
  private static readonly sensitiveFields = new Set([
    'password',
    'taxId',
    'phone',
    'mobile',
    'email',
    'notes',
    'description'
  ]);

  static async encryptSensitiveFields(data: Record<string, any>): Promise<Record<string, any>> {
    const encrypted = { ...data };
    
    for (const [key, value] of Object.entries(data)) {
      if (this.sensitiveFields.has(key) && typeof value === 'string') {
        encrypted[key] = await EncryptionService.encrypt(value);
      }
    }
    
    return encrypted;
  }

  static async decryptSensitiveFields(data: Record<string, any>): Promise<Record<string, any>> {
    const decrypted = { ...data };
    
    for (const [key, value] of Object.entries(data)) {
      if (this.sensitiveFields.has(key) && typeof value === 'string') {
        try {
          decrypted[key] = await EncryptionService.decrypt(value);
        } catch {
          // If decryption fails, assume it's not encrypted
          decrypted[key] = value;
        }
      }
    }
    
    return decrypted;
  }
}

// Audit Trail System
export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  action: AuditAction;
  resource: string;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  changes?: {
    before: Record<string, any>;
    after: Record<string, any>;
  };
  metadata?: Record<string, any>;
}

export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  FAILED_LOGIN = 'FAILED_LOGIN',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT'
}

export class AuditService {
  private static auditLog: AuditEntry[] = [];

  static async log(
    userId: string,
    userEmail: string,
    action: AuditAction,
    resource: string,
    resourceId: string,
    request: Request,
    changes?: { before: Record<string, any>; after: Record<string, any> },
    metadata?: Record<string, any>
  ): Promise<void> {
    const entry: AuditEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      userId,
      userEmail,
      action,
      resource,
      resourceId,
      ipAddress: this.getClientIP(request),
      userAgent: request.headers.get('User-Agent') || 'Unknown',
      changes,
      metadata
    };

    this.auditLog.push(entry);
    
    // In production, save to database
    console.log('AUDIT LOG:', JSON.stringify(entry, null, 2));
  }

  static getAuditLog(
    filters?: {
      userId?: string;
      action?: AuditAction;
      resource?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ): AuditEntry[] {
    let filtered = [...this.auditLog];
    
    if (filters?.userId) {
      filtered = filtered.filter(entry => entry.userId === filters.userId);
    }
    
    if (filters?.action) {
      filtered = filtered.filter(entry => entry.action === filters.action);
    }
    
    if (filters?.resource) {
      filtered = filtered.filter(entry => entry.resource === filters.resource);
    }
    
    if (filters?.startDate) {
      filtered = filtered.filter(entry => 
        new Date(entry.timestamp) >= filters.startDate!
      );
    }
    
    if (filters?.endDate) {
      filtered = filtered.filter(entry => 
        new Date(entry.timestamp) <= filters.endDate!
      );
    }
    
    return filtered.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  private static getClientIP(request: Request): string {
    const forwarded = request.headers.get('X-Forwarded-For');
    const realIP = request.headers.get('X-Real-IP');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    if (realIP) {
      return realIP;
    }
    
    return 'unknown';
  }
}

// Data Validation and Sanitization
export class DataValidator {
  static validateAndSanitize(data: Record<string, any>, schema: ValidationSchema): ValidationResult {
    const errors: ValidationError[] = [];
    const sanitized: Record<string, any> = {};
    
    for (const [field, rules] of Object.entries(schema.fields)) {
      const value = data[field];
      
      // Check required fields
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push({
          field,
          message: `${field} is required`,
          code: 'REQUIRED'
        });
        continue;
      }
      
      // Skip validation for optional empty fields
      if (!rules.required && (value === undefined || value === null || value === '')) {
        continue;
      }
      
      // Type validation
      if (rules.type && typeof value !== rules.type) {
        errors.push({
          field,
          message: `${field} must be of type ${rules.type}`,
          code: 'TYPE_ERROR'
        });
        continue;
      }
      
      // String validation
      if (rules.type === 'string' && typeof value === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
          errors.push({
            field,
            message: `${field} must be at least ${rules.minLength} characters long`,
            code: 'MIN_LENGTH'
          });
        }
        
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push({
            field,
            message: `${field} must be no more than ${rules.maxLength} characters long`,
            code: 'MAX_LENGTH'
          });
        }
        
        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push({
            field,
            message: `${field} format is invalid`,
            code: 'PATTERN_MISMATCH'
          });
        }
        
        // Sanitize string
        sanitized[field] = this.sanitizeString(value);
      }
      
      // Number validation
      if (rules.type === 'number' && typeof value === 'number') {
        if (rules.min !== undefined && value < rules.min) {
          errors.push({
            field,
            message: `${field} must be at least ${rules.min}`,
            code: 'MIN_VALUE'
          });
        }
        
        if (rules.max !== undefined && value > rules.max) {
          errors.push({
            field,
            message: `${field} must be no more than ${rules.max}`,
            code: 'MAX_VALUE'
          });
        }
        
        sanitized[field] = value;
      }
      
      // Array validation
      if (rules.type === 'array' && Array.isArray(value)) {
        if (rules.minItems && value.length < rules.minItems) {
          errors.push({
            field,
            message: `${field} must have at least ${rules.minItems} items`,
            code: 'MIN_ITEMS'
          });
        }
        
        if (rules.maxItems && value.length > rules.maxItems) {
          errors.push({
            field,
            message: `${field} must have no more than ${rules.maxItems} items`,
            code: 'MAX_ITEMS'
          });
        }
        
        sanitized[field] = value;
      }
      
      // Custom validation
      if (rules.custom) {
        const customResult = rules.custom(value);
        if (!customResult.isValid) {
          errors.push({
            field,
            message: customResult.message,
            code: 'CUSTOM_VALIDATION'
          });
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: sanitized
    };
  }

  private static sanitizeString(str: string): string {
    return str
      .replace(/[<>&"']/g, (char) => {
        const entities: Record<string, string> = {
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;',
          '"': '&quot;',
          "'": '&#x27;'
        };
        return entities[char] || char;
      })
      .trim();
  }
}

export interface ValidationSchema {
  fields: Record<string, ValidationRule>;
}

export interface ValidationRule {
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  minItems?: number;
  maxItems?: number;
  custom?: (value: any) => { isValid: boolean; message: string };
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  sanitizedData: Record<string, any>;
}

// Common validation schemas
export const VALIDATION_SCHEMAS = {
  USER_REGISTRATION: {
    fields: {
      email: {
        type: 'string' as const,
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        maxLength: 255
      },
      password: {
        type: 'string' as const,
        required: true,
        minLength: 12,
        custom: (value: string) => {
          const hasUpper = /[A-Z]/.test(value);
          const hasLower = /[a-z]/.test(value);
          const hasNumber = /\d/.test(value);
          const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
          
          const isValid = hasUpper && hasLower && hasNumber && hasSpecial;
          
          return {
            isValid,
            message: 'Password must contain uppercase, lowercase, number, and special character'
          };
        }
      },
      firstName: {
        type: 'string' as const,
        required: true,
        minLength: 1,
        maxLength: 50
      },
      lastName: {
        type: 'string' as const,
        required: true,
        minLength: 1,
        maxLength: 50
      }
    }
  },
  
  CUSTOMER_CREATE: {
    fields: {
      companyName: {
        type: 'string' as const,
        required: true,
        minLength: 1,
        maxLength: 255
      },
      taxId: {
        type: 'string' as const,
        required: false,
        maxLength: 50
      },
      website: {
        type: 'string' as const,
        required: false,
        pattern: /^https?:\/\/.+/
      },
      industry: {
        type: 'string' as const,
        required: false,
        maxLength: 100
      },
      employees: {
        type: 'number' as const,
        required: false,
        min: 1
      },
      revenue: {
        type: 'number' as const,
        required: false,
        min: 0
      }
    }
  },
  
  LEAD_CREATE: {
    fields: {
      firstName: {
        type: 'string' as const,
        required: true,
        minLength: 1,
        maxLength: 50
      },
      lastName: {
        type: 'string' as const,
        required: true,
        minLength: 1,
        maxLength: 50
      },
      email: {
        type: 'string' as const,
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        maxLength: 255
      },
      phone: {
        type: 'string' as const,
        required: false,
        pattern: /^\+?[\d\s\-\(\)]+$/,
        maxLength: 20
      },
      companyName: {
        type: 'string' as const,
        required: false,
        maxLength: 255
      }
    }
  }
} as const;

// Security Headers Manager
export class SecurityHeaders {
  static getSecurityHeaders(): Record<string, string> {
    return {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; '),
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    };
  }
}

// API Security Middleware
export class APISecurityMiddleware {
  static async validateRequest(request: Request): Promise<SecurityValidationResult> {
    const errors: string[] = [];
    
    // Check Content-Type for POST/PUT requests
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      const contentType = request.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        errors.push('Invalid Content-Type. Expected application/json');
      }
    }
    
    // Check for suspicious patterns
    const url = new URL(request.url);
    if (this.containsSuspiciousPatterns(url.pathname + url.search)) {
      errors.push('Suspicious request pattern detected');
    }
    
    // Check request size
    const contentLength = request.headers.get('Content-Length');
    if (contentLength && parseInt(contentLength) > 10485760) { // 10MB limit
      errors.push('Request payload too large');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private static containsSuspiciousPatterns(input: string): boolean {
    const suspiciousPatterns = [
      /(\.\./)+/,  // Path traversal
      /<script/i,  // Script injection
      /javascript:/i,  // JavaScript URLs
      /on\w+\s*=/i,  // Event handlers
      /eval\s*\(/i,  // Eval functions
      /union\s+select/i,  // SQL injection
      /drop\s+table/i,  // SQL injection
      /insert\s+into/i,  // SQL injection
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(input));
  }
}

export interface SecurityValidationResult {
  isValid: boolean;
  errors: string[];
}

// Backup and Recovery
export class BackupService {
  static async createBackup(): Promise<string> {
    // In production, implement actual backup logic
    const backupId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    console.log(`Creating backup ${backupId} at ${timestamp}`);
    
    return backupId;
  }

  static async restoreBackup(backupId: string): Promise<boolean> {
    // In production, implement actual restore logic
    console.log(`Restoring backup ${backupId}`);
    
    return true;
  }
}

// Database Connection Security
export class DatabaseSecurity {
  static async createSecureConnection(): Promise<void> {
    // In production, implement secure database connection
    // - Use connection pooling
    // - Enable SSL/TLS
    // - Use prepared statements
    // - Implement connection timeout
    // - Use read/write replicas
    
    console.log('Creating secure database connection');
  }
}

// Environment Configuration
export class EnvironmentConfig {
  static getSecuritySettings(): SecurityConfig {
    const isDevelopment = Deno.env.get('DENO_ENV') === 'development';
    
    return {
      ...SECURITY_CONFIG,
      session: {
        ...SECURITY_CONFIG.session,
        secure: !isDevelopment, // Allow insecure cookies in development
      }
    };
  }
}