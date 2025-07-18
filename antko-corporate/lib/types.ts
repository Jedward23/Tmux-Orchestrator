export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  visibility: {
    solucionesEnAgua: boolean;
    wattersolutions: boolean;
    acuafitting: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type Brand = "soluciones" | "wattersolutions" | "acuafitting";

export interface ProductFilters {
  brand?: Brand;
  category?: string;
  search?: string;
}

// CRM Types
export interface Customer {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website?: string;
  industry: string;
  companySize: "1-10" | "11-50" | "51-200" | "201-500" | "500+";
  status: "active" | "inactive" | "prospect";
  assignedSalesperson: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  source: "website" | "referral" | "cold-call" | "email" | "social" | "trade-show" | "other";
  status: "new" | "contacted" | "qualified" | "nurturing" | "converted" | "lost";
  score: number; // 1-100
  notes: string;
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Opportunity {
  id: string;
  title: string;
  customerId: string;
  amount: number;
  probability: number; // 0-100
  stage: "prospecting" | "qualification" | "proposal" | "negotiation" | "closed-won" | "closed-lost";
  products: string[]; // Product IDs
  expectedCloseDate: Date;
  assignedTo: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  type: "call" | "email" | "meeting" | "task" | "note";
  subject: string;
  description: string;
  relatedTo: {
    type: "customer" | "lead" | "opportunity";
    id: string;
  };
  assignedTo: string;
  dueDate?: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SalesUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "sales-manager" | "sales-rep";
  territory?: string;
  quota?: number;
  active: boolean;
  createdAt: Date;
}

export interface DashboardMetrics {
  totalCustomers: number;
  totalLeads: number;
  totalOpportunities: number;
  pipelineValue: number;
  monthlyRevenue: number;
  conversionRate: number;
  avgDealSize: number;
  salesVelocity: number;
}