import { JSX } from "preact";
import { Lead } from "../lib/types.ts";
import { Button } from "./Button.tsx";

interface LeadCardProps {
  lead: Lead;
  onEdit?: (lead: Lead) => void;
  onDelete?: (leadId: string) => void;
  onConvert?: (leadId: string) => void;
  onViewDetails?: (leadId: string) => void;
}

export function LeadCard({ lead, onEdit, onDelete, onConvert, onViewDetails }: LeadCardProps) {
  const statusColors = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-yellow-100 text-yellow-800",
    qualified: "bg-green-100 text-green-800",
    nurturing: "bg-purple-100 text-purple-800",
    converted: "bg-emerald-100 text-emerald-800",
    lost: "bg-red-100 text-red-800"
  };

  const sourceIcons = {
    website: "🌐",
    referral: "👥",
    "cold-call": "📞",
    email: "📧",
    social: "📱",
    "trade-show": "🏢",
    other: "📌"
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    if (score >= 40) return "bg-orange-100";
    return "bg-red-100";
  };

  return (
    <div class="bg-white rounded-xl shadow-antko p-6 hover:shadow-lg transition-shadow">
      <div class="flex justify-between items-start mb-4">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-slate-900 mb-1">
            {lead.firstName} {lead.lastName}
          </h3>
          <p class="text-sm text-slate-600">{lead.jobTitle} at {lead.company}</p>
        </div>
        <div class="flex items-center space-x-2">
          <div class={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBg(lead.score)} ${getScoreColor(lead.score)}`}>
            {lead.score}
          </div>
          <span class={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
            {lead.status.replace("-", " ").charAt(0).toUpperCase() + lead.status.slice(1)}
          </span>
        </div>
      </div>

      <div class="space-y-2 mb-4">
        <div class="flex items-center text-sm text-slate-600">
          <span class="w-4 h-4 mr-2">📧</span>
          <a href={`mailto:${lead.email}`} class="hover:text-antko-blue-600">
            {lead.email}
          </a>
        </div>
        <div class="flex items-center text-sm text-slate-600">
          <span class="w-4 h-4 mr-2">📞</span>
          <a href={`tel:${lead.phone}`} class="hover:text-antko-blue-600">
            {lead.phone}
          </a>
        </div>
        <div class="flex items-center text-sm text-slate-600">
          <span class="w-4 h-4 mr-2">{sourceIcons[lead.source]}</span>
          <span>Source: {lead.source.replace("-", " ").charAt(0).toUpperCase() + lead.source.slice(1)}</span>
        </div>
      </div>

      {lead.notes && (
        <div class="mb-4 p-3 bg-slate-50 rounded-lg">
          <p class="text-sm text-slate-700 line-clamp-2">{lead.notes}</p>
        </div>
      )}

      <div class="flex items-center justify-between pt-4 border-t border-slate-200">
        <div class="text-xs text-slate-500">
          Assigned to: {lead.assignedTo}
        </div>
        <div class="flex space-x-2">
          {onViewDetails && (
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => onViewDetails(lead.id)}
            >
              View
            </Button>
          )}
          {onEdit && (
            <Button 
              size="sm" 
              variant="primary" 
              onClick={() => onEdit(lead)}
            >
              Edit
            </Button>
          )}
          {onConvert && lead.status === "qualified" && (
            <Button 
              size="sm" 
              variant="success" 
              onClick={() => onConvert(lead.id)}
            >
              Convert
            </Button>
          )}
          {onDelete && (
            <Button 
              size="sm" 
              variant="danger" 
              onClick={() => onDelete(lead.id)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface LeadListProps {
  leads: Lead[];
  onEdit?: (lead: Lead) => void;
  onDelete?: (leadId: string) => void;
  onConvert?: (leadId: string) => void;
  onViewDetails?: (leadId: string) => void;
}

export function LeadList({ leads, onEdit, onDelete, onConvert, onViewDetails }: LeadListProps) {
  if (leads.length === 0) {
    return (
      <div class="text-center py-12">
        <div class="text-6xl mb-4">🎯</div>
        <h3 class="text-xl font-semibold text-slate-900 mb-2">No leads found</h3>
        <p class="text-slate-600 mb-6">Start generating leads to grow your business</p>
        <Button href="/admin/leads/new">Add Lead</Button>
      </div>
    );
  }

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {leads.map((lead) => (
        <LeadCard
          key={lead.id}
          lead={lead}
          onEdit={onEdit}
          onDelete={onDelete}
          onConvert={onConvert}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}