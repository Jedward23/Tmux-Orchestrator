import { JSX } from "preact";
import { Opportunity } from "../lib/types.ts";
import { Button } from "./Button.tsx";

interface SalesPipelineBoardProps {
  opportunities: Opportunity[];
  onEdit?: (opportunity: Opportunity) => void;
  onDelete?: (opportunityId: string) => void;
  onViewDetails?: (opportunityId: string) => void;
  onStageChange?: (opportunityId: string, newStage: string) => void;
}

export function SalesPipelineBoard({ 
  opportunities, 
  onEdit, 
  onDelete, 
  onViewDetails, 
  onStageChange 
}: SalesPipelineBoardProps) {
  const stages = [
    { id: "prospecting", name: "Prospecting", color: "bg-blue-100 text-blue-800" },
    { id: "qualification", name: "Qualification", color: "bg-yellow-100 text-yellow-800" },
    { id: "proposal", name: "Proposal", color: "bg-purple-100 text-purple-800" },
    { id: "negotiation", name: "Negotiation", color: "bg-orange-100 text-orange-800" },
    { id: "closed-won", name: "Closed Won", color: "bg-green-100 text-green-800" },
    { id: "closed-lost", name: "Closed Lost", color: "bg-red-100 text-red-800" }
  ];

  const getOpportunitiesByStage = (stage: string) => {
    return opportunities.filter(opp => opp.stage === stage);
  };

  const getStageTotal = (stage: string) => {
    return getOpportunitiesByStage(stage).reduce((sum, opp) => sum + opp.amount, 0);
  };

  return (
    <div class="bg-white rounded-xl shadow-antko p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-slate-900">Sales Pipeline</h2>
        <Button href="/admin/opportunities/new">Add Opportunity</Button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-6 gap-4">
        {stages.map((stage) => {
          const stageOpportunities = getOpportunitiesByStage(stage.id);
          const stageTotal = getStageTotal(stage.id);
          
          return (
            <div key={stage.id} class="bg-slate-50 rounded-lg p-4">
              <div class="flex justify-between items-center mb-3">
                <h3 class="font-semibold text-slate-900 text-sm">{stage.name}</h3>
                <span class={`px-2 py-1 rounded-full text-xs font-medium ${stage.color}`}>
                  {stageOpportunities.length}
                </span>
              </div>
              
              <div class="text-xs text-slate-600 mb-4">
                Total: ${(stageTotal / 1000).toFixed(0)}K
              </div>

              <div class="space-y-3">
                {stageOpportunities.map((opportunity) => (
                  <OpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onViewDetails={onViewDetails}
                    onStageChange={onStageChange}
                    stages={stages}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface OpportunityCardProps {
  opportunity: Opportunity;
  onEdit?: (opportunity: Opportunity) => void;
  onDelete?: (opportunityId: string) => void;
  onViewDetails?: (opportunityId: string) => void;
  onStageChange?: (opportunityId: string, newStage: string) => void;
  stages: Array<{ id: string; name: string; color: string }>;
}

function OpportunityCard({ 
  opportunity, 
  onEdit, 
  onDelete, 
  onViewDetails, 
  onStageChange,
  stages 
}: OpportunityCardProps) {
  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return "bg-green-500";
    if (probability >= 60) return "bg-yellow-500";
    if (probability >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div class="bg-white rounded-lg p-3 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div class="flex justify-between items-start mb-2">
        <h4 class="font-medium text-slate-900 text-sm line-clamp-2">
          {opportunity.title}
        </h4>
        <div class="flex items-center space-x-1">
          <div class={`w-2 h-2 rounded-full ${getProbabilityColor(opportunity.probability)}`}></div>
          <span class="text-xs text-slate-500">{opportunity.probability}%</span>
        </div>
      </div>

      <div class="text-lg font-bold text-slate-900 mb-2">
        ${(opportunity.amount / 1000).toFixed(0)}K
      </div>

      <div class="text-xs text-slate-500 mb-3">
        Close: {formatDate(opportunity.expectedCloseDate)}
      </div>

      <div class="flex justify-between items-center">
        <div class="text-xs text-slate-500 truncate">
          {opportunity.assignedTo}
        </div>
        <div class="flex space-x-1">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(opportunity.id)}
              class="text-antko-blue-600 hover:text-antko-blue-800 text-xs"
            >
              View
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(opportunity)}
              class="text-antko-green-600 hover:text-antko-green-800 text-xs"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {onStageChange && (
        <div class="mt-3 pt-3 border-t border-slate-200">
          <select
            value={opportunity.stage}
            onChange={(e) => onStageChange(opportunity.id, e.currentTarget.value)}
            class="w-full text-xs border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-antko-blue-500"
          >
            {stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}