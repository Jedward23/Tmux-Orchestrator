import { Handlers, PageProps } from "$fresh/server.ts";
import { CRMLayout } from "../../components/CRMLayout.tsx";
import { CustomerList } from "../../components/CustomerCard.tsx";
import { Customer } from "../../lib/types.ts";

interface Data {
  isAuthenticated: boolean;
  customers: Customer[];
}

export const handler: Handlers<Data> = {
  GET(req, ctx) {
    const cookies = req.headers.get("Cookie") || "";
    const isAuthenticated = cookies.includes("auth=authenticated");
    
    if (!isAuthenticated) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/admin" }
      });
    }
    
    // Mock customer data - in production, this would come from PostgreSQL
    const customers: Customer[] = [
      {
        id: "1",
        companyName: "Agua Limpia Corp",
        contactName: "Maria González",
        email: "maria@agualimp.com",
        phone: "+1-555-0123",
        address: "123 Industrial Ave",
        city: "San Juan",
        state: "PR",
        zipCode: "00901",
        country: "Puerto Rico",
        website: "https://agualimp.com",
        industry: "Water Treatment",
        companySize: "51-200",
        status: "active",
        assignedSalesperson: "Carlos Mendez",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-20")
      },
      {
        id: "2",
        companyName: "Industrial Filtros SA",
        contactName: "José Rivera",
        email: "jose@indusfiltros.com",
        phone: "+1-555-0124",
        address: "456 Manufacturing Blvd",
        city: "Bayamón",
        state: "PR",
        zipCode: "00961",
        country: "Puerto Rico",
        website: "https://indusfiltros.com",
        industry: "Manufacturing",
        companySize: "201-500",
        status: "active",
        assignedSalesperson: "Ana Rodríguez",
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-18")
      },
      {
        id: "3",
        companyName: "Eco Solutions Inc",
        contactName: "Patricia Morales",
        email: "patricia@ecosolutions.com",
        phone: "+1-555-0125",
        address: "789 Green Technology Park",
        city: "Ponce",
        state: "PR",
        zipCode: "00717",
        country: "Puerto Rico",
        website: "https://ecosolutions.com",
        industry: "Environmental",
        companySize: "11-50",
        status: "prospect",
        assignedSalesperson: "Luis Fernández",
        createdAt: new Date("2024-01-12"),
        updatedAt: new Date("2024-01-19")
      }
    ];
    
    return ctx.render({ isAuthenticated, customers });
  }
};

export default function CustomersPage({ data }: PageProps<Data>) {
  const handleEdit = (customer: Customer) => {
    // TODO: Implement edit functionality
    console.log("Edit customer:", customer.id);
  };

  const handleDelete = (customerId: string) => {
    // TODO: Implement delete functionality
    console.log("Delete customer:", customerId);
  };

  const handleViewDetails = (customerId: string) => {
    // TODO: Navigate to customer details page
    console.log("View customer details:", customerId);
  };

  return (
    <CRMLayout 
      title="Customer Management - ANTKO Corporate" 
      currentPath="/admin/customers"
      userRole="admin"
      userName="Admin User"
    >
      <div>
        <div class="mb-8">
          <h1 class="text-3xl font-bold font-display text-slate-900 mb-2">
            Customer Management
          </h1>
          <p class="text-lg text-slate-600">
            Manage customer profiles and contact information
          </p>
        </div>

        {/* Stats Overview */}
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-600 mb-1">Total Customers</p>
                <p class="text-2xl font-bold text-slate-900">{data.customers.length}</p>
              </div>
              <div class="text-3xl">👥</div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-600 mb-1">Active Customers</p>
                <p class="text-2xl font-bold text-green-600">
                  {data.customers.filter(c => c.status === "active").length}
                </p>
              </div>
              <div class="text-3xl">✅</div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-600 mb-1">Prospects</p>
                <p class="text-2xl font-bold text-blue-600">
                  {data.customers.filter(c => c.status === "prospect").length}
                </p>
              </div>
              <div class="text-3xl">🎯</div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-600 mb-1">This Month</p>
                <p class="text-2xl font-bold text-purple-600">
                  {data.customers.filter(c => 
                    new Date(c.createdAt).getMonth() === new Date().getMonth()
                  ).length}
                </p>
              </div>
              <div class="text-3xl">📅</div>
            </div>
          </div>
        </div>

        {/* Customer List */}
        <CustomerList
          customers={data.customers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
        />
      </div>
    </CRMLayout>
  );
}