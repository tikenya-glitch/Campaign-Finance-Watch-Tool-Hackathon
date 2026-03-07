import { Entity, formatKES } from "@/lib/data";
import { Users, Building2, DollarSign, AlertTriangle, ShieldAlert, FileQuestion } from "lucide-react";

interface SummaryCardsProps {
  entities: Entity[];
}

export function SummaryCards({ entities }: SummaryCardsProps) {
  const totalEntities = entities.length;
  const totalCandidates = entities.filter((e) => e.entity_type === "candidate").length;
  const totalParties = entities.filter((e) => e.entity_type === "party").length;
  const totalShadowSpend = entities.reduce((sum, e) => sum + e.shadow_spend_kes, 0);
  const flaggedEntities = entities.filter((e) => e.risk_level === "RED" || e.risk_level === "YELLOW" || e.risk_level === "USI").length;
  const usiCases = entities.filter((e) => e.risk_level === "USI").length;

  const cards = [
    { label: "Total Entities", value: totalEntities.toString(), icon: Users, color: "text-primary" },
    { label: "Candidates", value: totalCandidates.toString(), icon: Users, color: "text-primary" },
    { label: "Parties", value: totalParties.toString(), icon: Building2, color: "text-primary" },
    { label: "Total Shadow Spend", value: formatKES(totalShadowSpend), icon: DollarSign, color: "text-risk-red" },
    { label: "Flagged Entities", value: flaggedEntities.toString(), icon: AlertTriangle, color: "text-risk-yellow" },
    { label: "USI Cases", value: usiCases.toString(), icon: ShieldAlert, color: "text-risk-usi" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-card border rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <card.icon className={`h-4 w-4 ${card.color}`} />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{card.label}</span>
          </div>
          <p className="text-xl font-bold font-display text-card-foreground">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
