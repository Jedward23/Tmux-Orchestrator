import { Customer } from "./types.ts";
import kv from "./kv-simple.ts";

export class CustomerService {
  static async create(customerData: Omit<Customer, "id" | "createdAt" | "updatedAt">): Promise<Customer> {
    const customer: Customer = {
      ...customerData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Store with multiple indexes for efficient lookups
    await kv.atomic()
      .set(["customers", customer.id], customer)
      .set(["customers", "by_email", customer.email], customer)
      .set(["customers", "by_salesperson", customer.assignedSalesperson, customer.id], customer)
      .commit();
    
    return customer;
  }
  
  static async findById(id: string): Promise<Customer | null> {
    const result = await kv.get<Customer>(["customers", id]);
    return result.value;
  }
  
  static async findByEmail(email: string): Promise<Customer | null> {
    const result = await kv.get<Customer>(["customers", "by_email", email]);
    return result.value;
  }
  
  static async update(id: string, updates: Partial<Omit<Customer, "id" | "createdAt">>): Promise<Customer | null> {
    const existing = await kv.get<Customer>(["customers", id]);
    if (!existing.value) return null;
    
    const updated: Customer = {
      ...existing.value,
      ...updates,
      updatedAt: new Date(),
    };
    
    // Update all indexes
    await kv.atomic()
      .check(existing)
      .set(["customers", id], updated)
      .set(["customers", "by_email", updated.email], updated)
      .delete(["customers", "by_salesperson", existing.value.assignedSalesperson, id])
      .set(["customers", "by_salesperson", updated.assignedSalesperson, id], updated)
      .commit();
    
    return updated;
  }
  
  static async delete(id: string): Promise<boolean> {
    const existing = await kv.get<Customer>(["customers", id]);
    if (!existing.value) return false;
    
    const result = await kv.atomic()
      .check(existing)
      .delete(["customers", id])
      .delete(["customers", "by_email", existing.value.email])
      .delete(["customers", "by_salesperson", existing.value.assignedSalesperson, id])
      .commit();
    
    return result.ok;
  }
  
  static async list(filters?: {
    status?: string;
    assignedTo?: string;
    industry?: string;
    limit?: number;
    offset?: number;
  }): Promise<Customer[]> {
    const customers: Customer[] = [];
    let prefix = ["customers"];
    
    // If filtering by salesperson, use that index
    if (filters?.assignedTo) {
      prefix = ["customers", "by_salesperson", filters.assignedTo];
    }
    
    let count = 0;
    const limit = filters?.limit || 100;
    const offset = filters?.offset || 0;
    
    for await (const entry of kv.list<Customer>({ prefix })) {
      if (count < offset) {
        count++;
        continue;
      }
      
      if (customers.length >= limit) {
        break;
      }
      
      const customer = entry.value;
      
      // Apply additional filters
      if (filters?.status && customer.status !== filters.status) {
        continue;
      }
      
      if (filters?.industry && customer.industry !== filters.industry) {
        continue;
      }
      
      // Only include direct customer entries, not the index entries
      if (entry.key.length === 2 || (entry.key.length === 4 && entry.key[0] === "customers")) {
        customers.push(customer);
      }
      
      count++;
    }
    
    return customers;
  }
  
  static async search(query: string): Promise<Customer[]> {
    const customers: Customer[] = [];
    const searchTerm = query.toLowerCase();
    
    for await (const entry of kv.list<Customer>({ prefix: ["customers"] })) {
      // Only search direct customer entries
      if (entry.key.length !== 2) continue;
      
      const customer = entry.value;
      
      if (
        customer.companyName.toLowerCase().includes(searchTerm) ||
        customer.contactName.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm) ||
        customer.phone.includes(searchTerm)
      ) {
        customers.push(customer);
      }
    }
    
    return customers;
  }
  
  static async getStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    prospects: number;
    byIndustry: Record<string, number>;
    bySalesperson: Record<string, number>;
  }> {
    const stats = {
      total: 0,
      active: 0,
      inactive: 0,
      prospects: 0,
      byIndustry: {} as Record<string, number>,
      bySalesperson: {} as Record<string, number>,
    };
    
    for await (const entry of kv.list<Customer>({ prefix: ["customers"] })) {
      // Only count direct customer entries
      if (entry.key.length !== 2) continue;
      
      const customer = entry.value;
      stats.total++;
      
      // Count by status
      if (customer.status === "active") stats.active++;
      else if (customer.status === "inactive") stats.inactive++;
      else if (customer.status === "prospect") stats.prospects++;
      
      // Count by industry
      stats.byIndustry[customer.industry] = (stats.byIndustry[customer.industry] || 0) + 1;
      
      // Count by salesperson
      stats.bySalesperson[customer.assignedSalesperson] = (stats.bySalesperson[customer.assignedSalesperson] || 0) + 1;
    }
    
    return stats;
  }
}