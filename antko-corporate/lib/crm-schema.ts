// CRM Database Schema Design
// This file defines the comprehensive CRM data structure for Antko Corporate

export interface User {
  id: string;
  email: string;
  password: string; // Hashed
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

export enum UserRole {
  ADMIN = "admin",
  SALES_MANAGER = "sales_manager", 
  SALES_REP = "sales_rep",
  VIEWER = "viewer"
}

export interface Customer {
  id: string;
  type: CustomerType;
  // Company Information
  companyName: string;
  taxId?: string;
  website?: string;
  industry?: string;
  employees?: number;
  revenue?: number;
  // Primary Contact
  primaryContactId: string;
  // Status & Lifecycle
  status: CustomerStatus;
  lifecycle: CustomerLifecycle;
  // Brand Associations
  brands: Brand[];
  // Audit Fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  assignedTo?: string;
}

export enum CustomerType {
  ENTERPRISE = "enterprise",
  SMB = "smb",
  DISTRIBUTOR = "distributor",
  INDIVIDUAL = "individual"
}

export enum CustomerStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BLACKLISTED = "blacklisted",
  PROSPECT = "prospect"
}

export enum CustomerLifecycle {
  LEAD = "lead",
  QUALIFIED = "qualified",
  OPPORTUNITY = "opportunity",
  CUSTOMER = "customer",
  CHURNED = "churned"
}

export interface Contact {
  id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  position?: string;
  department?: string;
  isPrimary: boolean;
  isActive: boolean;
  // Communication Preferences
  preferences: {
    email: boolean;
    phone: boolean;
    sms: boolean;
    newsletter: boolean;
  };
  // Audit Fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface Address {
  id: string;
  customerId: string;
  type: AddressType;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum AddressType {
  BILLING = "billing",
  SHIPPING = "shipping",
  OFFICE = "office"
}

export interface Lead {
  id: string;
  source: LeadSource;
  sourceDetails?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName?: string;
  position?: string;
  // Lead Qualification
  status: LeadStatus;
  score: number; // 0-100
  temperature: LeadTemperature;
  // Brand Interest
  interestedBrands: Brand[];
  productInterests: string[];
  // Assignment & Ownership
  assignedTo?: string;
  qualifiedBy?: string;
  qualifiedAt?: Date;
  // Audit Fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export enum LeadSource {
  WEBSITE = "website",
  REFERRAL = "referral",
  TRADE_SHOW = "trade_show",
  COLD_CALL = "cold_call",
  EMAIL_CAMPAIGN = "email_campaign",
  SOCIAL_MEDIA = "social_media",
  PARTNER = "partner",
  DIRECT = "direct"
}

export enum LeadStatus {
  NEW = "new",
  CONTACTED = "contacted",
  QUALIFIED = "qualified",
  UNQUALIFIED = "unqualified",
  CONVERTED = "converted",
  LOST = "lost"
}

export enum LeadTemperature {
  HOT = "hot",
  WARM = "warm",
  COLD = "cold"
}

export interface Opportunity {
  id: string;
  customerId: string;
  leadId?: string;
  name: string;
  description?: string;
  // Financial Information
  value: number;
  currency: string;
  probability: number; // 0-100
  // Timeline
  stage: OpportunityStage;
  expectedCloseDate: Date;
  actualCloseDate?: Date;
  // Products & Services
  products: OpportunityProduct[];
  // Assignment
  assignedTo: string;
  // Brand Association
  brands: Brand[];
  // Audit Fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export enum OpportunityStage {
  PROSPECTING = "prospecting",
  QUALIFICATION = "qualification",
  PROPOSAL = "proposal",
  NEGOTIATION = "negotiation",
  CLOSED_WON = "closed_won",
  CLOSED_LOST = "closed_lost"
}

export interface OpportunityProduct {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface Activity {
  id: string;
  type: ActivityType;
  relatedTo: ActivityRelation;
  relatedId: string;
  // Activity Details
  subject: string;
  description?: string;
  status: ActivityStatus;
  priority: ActivityPriority;
  // Scheduling
  dueDate?: Date;
  completedAt?: Date;
  // Assignment
  assignedTo: string;
  // Audit Fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export enum ActivityType {
  CALL = "call",
  EMAIL = "email",
  MEETING = "meeting",
  TASK = "task",
  DEMO = "demo",
  PROPOSAL = "proposal",
  FOLLOW_UP = "follow_up",
  QUOTE = "quote"
}

export enum ActivityRelation {
  CUSTOMER = "customer",
  LEAD = "lead",
  OPPORTUNITY = "opportunity",
  CONTACT = "contact"
}

export enum ActivityStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

export enum ActivityPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent"
}

export interface Interaction {
  id: string;
  type: InteractionType;
  direction: InteractionDirection;
  // Related Entities
  customerId?: string;
  leadId?: string;
  contactId?: string;
  opportunityId?: string;
  // Interaction Details
  subject: string;
  notes?: string;
  duration?: number; // in minutes
  outcome?: string;
  // Communication Details
  emailAddress?: string;
  phoneNumber?: string;
  // Audit Fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export enum InteractionType {
  PHONE_CALL = "phone_call",
  EMAIL = "email",
  MEETING = "meeting",
  CHAT = "chat",
  SMS = "sms",
  SOCIAL_MEDIA = "social_media"
}

export enum InteractionDirection {
  INBOUND = "inbound",
  OUTBOUND = "outbound"
}

export interface Quote {
  id: string;
  customerId: string;
  opportunityId?: string;
  // Quote Details
  name: string;
  description?: string;
  status: QuoteStatus;
  // Financial Information
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  // Timeline
  validUntil: Date;
  issuedDate: Date;
  acceptedDate?: Date;
  // Products
  items: QuoteItem[];
  // Terms & Conditions
  terms?: string;
  notes?: string;
  // Audit Fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export enum QuoteStatus {
  DRAFT = "draft",
  SENT = "sent",
  VIEWED = "viewed",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  EXPIRED = "expired"
}

export interface QuoteItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface Note {
  id: string;
  relatedTo: NoteRelation;
  relatedId: string;
  title?: string;
  content: string;
  isPrivate: boolean;
  // Audit Fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export enum NoteRelation {
  CUSTOMER = "customer",
  LEAD = "lead",
  OPPORTUNITY = "opportunity",
  CONTACT = "contact",
  ACTIVITY = "activity"
}

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: AuditAction;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  // Audit Fields
  createdAt: Date;
  createdBy: string;
}

