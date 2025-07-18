// API Endpoint Structure for Antko Corporate CRM
// RESTful API design with comprehensive CRUD operations

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Base API endpoint patterns
export const API_ENDPOINTS = {
  // Authentication & Authorization
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
    REGISTER: "/api/auth/register",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
    VERIFY_EMAIL: "/api/auth/verify-email",
    PROFILE: "/api/auth/profile"
  },

  // User Management
  USERS: {
    BASE: "/api/users",
    BY_ID: "/api/users/:id",
    BY_EMAIL: "/api/users/email/:email",
    PERMISSIONS: "/api/users/:id/permissions",
    CHANGE_PASSWORD: "/api/users/:id/change-password",
    ACTIVATE: "/api/users/:id/activate",
    DEACTIVATE: "/api/users/:id/deactivate"
  },

  // Customer Management
  CUSTOMERS: {
    BASE: "/api/customers",
    BY_ID: "/api/customers/:id",
    SEARCH: "/api/customers/search",
    BY_STATUS: "/api/customers/status/:status",
    BY_ASSIGNED: "/api/customers/assigned/:userId",
    BY_BRAND: "/api/customers/brand/:brand",
    CONTACTS: "/api/customers/:id/contacts",
    ACTIVITIES: "/api/customers/:id/activities",
    OPPORTUNITIES: "/api/customers/:id/opportunities",
    QUOTES: "/api/customers/:id/quotes",
    NOTES: "/api/customers/:id/notes"
  },

  // Lead Management
  LEADS: {
    BASE: "/api/leads",
    BY_ID: "/api/leads/:id",
    SEARCH: "/api/leads/search",
    BY_STATUS: "/api/leads/status/:status",
    BY_SOURCE: "/api/leads/source/:source",
    BY_ASSIGNED: "/api/leads/assigned/:userId",
    CONVERT: "/api/leads/:id/convert",
    QUALIFY: "/api/leads/:id/qualify",
    SCORE: "/api/leads/:id/score",
    ACTIVITIES: "/api/leads/:id/activities",
    NOTES: "/api/leads/:id/notes"
  },

  // Contact Management
  CONTACTS: {
    BASE: "/api/contacts",
    BY_ID: "/api/contacts/:id",
    BY_CUSTOMER: "/api/contacts/customer/:customerId",
    SEARCH: "/api/contacts/search",
    PRIMARY: "/api/contacts/customer/:customerId/primary",
    ACTIVITIES: "/api/contacts/:id/activities"
  },

  // Opportunity Management
  OPPORTUNITIES: {
    BASE: "/api/opportunities",
    BY_ID: "/api/opportunities/:id",
    BY_CUSTOMER: "/api/opportunities/customer/:customerId",
    BY_STAGE: "/api/opportunities/stage/:stage",
    BY_ASSIGNED: "/api/opportunities/assigned/:userId",
    SEARCH: "/api/opportunities/search",
    PRODUCTS: "/api/opportunities/:id/products",
    ACTIVITIES: "/api/opportunities/:id/activities",
    NOTES: "/api/opportunities/:id/notes",
    CLOSE_WON: "/api/opportunities/:id/close-won",
    CLOSE_LOST: "/api/opportunities/:id/close-lost"
  },

  // Activity Management
  ACTIVITIES: {
    BASE: "/api/activities",
    BY_ID: "/api/activities/:id",
    BY_ASSIGNED: "/api/activities/assigned/:userId",
    BY_TYPE: "/api/activities/type/:type",
    BY_STATUS: "/api/activities/status/:status",
    OVERDUE: "/api/activities/overdue",
    TODAY: "/api/activities/today",
    THIS_WEEK: "/api/activities/this-week",
    COMPLETE: "/api/activities/:id/complete",
    CANCEL: "/api/activities/:id/cancel"
  },

  // Quote Management
  QUOTES: {
    BASE: "/api/quotes",
    BY_ID: "/api/quotes/:id",
    BY_CUSTOMER: "/api/quotes/customer/:customerId",
    BY_OPPORTUNITY: "/api/quotes/opportunity/:opportunityId",
    BY_STATUS: "/api/quotes/status/:status",
    SEARCH: "/api/quotes/search",
    SEND: "/api/quotes/:id/send",
    ACCEPT: "/api/quotes/:id/accept",
    REJECT: "/api/quotes/:id/reject",
    PDF: "/api/quotes/:id/pdf"
  },

  // Interaction Management
  INTERACTIONS: {
    BASE: "/api/interactions",
    BY_ID: "/api/interactions/:id",
    BY_CUSTOMER: "/api/interactions/customer/:customerId",
    BY_LEAD: "/api/interactions/lead/:leadId",
    BY_CONTACT: "/api/interactions/contact/:contactId",
    BY_TYPE: "/api/interactions/type/:type",
    SEARCH: "/api/interactions/search"
  },

  // Note Management
  NOTES: {
    BASE: "/api/notes",
    BY_ID: "/api/notes/:id",
    BY_RELATED: "/api/notes/related/:type/:id",
    SEARCH: "/api/notes/search"
  },

  // Product Management (Extended)
  PRODUCTS: {
    BASE: "/api/products",
    BY_ID: "/api/products/:id",
    BY_CATEGORY: "/api/products/category/:category",
    BY_BRAND: "/api/products/brand/:brand",
    SEARCH: "/api/products/search",
    ACTIVE: "/api/products/active",
    PRICING: "/api/products/:id/pricing",
    INVENTORY: "/api/products/:id/inventory"
  },

  // Reporting & Analytics
  REPORTS: {
    DASHBOARD: "/api/reports/dashboard",
    SALES_METRICS: "/api/reports/sales-metrics",
    PIPELINE: "/api/reports/pipeline",
    CONVERSION: "/api/reports/conversion",
    REVENUE: "/api/reports/revenue",
    ACTIVITIES: "/api/reports/activities",
    LEADS: "/api/reports/leads",
    CUSTOMERS: "/api/reports/customers",
    PERFORMANCE: "/api/reports/performance/:userId",
    EXPORT: "/api/reports/export"
  },

  // System & Admin
  SYSTEM: {
    HEALTH: "/api/system/health",
    AUDIT: "/api/system/audit",
    SETTINGS: "/api/system/settings",
    BACKUP: "/api/system/backup",
    IMPORT: "/api/system/import",
    EXPORT: "/api/system/export"
  }
} as const;

