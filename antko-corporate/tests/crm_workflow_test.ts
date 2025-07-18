import { assertEquals, assertExists, assertNotEquals } from "$std/assert/mod.ts";
import { Customer, Lead, Opportunity, Activity, SalesUser } from "../lib/types.ts";

// Mock CRM Service - In real implementation, this would connect to actual CRM service
class MockCRMService {
  private customers: Customer[] = [];
  private leads: Lead[] = [];
  private opportunities: Opportunity[] = [];
  private activities: Activity[] = [];
  private salesUsers: SalesUser[] = [];

  // Customer Management
  createCustomer(customerData: Omit<Customer, "id" | "createdAt" | "updatedAt">): Customer {
    const customer: Customer = {
      id: crypto.randomUUID(),
      ...customerData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.customers.push(customer);
    return customer;
  }

  updateCustomer(id: string, updates: Partial<Customer>): Customer | null {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    this.customers[index] = { 
      ...this.customers[index], 
      ...updates, 
      updatedAt: new Date() 
    };
    return this.customers[index];
  }

  getCustomerById(id: string): Customer | null {
    return this.customers.find(c => c.id === id) || null;
  }

  getAllCustomers(): Customer[] {
    return this.customers;
  }

  deleteCustomer(id: string): boolean {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.customers.splice(index, 1);
    return true;
  }

  // Lead Management
  createLead(leadData: Omit<Lead, "id" | "createdAt" | "updatedAt">): Lead {
    const lead: Lead = {
      id: crypto.randomUUID(),
      ...leadData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.leads.push(lead);
    return lead;
  }

  updateLead(id: string, updates: Partial<Lead>): Lead | null {
    const index = this.leads.findIndex(l => l.id === id);
    if (index === -1) return null;
    
    this.leads[index] = { 
      ...this.leads[index], 
      ...updates, 
      updatedAt: new Date() 
    };
    return this.leads[index];
  }

  getLeadById(id: string): Lead | null {
    return this.leads.find(l => l.id === id) || null;
  }

  getAllLeads(): Lead[] {
    return this.leads;
  }

  convertLeadToCustomer(leadId: string): { customer: Customer; opportunity: Opportunity } | null {
    const lead = this.getLeadById(leadId);
    if (!lead) return null;

    const customer = this.createCustomer({
      companyName: lead.company,
      contactName: `${lead.firstName} ${lead.lastName}`,
      email: lead.email,
      phone: lead.phone,
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      industry: "",
      companySize: "1-10",
      status: "prospect",
      assignedSalesperson: lead.assignedTo
    });

    const opportunity = this.createOpportunity({
      title: `${lead.company} - New Opportunity`,
      customerId: customer.id,
      amount: 0,
      probability: 25,
      stage: "prospecting",
      products: [],
      expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      assignedTo: lead.assignedTo,
      description: `Converted from lead: ${lead.firstName} ${lead.lastName}`
    });

    // Update lead status
    this.updateLead(leadId, { status: "converted" });

    return { customer, opportunity };
  }

  // Opportunity Management
  createOpportunity(opportunityData: Omit<Opportunity, "id" | "createdAt" | "updatedAt">): Opportunity {
    const opportunity: Opportunity = {
      id: crypto.randomUUID(),
      ...opportunityData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.opportunities.push(opportunity);
    return opportunity;
  }

  updateOpportunity(id: string, updates: Partial<Opportunity>): Opportunity | null {
    const index = this.opportunities.findIndex(o => o.id === id);
    if (index === -1) return null;
    
    this.opportunities[index] = { 
      ...this.opportunities[index], 
      ...updates, 
      updatedAt: new Date() 
    };
    return this.opportunities[index];
  }

  getOpportunityById(id: string): Opportunity | null {
    return this.opportunities.find(o => o.id === id) || null;
  }

  getAllOpportunities(): Opportunity[] {
    return this.opportunities;
  }

  // Activity Management
  createActivity(activityData: Omit<Activity, "id" | "createdAt" | "updatedAt">): Activity {
    const activity: Activity = {
      id: crypto.randomUUID(),
      ...activityData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.activities.push(activity);
    return activity;
  }

  getActivitiesForEntity(entityType: "customer" | "lead" | "opportunity", entityId: string): Activity[] {
    return this.activities.filter(a => 
      a.relatedTo.type === entityType && a.relatedTo.id === entityId
    );
  }

  // Sales User Management
  createSalesUser(userData: Omit<SalesUser, "id" | "createdAt">): SalesUser {
    const user: SalesUser = {
      id: crypto.randomUUID(),
      ...userData,
      createdAt: new Date()
    };
    this.salesUsers.push(user);
    return user;
  }

  getSalesUserById(id: string): SalesUser | null {
    return this.salesUsers.find(u => u.id === id) || null;
  }

  getAllSalesUsers(): SalesUser[] {
    return this.salesUsers;
  }

  // Reset for testing
  reset(): void {
    this.customers = [];
    this.leads = [];
    this.opportunities = [];
    this.activities = [];
    this.salesUsers = [];
  }
}

const crmService = new MockCRMService();

// Test Setup
Deno.test("CRM Service - Setup", () => {
  crmService.reset();
  
  // Create test sales users
  const salesRep = crmService.createSalesUser({
    name: "Juan Pérez",
    email: "juan.perez@antko.com",
    role: "sales-rep",
    territory: "Norte",
    quota: 50000,
    active: true
  });

  const salesManager = crmService.createSalesUser({
    name: "María García",
    email: "maria.garcia@antko.com",
    role: "sales-manager",
    territory: "Nacional",
    quota: 200000,
    active: true
  });

  assertEquals(crmService.getAllSalesUsers().length, 2);
  assertEquals(salesRep.role, "sales-rep");
  assertEquals(salesManager.role, "sales-manager");
});

// Customer Management Tests
Deno.test("CRM Workflow - Customer Creation", () => {
  const customer = crmService.createCustomer({
    companyName: "Empresa Test S.A.",
    contactName: "Carlos Rodríguez",
    email: "carlos@empresatest.com",
    phone: "+34 600 123 456",
    address: "Calle Principal 123",
    city: "Madrid",
    state: "Madrid",
    zipCode: "28001",
    country: "España",
    website: "www.empresatest.com",
    industry: "Manufactura",
    companySize: "51-200",
    status: "prospect",
    assignedSalesperson: "sales-rep-1"
  });

  assertExists(customer.id);
  assertEquals(customer.companyName, "Empresa Test S.A.");
  assertEquals(customer.status, "prospect");
  assertEquals(customer.companySize, "51-200");
  assertExists(customer.createdAt);
  assertExists(customer.updatedAt);
});

Deno.test("CRM Workflow - Customer Update", () => {
  const customer = crmService.createCustomer({
    companyName: "Empresa Test S.A.",
    contactName: "Carlos Rodríguez",
    email: "carlos@empresatest.com",
    phone: "+34 600 123 456",
    address: "Calle Principal 123",
    city: "Madrid",
    state: "Madrid",
    zipCode: "28001",
    country: "España",
    industry: "Manufactura",
    companySize: "51-200",
    status: "prospect",
    assignedSalesperson: "sales-rep-1"
  });

  const originalUpdatedAt = customer.updatedAt;
  
  // Wait a bit to ensure different timestamp
  setTimeout(() => {
    const updatedCustomer = crmService.updateCustomer(customer.id, {
      status: "active",
      phone: "+34 600 987 654"
    });

    assertExists(updatedCustomer);
    assertEquals(updatedCustomer!.status, "active");
    assertEquals(updatedCustomer!.phone, "+34 600 987 654");
    assertNotEquals(updatedCustomer!.updatedAt, originalUpdatedAt);
  }, 10);
});

// Lead Management Tests
Deno.test("CRM Workflow - Lead Creation and Qualification", () => {
  const lead = crmService.createLead({
    firstName: "Ana",
    lastName: "Martínez",
    email: "ana.martinez@empresa.com",
    phone: "+34 600 111 222",
    company: "Empresa ABC",
    jobTitle: "Directora de Operaciones",
    source: "website",
    status: "new",
    score: 75,
    notes: "Interesada en sistema de filtración",
    assignedTo: "sales-rep-1"
  });

  assertExists(lead.id);
  assertEquals(lead.status, "new");
  assertEquals(lead.score, 75);
  assertEquals(lead.source, "website");

  // Qualify the lead
  const qualifiedLead = crmService.updateLead(lead.id, {
    status: "qualified",
    score: 85,
    notes: "Calificada - necesita propuesta técnica"
  });

  assertEquals(qualifiedLead!.status, "qualified");
  assertEquals(qualifiedLead!.score, 85);
});

Deno.test("CRM Workflow - Lead to Customer Conversion", () => {
  const lead = crmService.createLead({
    firstName: "Pedro",
    lastName: "López",
    email: "pedro.lopez@empresa.com",
    phone: "+34 600 333 444",
    company: "Empresa XYZ",
    jobTitle: "Gerente de Planta",
    source: "referral",
    status: "qualified",
    score: 90,
    notes: "Listo para conversión",
    assignedTo: "sales-rep-1"
  });

  const conversion = crmService.convertLeadToCustomer(lead.id);
  assertExists(conversion);
  
  const { customer, opportunity } = conversion!;
  
  // Verify customer creation
  assertEquals(customer.companyName, "Empresa XYZ");
  assertEquals(customer.contactName, "Pedro López");
  assertEquals(customer.email, "pedro.lopez@empresa.com");
  assertEquals(customer.status, "prospect");

  // Verify opportunity creation
  assertEquals(opportunity.customerId, customer.id);
  assertEquals(opportunity.stage, "prospecting");
  assertEquals(opportunity.probability, 25);
  assertEquals(opportunity.assignedTo, "sales-rep-1");

  // Verify lead status update
  const updatedLead = crmService.getLeadById(lead.id);
  assertEquals(updatedLead!.status, "converted");
});

// Opportunity Management Tests
Deno.test("CRM Workflow - Opportunity Progression", () => {
  // Create customer first
  const customer = crmService.createCustomer({
    companyName: "Empresa ABC",
    contactName: "Laura Sánchez",
    email: "laura@empresaabc.com",
    phone: "+34 600 555 666",
    address: "Calle Comercial 456",
    city: "Barcelona",
    state: "Barcelona",
    zipCode: "08001",
    country: "España",
    industry: "Alimentaria",
    companySize: "201-500",
    status: "prospect",
    assignedSalesperson: "sales-rep-1"
  });

  // Create opportunity
  const opportunity = crmService.createOpportunity({
    title: "Sistema de Filtración Industrial",
    customerId: customer.id,
    amount: 25000,
    probability: 30,
    stage: "prospecting",
    products: ["product-1", "product-2"],
    expectedCloseDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    assignedTo: "sales-rep-1",
    description: "Oportunidad para sistema completo de filtración"
  });

  assertEquals(opportunity.stage, "prospecting");
  assertEquals(opportunity.probability, 30);
  assertEquals(opportunity.amount, 25000);

  // Progress through stages
  const qualifiedOpp = crmService.updateOpportunity(opportunity.id, {
    stage: "qualification",
    probability: 50,
    amount: 28000
  });

  assertEquals(qualifiedOpp!.stage, "qualification");
  assertEquals(qualifiedOpp!.probability, 50);
  assertEquals(qualifiedOpp!.amount, 28000);

  const proposalOpp = crmService.updateOpportunity(opportunity.id, {
    stage: "proposal",
    probability: 75,
    amount: 30000
  });

  assertEquals(proposalOpp!.stage, "proposal");
  assertEquals(proposalOpp!.probability, 75);
});

// Activity Management Tests
Deno.test("CRM Workflow - Activity Tracking", () => {
  const customer = crmService.createCustomer({
    companyName: "Empresa DEF",
    contactName: "Roberto Fernández",
    email: "roberto@empresadef.com",
    phone: "+34 600 777 888",
    address: "Avenida Industrial 789",
    city: "Valencia",
    state: "Valencia",
    zipCode: "46001",
    country: "España",
    industry: "Química",
    companySize: "500+",
    status: "active",
    assignedSalesperson: "sales-rep-1"
  });

  // Create activities
  const callActivity = crmService.createActivity({
    type: "call",
    subject: "Llamada de seguimiento",
    description: "Discusión sobre requisitos técnicos",
    relatedTo: { type: "customer", id: customer.id },
    assignedTo: "sales-rep-1",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    completed: false
  });

  const emailActivity = crmService.createActivity({
    type: "email",
    subject: "Envío de propuesta técnica",
    description: "Propuesta detallada para sistema de filtración",
    relatedTo: { type: "customer", id: customer.id },
    assignedTo: "sales-rep-1",
    completed: true
  });

  const meetingActivity = crmService.createActivity({
    type: "meeting",
    subject: "Reunión en sitio",
    description: "Evaluación técnica en las instalaciones del cliente",
    relatedTo: { type: "customer", id: customer.id },
    assignedTo: "sales-rep-1",
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    completed: false
  });

  // Test activity retrieval
  const customerActivities = crmService.getActivitiesForEntity("customer", customer.id);
  assertEquals(customerActivities.length, 3);

  const completedActivities = customerActivities.filter(a => a.completed);
  assertEquals(completedActivities.length, 1);
  assertEquals(completedActivities[0].type, "email");

  const pendingActivities = customerActivities.filter(a => !a.completed);
  assertEquals(pendingActivities.length, 2);
});

// Data Integrity Tests
Deno.test("CRM Data Integrity - Customer-Opportunity Relationship", () => {
  const customer = crmService.createCustomer({
    companyName: "Empresa GHI",
    contactName: "Isabel Moreno",
    email: "isabel@empresaghi.com",
    phone: "+34 600 999 000",
    address: "Plaza Central 123",
    city: "Sevilla",
    state: "Sevilla",
    zipCode: "41001",
    country: "España",
    industry: "Construcción",
    companySize: "11-50",
    status: "prospect",
    assignedSalesperson: "sales-rep-1"
  });

  const opportunity = crmService.createOpportunity({
    title: "Proyecto de Construcción",
    customerId: customer.id,
    amount: 15000,
    probability: 40,
    stage: "prospecting",
    products: ["product-3"],
    expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    assignedTo: "sales-rep-1",
    description: "Oportunidad para proyecto de construcción"
  });

  // Verify relationship integrity
  assertEquals(opportunity.customerId, customer.id);
  
  const relatedCustomer = crmService.getCustomerById(opportunity.customerId);
  assertExists(relatedCustomer);
  assertEquals(relatedCustomer!.companyName, "Empresa GHI");
});

// Sales Pipeline Tests
Deno.test("CRM Sales Pipeline - Complete Flow", () => {
  // 1. Lead Generation
  const lead = crmService.createLead({
    firstName: "Miguel",
    lastName: "Ruiz",
    email: "miguel.ruiz@empresa.com",
    phone: "+34 600 111 333",
    company: "Empresa Pipeline",
    jobTitle: "Director Técnico",
    source: "trade-show",
    status: "new",
    score: 60,
    notes: "Contactado en feria comercial",
    assignedTo: "sales-rep-1"
  });

  // 2. Lead Qualification
  const qualifiedLead = crmService.updateLead(lead.id, {
    status: "qualified",
    score: 80,
    notes: "Calificado - presupuesto confirmado"
  });

  assertEquals(qualifiedLead!.status, "qualified");
  assertEquals(qualifiedLead!.score, 80);

  // 3. Lead to Customer Conversion
  const conversion = crmService.convertLeadToCustomer(lead.id);
  assertExists(conversion);
  
  const { customer, opportunity } = conversion!;

  // 4. Opportunity Development
  const developedOpp = crmService.updateOpportunity(opportunity.id, {
    stage: "qualification",
    probability: 60,
    amount: 20000,
    description: "Oportunidad desarrollada con requisitos claros"
  });

  assertEquals(developedOpp!.stage, "qualification");
  assertEquals(developedOpp!.probability, 60);

  // 5. Activity Tracking
  const activity = crmService.createActivity({
    type: "meeting",
    subject: "Presentación de propuesta",
    description: "Presentación técnica y comercial",
    relatedTo: { type: "opportunity", id: opportunity.id },
    assignedTo: "sales-rep-1",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    completed: false
  });

  assertExists(activity.id);
  assertEquals(activity.relatedTo.type, "opportunity");
  assertEquals(activity.relatedTo.id, opportunity.id);

  // 6. Opportunity Closure
  const closedOpp = crmService.updateOpportunity(opportunity.id, {
    stage: "closed-won",
    probability: 100,
    amount: 22000
  });

  assertEquals(closedOpp!.stage, "closed-won");
  assertEquals(closedOpp!.probability, 100);

  // 7. Customer Status Update
  const activeCustomer = crmService.updateCustomer(customer.id, {
    status: "active"
  });

  assertEquals(activeCustomer!.status, "active");
});

// Error Handling Tests
Deno.test("CRM Error Handling - Invalid Operations", () => {
  // Test invalid customer update
  const invalidCustomerUpdate = crmService.updateCustomer("invalid-id", {
    companyName: "Test"
  });
  assertEquals(invalidCustomerUpdate, null);

  // Test invalid lead update
  const invalidLeadUpdate = crmService.updateLead("invalid-id", {
    status: "qualified"
  });
  assertEquals(invalidLeadUpdate, null);

  // Test invalid opportunity update
  const invalidOpportunityUpdate = crmService.updateOpportunity("invalid-id", {
    stage: "closed-won"
  });
  assertEquals(invalidOpportunityUpdate, null);

  // Test invalid customer deletion
  const invalidDeletion = crmService.deleteCustomer("invalid-id");
  assertEquals(invalidDeletion, false);
});

// Search and Filter Tests
Deno.test("CRM Search and Filter - Customer Management", () => {
  // Create test customers
  const customer1 = crmService.createCustomer({
    companyName: "Filtración Madrid S.L.",
    contactName: "Elena Ruiz",
    email: "elena@filtracionmadrid.com",
    phone: "+34 600 111 222",
    address: "Calle Filtros 123",
    city: "Madrid",
    state: "Madrid",
    zipCode: "28001",
    country: "España",
    industry: "Tratamiento de Agua",
    companySize: "11-50",
    status: "active",
    assignedSalesperson: "sales-rep-1"
  });

  const customer2 = crmService.createCustomer({
    companyName: "Sistemas Barcelona S.A.",
    contactName: "Francisco López",
    email: "francisco@sistemasbarcelona.com",
    phone: "+34 600 333 444",
    address: "Avenida Sistemas 456",
    city: "Barcelona",
    state: "Barcelona",
    zipCode: "08001",
    country: "España",
    industry: "Manufactura",
    companySize: "201-500",
    status: "prospect",
    assignedSalesperson: "sales-rep-1"
  });

  // Test filtering by status
  const allCustomers = crmService.getAllCustomers();
  const activeCustomers = allCustomers.filter(c => c.status === "active");
  const prospectCustomers = allCustomers.filter(c => c.status === "prospect");

  assertEquals(activeCustomers.length >= 1, true);
  assertEquals(prospectCustomers.length >= 1, true);

  // Test filtering by city
  const madridCustomers = allCustomers.filter(c => c.city === "Madrid");
  const barcelonaCustomers = allCustomers.filter(c => c.city === "Barcelona");

  assertEquals(madridCustomers.length >= 1, true);
  assertEquals(barcelonaCustomers.length >= 1, true);

  // Test filtering by industry
  const waterTreatmentCustomers = allCustomers.filter(c => c.industry === "Tratamiento de Agua");
  assertEquals(waterTreatmentCustomers.length >= 1, true);
});