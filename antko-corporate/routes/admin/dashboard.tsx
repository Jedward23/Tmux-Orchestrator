import { Handlers, PageProps } from "$fresh/server.ts";
import { CRMLayout } from "../../components/CRMLayout.tsx";
import { CRMDashboard } from "../../components/CRMDashboard.tsx";
import { DashboardMetrics } from "../../lib/types.ts";

interface Data {
  isAuthenticated: boolean;
  metrics: DashboardMetrics;
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
    
    // Mock metrics data - in production, this would come from your CRM database
    const metrics: DashboardMetrics = {
      totalCustomers: 124,
      totalLeads: 67,
      totalOpportunities: 34,
      pipelineValue: 1250000,
      monthlyRevenue: 185000,
      conversionRate: 24.5,
      avgDealSize: 36800,
      salesVelocity: 45
    };
    
    return ctx.render({ isAuthenticated, metrics });
  }
};

export default function CRMDashboardPage({ data }: PageProps<Data>) {
  return (
    <CRMLayout 
      title="CRM Dashboard - ANTKO Corporate" 
      currentPath="/admin/dashboard"
      userRole="admin"
      userName="Admin User"
    >
      <div>
        <div class="mb-8">
          <h1 class="text-3xl font-bold font-display text-slate-900 mb-2">
            CRM Dashboard
          </h1>
          <p class="text-lg text-slate-600">
            Manage customers, leads, and sales opportunities for ANTKO Corporate
          </p>
        </div>

        <CRMDashboard metrics={data.metrics} />
      </div>
    </CRMLayout>
  );
}