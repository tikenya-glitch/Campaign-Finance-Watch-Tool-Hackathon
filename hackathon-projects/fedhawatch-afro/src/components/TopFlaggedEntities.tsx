import { Entity, formatGap, riskSeverity } from "@/lib/data";
import { RiskBadge } from "./RiskBadge";
import { Link } from "react-router-dom";

interface TopFlaggedEntitiesProps {
  entities: Entity[];
}

function EntityRow({ entity }: { entity: Entity }) {
  return (
    <Link
      to={`/entity/${entity.entity_id}`}
      className="flex items-center justify-between p-3 rounded-md border hover:bg-secondary/50 transition-colors w-full min-w-0"
    >
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-card-foreground truncate">
          {entity.display_name}
        </p>

        <p className="text-xs text-muted-foreground truncate">
          {entity.entity_type === "party" ? "Party" : entity.county ?? ""}
          {entity.constituency ? ` • ${entity.constituency}` : ""}
        </p>
      </div>

      <div className="flex items-center gap-3 ml-3 flex-shrink-0">
        <span className="text-sm font-mono text-muted-foreground">
          {formatGap(entity.gap_percent)}
        </span>

        <RiskBadge level={entity.risk_level} />
      </div>
    </Link>
  );
}

export function TopFlaggedEntities({ entities }: TopFlaggedEntitiesProps) {
  const flagged = entities
    .filter((e) => e.risk_level !== "GREEN" && e.risk_level !== "INSUFFICIENT_DATA")
    .sort((a, b) => {
      const sev = riskSeverity(a.risk_level) - riskSeverity(b.risk_level);
      if (sev !== 0) return sev;
      return (
        Math.abs(b.gap_percent ?? 0) -
        Math.abs(a.gap_percent ?? 0)
      );
    });

  const flaggedParties = flagged
    .filter((e) => e.entity_type === "party")
    .slice(0, 5);

  const flaggedCandidates = flagged
    .filter((e) => e.entity_type === "candidate")
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full min-w-0">

      {/* Flagged Parties */}
      <div className="bg-card border rounded-lg p-6 w-full min-w-0">
        <h3 className="font-display text-lg font-bold mb-4 text-card-foreground">
          Flagged Parties
        </h3>

        <div className="space-y-3">
          {flaggedParties.length > 0 ? (
            flaggedParties.map((entity) => (
              <EntityRow key={entity.entity_id} entity={entity} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No flagged parties
            </p>
          )}
        </div>
      </div>

      {/* Flagged Candidates */}
      <div className="bg-card border rounded-lg p-6 w-full min-w-0">
        <h3 className="font-display text-lg font-bold mb-4 text-card-foreground">
          Flagged Candidates
        </h3>

        <div className="space-y-3">
          {flaggedCandidates.length > 0 ? (
            flaggedCandidates.map((entity) => (
              <EntityRow key={entity.entity_id} entity={entity} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No flagged candidates
            </p>
          )}
        </div>
      </div>

    </div>
  );
}