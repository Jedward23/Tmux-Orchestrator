import { Customer, Lead, Opportunity, Activity, SalesUser, DashboardMetrics } from "../types.ts";
import secureKv from "../kv.ts";

export class SecureCRMService {
  private static readonly CUSTOMER_PREFIX = ["customers"];
  private static readonly LEAD_PREFIX = ["leads"];
  private static readonly OPPORTUNITY_PREFIX = ["opportunities"];
  private static readonly ACTIVITY_PREFIX = ["activities"];
  private static readonly USER_PREFIX = ["users"];

  // Customer Management
  static async createCustomer(customerData: Omit<Customer, "id" | "createdAt" | "updatedAt">, userId: string): Promise<Customer> {
    const newCustomer: Customer = {
      ...customerData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await secureKv.set([...this.CUSTOMER_PREFIX, newCustomer.id], newCustomer, { userId });
    
    if (!result.ok) {
      throw new Error("Failed to create customer");
    }

    return newCustomer;
  }

  static async getCustomer(id: string, userId: string): Promise<Customer | null> {
    const result = await secureKv.get<Customer>([...this.CUSTOMER_PREFIX, id], { userId });
    return result.value;
  }

  static async getAllCustomers(userId: string): Promise<Customer[]> {
    return await secureKv.list<Customer>({ prefix: this.CUSTOMER_PREFIX }, { userId });
  }

  static async updateCustomer(id: string, customerData: Partial<Omit<Customer, "id" | "createdAt" | "updatedAt">>, userId: string): Promise<Customer | null> {
    const existing = await secureKv.get<Customer>([...this.CUSTOMER_PREFIX, id], { userId });
    if (!existing.value) return null;

    const updatedCustomer: Customer = {
      ...existing.value,
      ...customerData,
      updatedAt: new Date()
    };

    const result = await secureKv.set([...this.CUSTOMER_PREFIX, id], updatedCustomer, { userId });
    
    if (!result.ok) {
      throw new Error("Failed to update customer");
    }

    return updatedCustomer;
  }

  // Lead Management
  static async createLead(leadData: Omit<Lead, "id" | "createdAt" | "updatedAt">, userId: string): Promise<Lead> {
    const newLead: Lead = {
      ...leadData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await secureKv.set([...this.LEAD_PREFIX, newLead.id], newLead, { userId });
    
    if (!result.ok) {
      throw new Error("Failed to create lead");
    }

    return newLead;
  }

  static async getLead(id: string, userId: string): Promise<Lead | null> {
    const result = await secureKv.get<Lead>([...this.LEAD_PREFIX, id], { userId });
    return result.value;
  }

  static async getAllLeads(userId: string): Promise<Lead[]> {
    return await secureKv.list<Lead>({ prefix: this.LEAD_PREFIX }, { userId });
  }

  static async convertLeadToCustomer(leadId: string, userId: string): Promise<Customer | null> {
    const lead = await this.getLead(leadId, userId);
    if (!lead) return null;

    const customerData: Omit<Customer, "id" | "createdAt" | "updatedAt"> = {
      companyName: lead.company,
      contactName: `${lead.firstName} ${lead.lastName}`,
      email: lead.email,
      phone: lead.phone,
      address: "", // To be filled later
      city: "",
      state: "",
      zipCode: "",
      country: "",
      website: "",
      industry: "",
      companySize: "1-10", // Default
      status: "prospect",
      assignedSalesperson: lead.assignedTo
    };

    const customer = await this.createCustomer(customerData, userId);
    
    // Update lead status
    await this.updateLead(leadId, { status: "converted" }, userId);
    
    return customer;
  }

  static async updateLead(id: string, leadData: Partial<Omit<Lead, "id" | "createdAt" | "updatedAt">>, userId: string): Promise<Lead | null> {
    const existing = await secureKv.get<Lead>([...this.LEAD_PREFIX, id], { userId });
    if (!existing.value) return null;

    const updatedLead: Lead = {
      ...existing.value,
      ...leadData,
      updatedAt: new Date()
    };

    const result = await secureKv.set([...this.LEAD_PREFIX, id], updatedLead, { userId });
    
    if (!result.ok) {
      throw new Error("Failed to update lead");
    }

    return updatedLead;
  }

  // Opportunity Management
  static async createOpportunity(opportunityData: Omit<Opportunity, "id" | "createdAt" | "updatedAt">, userId: string): Promise<Opportunity> {
    const newOpportunity: Opportunity = {
      ...opportunityData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await secureKv.set([...this.OPPORTUNITY_PREFIX, newOpportunity.id], newOpportunity, { userId });
    
    if (!result.ok) {
      throw new Error("Failed to create opportunity");
    }

    return newOpportunity;
  }

  static async getOpportunity(id: string, userId: string): Promise<Opportunity | null> {
    const result = await secureKv.get<Opportunity>([...this.OPPORTUNITY_PREFIX, id], { userId });
    return result.value;
  }

  static async getAllOpportunities(userId: string): Promise<Opportunity[]> {
    return await secureKv.list<Opportunity>({ prefix: this.OPPORTUNITY_PREFIX }, { userId });
  }

  // Activity Management
  static async createActivity(activityData: Omit<Activity, "id" | "createdAt" | "updatedAt">, userId: string): Promise<Activity> {
    const newActivity: Activity = {
      ...activityData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await secureKv.set([...this.ACTIVITY_PREFIX, newActivity.id], newActivity, { userId });
    
    if (!result.ok) {
      throw new Error("Failed to create activity");
    }

    return newActivity;
  }

  static async getActivitiesForEntity(entityType: "customer" | "lead" | "opportunity", entityId: string, userId: string): Promise<Activity[]> {
    const allActivities = await secureKv.list<Activity>({ prefix: this.ACTIVITY_PREFIX }, { userId });
    
    return allActivities.filter(activity => 
      activity.relatedTo.type === entityType && activity.relatedTo.id === entityId
    );
  }

  // Dashboard Metrics
  static async getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
    const [customers, leads, opportunities] = await Promise.all([
      this.getAllCustomers(userId),
      this.getAllLeads(userId),
      this.getAllOpportunities(userId)
    ]);

    const pipelineValue = opportunities
      .filter(opp => opp.stage !== "closed-lost")
      .reduce((sum, opp) => sum + (opp.amount * opp.probability / 100), 0);

    const monthlyRevenue = opportunities
      .filter(opp => opp.stage === "closed-won")
      .reduce((sum, opp) => sum + opp.amount, 0);

    const convertedLeads = leads.filter(lead => lead.status === "converted").length;
    const totalLeads = leads.length;
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    const closedWonOpportunities = opportunities.filter(opp => opp.stage === "closed-won");
    const avgDealSize = closedWonOpportunities.length > 0 
      ? closedWonOpportunities.reduce((sum, opp) => sum + opp.amount, 0) / closedWonOpportunities.length
      : 0;

    return {
      totalCustomers: customers.length,
      totalLeads: leads.length,
      totalOpportunities: opportunities.length,
      pipelineValue,
      monthlyRevenue,
      conversionRate,
      avgDealSize,
      salesVelocity: 0 // Placeholder - would need historical data
    };
  }

  // Security: Get audit trail for any entity
  static async getAuditTrail(entityType: string, entityId: string, userId: string): Promise<any[]> {
    const allLogs = await secureKv.getAuditLogs(1000);
    return allLogs.filter(log => 
      log.details.key && log.details.key.includes(entityId)
    );
  }
}