// HTTP Methods for each endpoint
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST", 
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE"
} as const;

// Standard API Response codes
export const API_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  INTERNAL_SERVER_ERROR: 500
} as const;

// API Request/Response interfaces for each resource

// Authentication
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    permissions: string[];
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Customer API
export interface CreateCustomerRequest {
  companyName: string;
  taxId?: string;
  website?: string;
  industry?: string;
  employees?: number;
  revenue?: number;
  primaryContact: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    position?: string;
  };
  addresses: {
    type: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }[];
  brands: string[];
  status: string;
  type: string;
}

export interface UpdateCustomerRequest {
  companyName?: string;
  taxId?: string;
  website?: string;
  industry?: string;
  employees?: number;
  revenue?: number;
  status?: string;
  assignedTo?: string;
}

export interface CustomerListResponse {
  customers: {
    id: string;
    companyName: string;
    status: string;
    industry: string;
    primaryContact: {
      firstName: string;
      lastName: string;
      email: string;
    };
    createdAt: string;
    updatedAt: string;
  }[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Lead API
export interface CreateLeadRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName?: string;
  position?: string;
  source: string;
  sourceDetails?: string;
  interestedBrands: string[];
  productInterests: string[];
  notes?: string;
}

export interface UpdateLeadRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  position?: string;
  status?: string;
  score?: number;
  temperature?: string;
  assignedTo?: string;
  notes?: string;
}

export interface ConvertLeadRequest {
  createCustomer: boolean;
  createOpportunity: boolean;
  opportunityDetails?: {
    name: string;
    value: number;
    probability: number;
    expectedCloseDate: string;
    products: string[];
  };
}

