import { Entity, RiskLevel, getUniqueCounties } from "@/lib/data";
import { Search } from "lucide-react";

interface ExplorerFiltersProps {
  entities: Entity[];
  search: string;
  onSearchChange: (v: string) => void;
  entityType: string;
  onEntityTypeChange: (v: string) => void;
  riskLevel: string;
  onRiskLevelChange: (v: string) => void;
  county: string;
  onCountyChange: (v: string) => void;
  sortBy: string;
  onSortByChange: (v: string) => void;
}

const RISK_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All Risk Levels" },
  { value: "RED", label: "RED" },
  { value: "USI", label: "USI" },
  { value: "YELLOW", label: "YELLOW" },
  { value: "BLUE", label: "BLUE" },
  { value: "GREEN", label: "GREEN" },
  { value: "INSUFFICIENT_DATA", label: "Insufficient Data" },
];

export function ExplorerFilters({
  entities, search, onSearchChange, entityType, onEntityTypeChange,
  riskLevel, onRiskLevelChange, county, onCountyChange, sortBy, onSortByChange,
}: ExplorerFiltersProps) {
  const counties = getUniqueCounties(entities);

  const selectClass = "rounded-md border bg-card text-sm px-3 py-2 text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-md border bg-background pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Filters row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <select value={entityType} onChange={(e) => onEntityTypeChange(e.target.value)} className={selectClass}>
          <option value="">All Types</option>
          <option value="party">Parties</option>
          <option value="candidate">Candidates</option>
        </select>

        <select value={riskLevel} onChange={(e) => onRiskLevelChange(e.target.value)} className={selectClass}>
          {RISK_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select value={county} onChange={(e) => onCountyChange(e.target.value)} className={selectClass}>
          <option value="">All Counties</option>
          {counties.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select value={sortBy} onChange={(e) => onSortByChange(e.target.value)} className={selectClass}>
          <option value="gap_desc">Highest Gap %</option>
          <option value="shadow_desc">Highest Shadow Spend</option>
          <option value="alpha">A–Z</option>
        </select>
      </div>
    </div>
  );
}
