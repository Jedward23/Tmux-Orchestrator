import { Handlers, PageProps } from "$fresh/server.ts";
import { CRMLayout } from "../../components/CRMLayout.tsx";
import { LeadManagementInterface } from "../../components/LeadManagementInterface.tsx";
import { Lead } from "../../lib/types.ts";

interface Data {
  isAuthenticated: boolean;
  leads: Lead[];
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
    
    // Mock lead data - in production, this would come from PostgreSQL
    const leads: Lead[] = [
      {
        id: "1",
        firstName: "Roberto",
        lastName: "Sánchez",
        email: "roberto@techsolutions.com",
        phone: "+1-555-0201",
        company: "Tech Solutions PR",
        jobTitle: "Operations Manager",
        source: "website",
        status: "new",
        score: 85,
        notes: "Interested in water filtration systems for office building",
        assignedTo: "Carlos Mendez",
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-20")
      },
      {
        id: "2",
        firstName: "Carmen",
        lastName: "Torres",
        email: "carmen@manufacturing.com",
        phone: "+1-555-0202",
        company: "Puerto Rico Manufacturing",
        jobTitle: "Plant Manager",
        source: "referral",
        status: "qualified",
        score: 92,
        notes: "Needs industrial water treatment solution for new facility",
        assignedTo: "Ana Rodríguez",
        createdAt: new Date("2024-01-18"),
        updatedAt: new Date("2024-01-21")
      },
      {
        id: "3",
        firstName: "Miguel",
        lastName: "Delgado",
        email: "miguel@hospitality.com",
        phone: "+1-555-0203",
        company: "Caribbean Hospitality Group",
        jobTitle: "Facility Director",
        source: "trade-show",
        status: "contacted",
        score: 78,
        notes: "Exploring water purification for hotel chain",
        assignedTo: "Luis Fernández",
        createdAt: new Date("2024-01-19"),
        updatedAt: new Date("2024-01-19")
      },
      {
        id: "4",
        firstName: "Isabella",
        lastName: "Vargas",
        email: "isabella@healthcare.com",
        phone: "+1-555-0204",
        company: "MedCenter San Juan",
        jobTitle: "Procurement Manager",
        source: "cold-call",
        status: "nurturing",
        score: 65,
        notes: "Budget planning for Q2, interested in medical-grade filtration",
        assignedTo: "Carlos Mendez",
        createdAt: new Date("2024-01-17"),
        updatedAt: new Date("2024-01-20")
      },
      {
        id: "5",
        firstName: "Fernando",
        lastName: "Castro",
        email: "fernando@construction.com",
        phone: "+1-555-0205",
        company: "Castro Construction",
        jobTitle: "Project Manager",
        source: "email",
        status: "converted",
        score: 95,
        notes: "Converted to customer - purchased complete system",
        assignedTo: "Ana Rodríguez",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-22")
      }
    ];
    
    return ctx.render({ isAuthenticated, leads });
  }
};

export default function LeadsPage({ data }: PageProps<Data>) {
  const handleEdit = (lead: Lead) => {
    console.log("Edit lead:", lead.id);
  };

  const handleDelete = (leadId: string) => {
    console.log("Delete lead:", leadId);
  };

  const handleConvert = (leadId: string) => {
    console.log("Convert lead:", leadId);
  };

  const handleViewDetails = (leadId: string) => {
    console.log("View lead details:", leadId);
  };

  const handleSearch = (query: string) => {
    console.log("Search leads:", query);
  };

  const handleFilter = (filters: any) => {
    console.log("Filter leads:", filters);
  };

  const handleSort = (column: string, direction: "asc" | "desc") => {
    console.log("Sort leads:", column, direction);
  };

  return (
    <CRMLayout 
      title="Lead Management - ANTKO Corporate" 
      currentPath="/admin/leads"
      userRole="admin"
      userName="Admin User"
    >
      <LeadManagementInterface
        leads={data.leads}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onConvert={handleConvert}
        onViewDetails={handleViewDetails}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
      />
    </CRMLayout>
  );
}