// Opportunity API
export interface CreateOpportunityRequest {
  name: string;
  description?: string;
  customerId: string;
  leadId?: string;
  value: number;
  currency: string;
  probability: number;
  expectedCloseDate: string;
  products: {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount: number;
  }[];
  brands: string[];
}

export interface UpdateOpportunityRequest {
  name?: string;
  description?: string;
  value?: number;
  probability?: number;
  stage?: string;
  expectedCloseDate?: string;
  assignedTo?: string;
}

// Activity API
export interface CreateActivityRequest {
  type: string;
  subject: string;
  description?: string;
  relatedTo: {
    type: string;
    id: string;
  };
  priority: string;
  dueDate?: string;
  assignedTo: string;
}

export interface UpdateActivityRequest {
  subject?: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  status?: string;
  assignedTo?: string;
}

// Quote API
export interface CreateQuoteRequest {
  customerId: string;
  opportunityId?: string;
  name: string;
  description?: string;
  validUntil: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount: number;
  }[];
  terms?: string;
  notes?: string;
}

export interface UpdateQuoteRequest {
  name?: string;
  description?: string;
  validUntil?: string;
  status?: string;
  items?: {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount: number;
  }[];
  terms?: string;
  notes?: string;
}

// Common query parameters
export interface ListQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
  filter?: Record<string, any>;
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

// Utility functions for API handling
export class APIUtils {
  static buildURL(endpoint: string, params: Record<string, string | number> = {}): string {
    let url = endpoint;
    
    // Replace path parameters
    for (const [key, value] of Object.entries(params)) {
      url = url.replace(`:${key}`, String(value));
    }
    
    return url;
  }

  static buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, String(v)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    }
    
    return searchParams.toString();
  }

  static createAPIResponse<T>(
    data: T,
    message?: string,
    pagination?: any
  ): APIResponse<T> {
    return {
      success: true,
      data,
      message,
      pagination
    };
  }

  static createAPIError(
    message: string,
    code: string = "GENERIC_ERROR",
    details?: Record<string, any>
  ): APIResponse<never> {
    return {
      success: false,
      error: message,
      message: code,
      data: details as any
    };
  }

  static validateRequiredFields(
    data: Record<string, any>,
    required: string[]
  ): string[] {
    const missing: string[] = [];
    
    for (const field of required) {
      if (!(field in data) || data[field] === undefined || data[field] === null || data[field] === '') {
        missing.push(field);
      }
    }
    
    return missing;
  }

  static sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      return input.trim();
    }
    
    if (Array.isArray(input)) {
      return input.map(item => this.sanitizeInput(item));
    }
    
    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = this.sanitizeInput(value);
      }
      return sanitized;
    }
    
    return input;
  }
}

// Error handling middleware
export class APIErrorHandler {
  static handle(error: any): APIResponse<never> {
    if (error.name === 'ValidationError') {
      return APIUtils.createAPIError(
        "Validation failed",
        "VALIDATION_ERROR",
        error.details
      );
    }
    
    if (error.name === 'NotFoundError') {
      return APIUtils.createAPIError(
        "Resource not found",
        "NOT_FOUND"
      );
    }
    
    if (error.name === 'UnauthorizedError') {
      return APIUtils.createAPIError(
        "Unauthorized access",
        "UNAUTHORIZED"
      );
    }
    
    if (error.name === 'ForbiddenError') {
      return APIUtils.createAPIError(
        "Forbidden access",
        "FORBIDDEN"
      );
    }
    
    // Generic error
    return APIUtils.createAPIError(
      "Internal server error",
      "INTERNAL_ERROR"
    );
  }
}

// Rate limiting configuration
export const RATE_LIMITS = {
  AUTH: {
    LOGIN: { requests: 5, window: 15 * 60 * 1000 }, // 5 requests per 15 minutes
    REGISTER: { requests: 3, window: 60 * 60 * 1000 }, // 3 requests per hour
  },
  API: {
    READ: { requests: 1000, window: 60 * 60 * 1000 }, // 1000 requests per hour
    WRITE: { requests: 100, window: 60 * 60 * 1000 }, // 100 requests per hour
    EXPORT: { requests: 10, window: 60 * 60 * 1000 }, // 10 requests per hour
  }
} as const;