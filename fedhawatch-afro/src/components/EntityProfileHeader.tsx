import { Entity, formatKES, formatGap, resolvePartyName } from "@/lib/data";
import { RiskBadge } from "./RiskBadge";
import { MapPin, Building2, FileText } from "lucide-react";

interface EntityProfileHeaderProps {
  entity: Entity;
  allEntities: Entity[];
}

export function EntityProfileHeader({ entity, allEntities }: EntityProfileHeaderProps) {
  const partyName = resolvePartyName(entity, allEntities);
  const isNotFiled = entity.reporting_status === "NOT_FILED";
  const isInsufficient = entity.risk_level === "INSUFFICIENT_DATA";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">{entity.display_name}</h1>
          <RiskBadge level={entity.risk_level} className="text-sm" />
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="capitalize flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5" />
            {entity.entity_type}
          </span>
          {entity.entity_type === "candidate" && partyName && (
            <span>Party: {partyName}</span>
          )}
          {entity.county && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {[entity.county, entity.constituency, entity.ward].filter(Boolean).join(" • ")}
            </span>
          )}
          <span className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            {entity.reporting_status === "FILED" ? "Disclosure Filed" : "No Disclosure Filed"}
          </span>
        </div>
        {isInsufficient && (
          <p className="mt-3 text-sm bg-muted rounded-md px-3 py-2 text-muted-foreground">
            ⚠ Not enough observations yet to determine a definitive risk level.
          </p>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Reported Spend" value={isNotFiled ? "No Disclosure Filed" : formatKES(entity.reported_spend_kes)} />
        <StatCard label="Shadow Spend" value={formatKES(entity.shadow_spend_kes)} />
        <StatCard
          label="Gap %"
          value={isNotFiled ? "N/A" : formatGap(entity.gap_percent)}
        />
        <StatCard
          label="Reporting Status"
          value={entity.reporting_status === "FILED" ? "Filed" : "Not Filed"}
          highlight={entity.reporting_status === "NOT_FILED"}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-card border rounded-lg p-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-lg font-bold font-display ${highlight ? "text-risk-red" : "text-card-foreground"}`}>
        {value}
      </p>
    </div>
  );
}