export enum AuditAction {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  VIEW = "view",
  EXPORT = "export"
}

// Extended Product interface for CRM integration
export interface CRMProduct extends Product {
  // Additional CRM-specific fields
  salesCategory?: string;
  commission?: number;
  costPrice?: number;
  margin?: number;
  isActive: boolean;
  salesNotes?: string;
}

// Brand type from existing schema
export type Brand = "solucionesEnAgua" | "wattersolutions" | "acuafitting";

// Existing Product interface (imported from types.ts)
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

// CRM Dashboard Metrics
export interface CRMMetrics {
  totalCustomers: number;
  totalLeads: number;
  totalOpportunities: number;
  totalRevenue: number;
  conversionRate: number;
  averageDealSize: number;
  salesVelocity: number;
  pipelineValue: number;
  leadsBySource: Record<LeadSource, number>;
  opportunitiesByStage: Record<OpportunityStage, number>;
  revenueByBrand: Record<Brand, number>;
  monthlyMetrics: MonthlyMetrics[];
}

export interface MonthlyMetrics {
  month: string;
  revenue: number;
  leads: number;
  customers: number;
  opportunities: number;
}

// Permission System
export interface Permission {
  resource: CRMResource;
  actions: CRMAction[];
  brands?: Brand[];
  ownOnly?: boolean;
}

export enum CRMResource {
  CUSTOMERS = "customers",
  LEADS = "leads",
  OPPORTUNITIES = "opportunities",
  CONTACTS = "contacts",
  ACTIVITIES = "activities",
  QUOTES = "quotes",
  REPORTS = "reports",
  USERS = "users",
  PRODUCTS = "products"
}

export enum CRMAction {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  EXPORT = "export",
  IMPORT = "import"
}

export interface RolePermissions {
  [UserRole.ADMIN]: Permission[];
  [UserRole.SALES_MANAGER]: Permission[];
  [UserRole.SALES_REP]: Permission[];
  [UserRole.VIEWER]: Permission[];
}