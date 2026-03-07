import { Entity, formatKES, formatGap, resolvePartyName } from "@/lib/data";
import { RiskBadge } from "./RiskBadge";
import { Link } from "react-router-dom";

interface EntityTableProps {
  entities: Entity[];
  allEntities: Entity[];
}

export function EntityTable({ entities, allEntities }: EntityTableProps) {
  if (entities.length === 0) {
    return (
      <div className="bg-card border rounded-lg p-12 text-center text-muted-foreground">
        No entities match your filters.
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Type</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Party</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">County</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Reported</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Shadow</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Gap</th>
              <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Risk</th>
            </tr>
          </thead>
          <tbody>
            {entities.map((entity) => (
              <tr key={entity.entity_id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3">
                  <Link to={`/entity/${entity.entity_id}`} className="font-semibold text-primary hover:underline">
                    {entity.display_name}
                  </Link>
                </td>
                <td className="px-4 py-3 capitalize text-muted-foreground">{entity.entity_type}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {entity.entity_type === "candidate" ? resolvePartyName(entity, allEntities) : "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{entity.county ?? "—"}</td>
                <td className="px-4 py-3 text-right font-mono text-xs">{formatKES(entity.reported_spend_kes)}</td>
                <td className="px-4 py-3 text-right font-mono text-xs">{formatKES(entity.shadow_spend_kes)}</td>
                <td className="px-4 py-3 text-right font-mono text-xs">{formatGap(entity.gap_percent)}</td>
                <td className="px-4 py-3 text-center"><RiskBadge level={entity.risk_level} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y">
        {entities.map((entity) => (
          <Link
            key={entity.entity_id}
            to={`/entity/${entity.entity_id}`}
            className="block p-4 hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <p className="font-semibold text-primary">{entity.display_name}</p>
              <RiskBadge level={entity.risk_level} />
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
              <span>Type: <span className="capitalize">{entity.entity_type}</span></span>
              <span>County: {entity.county ?? "—"}</span>
              <span>Reported: {formatKES(entity.reported_spend_kes)}</span>
              <span>Shadow: {formatKES(entity.shadow_spend_kes)}</span>
              <span>Gap: {formatGap(entity.gap_percent)}</span>
              {entity.entity_type === "candidate" && (
                <span>Party: {resolvePartyName(entity, allEntities)}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
