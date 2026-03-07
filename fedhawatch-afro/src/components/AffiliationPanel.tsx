import { Entity, resolvePartyName } from "@/lib/data";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";

interface AffiliationPanelProps {
  entity: Entity;
  allEntities: Entity[];
}

export function AffiliationPanel({ entity, allEntities }: AffiliationPanelProps) {
  if (entity.entity_type !== "candidate") return null;

  const partyName = resolvePartyName(entity, allEntities);
  const party = entity.party_entity_id
    ? allEntities.find((e) => e.entity_id === entity.party_entity_id)
    : null;

  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="font-display text-lg font-bold mb-4 text-card-foreground">Party Affiliation</h3>
      <div className="flex items-center gap-3">
        <Users className="h-5 w-5 text-primary" />
        {party ? (
          <Link to={`/entity/${party.entity_id}`} className="text-sm font-semibold text-primary hover:underline">
            {partyName}
          </Link>
        ) : (
          <span className="text-sm font-semibold text-card-foreground">{partyName}</span>
        )}
      </div>
    </div>
  );
}
