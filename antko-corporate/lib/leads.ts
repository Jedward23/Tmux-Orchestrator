import { Lead } from "./types.ts";
import kv from "./kv-simple.ts";

export class LeadService {
  static async create(leadData: Omit<Lead, "id" | "createdAt" | "updatedAt">): Promise<Lead> {
    const lead: Lead = {
      ...leadData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Store with multiple indexes for efficient lookups
    await kv.atomic()
      .set(["leads", lead.id], lead)
      .set(["leads", "by_email", lead.email], lead)
      .set(["leads", "by_assigned", lead.assignedTo, lead.id], lead)
      .set(["leads", "by_status", lead.status, lead.id], lead)
      .set(["leads", "by_source", lead.source, lead.id], lead)
      .commit();
    
    return lead;
  }
  
  static async findById(id: string): Promise<Lead | null> {
    const result = await kv.get<Lead>(["leads", id]);
    return result.value;
  }
  
  static async findByEmail(email: string): Promise<Lead | null> {
    const result = await kv.get<Lead>(["leads", "by_email", email]);
    return result.value;
  }
  
  static async update(id: string, updates: Partial<Omit<Lead, "id" | "createdAt">>): Promise<Lead | null> {
    const existing = await kv.get<Lead>(["leads", id]);
    if (!existing.value) return null;
    
    const updated: Lead = {
      ...existing.value,
      ...updates,
      updatedAt: new Date(),
    };
    
    // Update all indexes
    const oldLead = existing.value;
    await kv.atomic()
      .check(existing)
      .set(["leads", id], updated)
      .set(["leads", "by_email", updated.email], updated)
      .delete(["leads", "by_assigned", oldLead.assignedTo, id])
      .set(["leads", "by_assigned", updated.assignedTo, id], updated)
      .delete(["leads", "by_status", oldLead.status, id])
      .set(["leads", "by_status", updated.status, id], updated)
      .delete(["leads", "by_source", oldLead.source, id])
      .set(["leads", "by_source", updated.source, id], updated)
      .commit();
    
    return updated;
  }
  
  static async delete(id: string): Promise<boolean> {
    const existing = await kv.get<Lead>(["leads", id]);
    if (!existing.value) return false;
    
    const lead = existing.value;
    const result = await kv.atomic()
      .check(existing)
      .delete(["leads", id])
      .delete(["leads", "by_email", lead.email])
      .delete(["leads", "by_assigned", lead.assignedTo, id])
      .delete(["leads", "by_status", lead.status, id])
      .delete(["leads", "by_source", lead.source, id])
      .commit();
    
    return result.ok;
  }
  
  static async list(filters?: {
    status?: string;
    assignedTo?: string;
    source?: string;
    minScore?: number;
    maxScore?: number;
    limit?: number;
    offset?: number;
  }): Promise<Lead[]> {
    const leads: Lead[] = [];
    let prefix = ["leads"];
    
    // Use appropriate index based on filters
    if (filters?.assignedTo) {
      prefix = ["leads", "by_assigned", filters.assignedTo];
    } else if (filters?.status) {
      prefix = ["leads", "by_status", filters.status];
    } else if (filters?.source) {
      prefix = ["leads", "by_source", filters.source];
    }
    
    let count = 0;
    const limit = filters?.limit || 100;
    const offset = filters?.offset || 0;
    
    for await (const entry of kv.list<Lead>({ prefix })) {
      if (count < offset) {
        count++;
        continue;
      }
      
      if (leads.length >= limit) {
        break;
      }
      
      const lead = entry.value;
      
      // Apply additional filters
      if (filters?.minScore && lead.score < filters.minScore) {
        continue;
      }
      
      if (filters?.maxScore && lead.score > filters.maxScore) {
        continue;
      }
      
      // Only include direct lead entries, not the index entries
      if (entry.key.length === 2 || (entry.key.length === 4 && entry.key[0] === "leads")) {
        leads.push(lead);
      }
      
      count++;
    }
    
    return leads;
  }
  
  static async search(query: string): Promise<Lead[]> {
    const leads: Lead[] = [];
    const searchTerm = query.toLowerCase();
    
    for await (const entry of kv.list<Lead>({ prefix: ["leads"] })) {
      // Only search direct lead entries
      if (entry.key.length !== 2) continue;
      
      const lead = entry.value;
      
      if (
        lead.firstName.toLowerCase().includes(searchTerm) ||
        lead.lastName.toLowerCase().includes(searchTerm) ||
        lead.email.toLowerCase().includes(searchTerm) ||
        lead.company.toLowerCase().includes(searchTerm) ||
        lead.jobTitle.toLowerCase().includes(searchTerm) ||
        lead.phone.includes(searchTerm)
      ) {
        leads.push(lead);
      }
    }
    
    return leads;
  }
  
  static async convertToCustomer(leadId: string): Promise<{ success: boolean; customerId?: string; error?: string }> {
    const lead = await this.findById(leadId);
    if (!lead) {
      return { success: false, error: "Lead not found" };
    }
    
    if (lead.status === "converted") {
      return { success: false, error: "Lead already converted" };
    }
    
    // Import CustomerService to avoid circular dependency
    const { CustomerService } = await import("./customers.ts");
    
    try {
      // Create customer from lead data
      const customer = await CustomerService.create({
        companyName: lead.company,
        contactName: `${lead.firstName} ${lead.lastName}`,
        email: lead.email,
        phone: lead.phone,
        address: "", // Will need to be filled in later
        city: "",
        state: "",
        zipCode: "",
        country: "",
        website: "",
        industry: "",
        companySize: "1-10", // Default, can be updated later
        status: "prospect",
        assignedSalesperson: lead.assignedTo,
      });
      
      // Update lead status to converted
      await this.update(leadId, { status: "converted" });
      
      return { success: true, customerId: customer.id };
    } catch (error) {
      console.error("Lead conversion error:", error);
      return { success: false, error: "Failed to convert lead" };
    }
  }
  
  static async updateScore(id: string, score: number): Promise<Lead | null> {
    if (score < 0 || score > 100) {
      throw new Error("Score must be between 0 and 100");
    }
    
    return await this.update(id, { score });
  }
  
  static async getStatistics(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    bySource: Record<string, number>;
    byAssigned: Record<string, number>;
    averageScore: number;
    conversionRate: number;
  }> {
    const stats = {
      total: 0,
      byStatus: {} as Record<string, number>,
      bySource: {} as Record<string, number>,
      byAssigned: {} as Record<string, number>,
      averageScore: 0,
      conversionRate: 0,
    };
    
    let totalScore = 0;
    let convertedCount = 0;
    
    for await (const entry of kv.list<Lead>({ prefix: ["leads"] })) {
      // Only count direct lead entries
      if (entry.key.length !== 2) continue;
      
      const lead = entry.value;
      stats.total++;
      totalScore += lead.score;
      
      // Count by status
      stats.byStatus[lead.status] = (stats.byStatus[lead.status] || 0) + 1;
      
      // Count by source
      stats.bySource[lead.source] = (stats.bySource[lead.source] || 0) + 1;
      
      // Count by assigned person
      stats.byAssigned[lead.assignedTo] = (stats.byAssigned[lead.assignedTo] || 0) + 1;
      
      // Count converted leads
      if (lead.status === "converted") {
        convertedCount++;
      }
    }
    
    stats.averageScore = stats.total > 0 ? Math.round(totalScore / stats.total) : 0;
    stats.conversionRate = stats.total > 0 ? Math.round((convertedCount / stats.total) * 100) : 0;
    
    return stats;
  }
}