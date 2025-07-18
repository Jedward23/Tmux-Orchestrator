import { JSX } from "preact";
import { Card } from "./Card.tsx";
import { DashboardMetrics } from "../lib/types.ts";

interface CRMDashboardProps {
  metrics: DashboardMetrics;
}

export function CRMDashboard({ metrics }: CRMDashboardProps) {
  return (
    <div class="space-y-8">
      {/* Key Metrics Section */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Customers"
          value={metrics.totalCustomers}
          icon="👥"
          change="+12%"
          trend="up"
        />
        <MetricCard
          title="Active Leads"
          value={metrics.totalLeads}
          icon="🎯"
          change="+8%"
          trend="up"
        />
        <MetricCard
          title="Pipeline Value"
          value={`$${(metrics.pipelineValue / 1000).toFixed(0)}K`}
          icon="💰"
          change="+15%"
          trend="up"
        />
        <MetricCard
          title="Monthly Revenue"
          value={`$${(metrics.monthlyRevenue / 1000).toFixed(0)}K`}
          icon="📈"
          change="+5%"
          trend="up"
        />
      </div>

      {/* Sales Performance Section */}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-antko p-6">
            <h3 class="text-lg font-semibold text-slate-900 mb-4">
              Sales Pipeline
            </h3>
            <SalesPipeline />
          </div>
        </div>
        
        <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-antko p-6">
            <h3 class="text-lg font-semibold text-slate-900 mb-4">
              Conversion Rate
            </h3>
            <div class="text-center">
              <div class="text-3xl font-bold text-antko-blue-600">
                {metrics.conversionRate}%
              </div>
              <div class="text-sm text-slate-500">Lead to Customer</div>
            </div>
          </div>
          
          <div class="bg-white rounded-xl shadow-antko p-6">
            <h3 class="text-lg font-semibold text-slate-900 mb-4">
              Avg Deal Size
            </h3>
            <div class="text-center">
              <div class="text-3xl font-bold text-antko-green-600">
                ${(metrics.avgDealSize / 1000).toFixed(1)}K
              </div>
              <div class="text-sm text-slate-500">Per Opportunity</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          title="Customer Management"
          description="Manage customer profiles, contact information, and interaction history"
          href="/admin/customers"
          brand="blue"
        />
        <Card
          title="Lead Management"
          description="Track and nurture leads through the sales funnel"
          href="/admin/leads"
          brand="green"
        />
        <Card
          title="Sales Pipeline"
          description="View and manage sales opportunities and deals"
          href="/admin/opportunities"
          brand="purple"
        />
        <Card
          title="Activities"
          description="Schedule and track sales activities, calls, and meetings"
          href="/admin/activities"
          brand="blue"
        />
        <Card
          title="Reports"
          description="Generate sales reports and analytics"
          href="/admin/reports"
          brand="green"
        />
        <Card
          title="Settings"
          description="Configure CRM settings and user management"
          href="/admin/settings"
          brand="purple"
        />
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: string;
  change: string;
  trend: "up" | "down" | "neutral";
}

function MetricCard({ title, value, icon, change, trend }: MetricCardProps) {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-slate-600"
  };

  return (
    <div class="bg-white rounded-xl shadow-antko p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-slate-600 mb-1">{title}</p>
          <p class="text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div class="text-3xl">{icon}</div>
      </div>
      <div class="flex items-center mt-4">
        <span class={`text-sm font-medium ${trendColors[trend]}`}>
          {change}
        </span>
        <span class="text-sm text-slate-500 ml-2">vs last month</span>
      </div>
    </div>
  );
}

function SalesPipeline() {
  const stages = [
    { name: "Prospecting", count: 24, value: 120000 },
    { name: "Qualification", count: 18, value: 90000 },
    { name: "Proposal", count: 12, value: 60000 },
    { name: "Negotiation", count: 8, value: 40000 },
    { name: "Closed Won", count: 5, value: 25000 }
  ];

  return (
    <div class="space-y-4">
      {stages.map((stage, index) => (
        <div key={stage.name} class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
          <div class="flex items-center space-x-4">
            <div class="w-8 h-8 bg-antko-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              {index + 1}
            </div>
            <div>
              <h4 class="font-medium text-slate-900">{stage.name}</h4>
              <p class="text-sm text-slate-600">{stage.count} opportunities</p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-lg font-semibold text-slate-900">
              ${(stage.value / 1000).toFixed(0)}K
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}