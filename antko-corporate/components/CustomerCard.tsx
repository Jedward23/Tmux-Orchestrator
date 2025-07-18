import { JSX } from "preact";
import { Customer } from "../lib/types.ts";
import { Button } from "./Button.tsx";

interface CustomerCardProps {
  customer: Customer;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customerId: string) => void;
  onViewDetails?: (customerId: string) => void;
}

export function CustomerCard({ customer, onEdit, onDelete, onViewDetails }: CustomerCardProps) {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    prospect: "bg-blue-100 text-blue-800"
  };

  const companySizeLabels = {
    "1-10": "Small",
    "11-50": "Medium",
    "51-200": "Large",
    "201-500": "Enterprise",
    "500+": "Corporation"
  };

  return (
    <div class="bg-white rounded-xl shadow-antko p-6 hover:shadow-lg transition-shadow">
      <div class="flex justify-between items-start mb-4">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-slate-900 mb-1">
            {customer.companyName}
          </h3>
          <p class="text-sm text-slate-600">{customer.contactName}</p>
        </div>
        <span class={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[customer.status]}`}>
          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
        </span>
      </div>

      <div class="space-y-2 mb-4">
        <div class="flex items-center text-sm text-slate-600">
          <span class="w-4 h-4 mr-2">📧</span>
          <a href={`mailto:${customer.email}`} class="hover:text-antko-blue-600">
            {customer.email}
          </a>
        </div>
        <div class="flex items-center text-sm text-slate-600">
          <span class="w-4 h-4 mr-2">📞</span>
          <a href={`tel:${customer.phone}`} class="hover:text-antko-blue-600">
            {customer.phone}
          </a>
        </div>
        <div class="flex items-center text-sm text-slate-600">
          <span class="w-4 h-4 mr-2">📍</span>
          <span>{customer.city}, {customer.state}</span>
        </div>
        <div class="flex items-center text-sm text-slate-600">
          <span class="w-4 h-4 mr-2">🏢</span>
          <span>{customer.industry} • {companySizeLabels[customer.companySize]}</span>
        </div>
      </div>

      <div class="flex items-center justify-between pt-4 border-t border-slate-200">
        <div class="text-xs text-slate-500">
          Assigned to: {customer.assignedSalesperson}
        </div>
        <div class="flex space-x-2">
          {onViewDetails && (
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => onViewDetails(customer.id)}
            >
              View
            </Button>
          )}
          {onEdit && (
            <Button 
              size="sm" 
              variant="primary" 
              onClick={() => onEdit(customer)}
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button 
              size="sm" 
              variant="danger" 
              onClick={() => onDelete(customer.id)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface CustomerListProps {
  customers: Customer[];
  onEdit?: (customer: Customer) => void;
  onDelete?: (customerId: string) => void;
  onViewDetails?: (customerId: string) => void;
}

export function CustomerList({ customers, onEdit, onDelete, onViewDetails }: CustomerListProps) {
  if (customers.length === 0) {
    return (
      <div class="text-center py-12">
        <div class="text-6xl mb-4">👥</div>
        <h3 class="text-xl font-semibold text-slate-900 mb-2">No customers found</h3>
        <p class="text-slate-600 mb-6">Get started by adding your first customer</p>
        <Button href="/admin/customers/new">Add Customer</Button>
      </div>
    );
  }

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {customers.map((customer) => (
        <CustomerCard
          key={customer.id}
          customer={customer}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}