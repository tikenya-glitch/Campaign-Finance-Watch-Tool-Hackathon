import { useEffect, useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ExplorerFilters } from "@/components/ExplorerFilters";
import { EntityTable } from "@/components/EntityTable";
import { FedhaWatchContract, fetchContract, Entity, RiskLevel, riskSeverity } from "@/lib/data";
import { Loader2 } from "lucide-react";

const Explorer = () => {
  const [data, setData] = useState<FedhaWatchContract | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [entityType, setEntityType] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [county, setCounty] = useState("");
  const [sortBy, setSortBy] = useState("gap_desc");

  useEffect(() => {
    fetchContract().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    let result = [...data.entities];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((e) => e.display_name.toLowerCase().includes(q));
    }
    if (entityType) result = result.filter((e) => e.entity_type === entityType);
    if (riskLevel) result = result.filter((e) => e.risk_level === riskLevel);
    if (county) result = result.filter((e) => e.county === county);

    switch (sortBy) {
      case "gap_desc":
        result.sort((a, b) => Math.abs(b.gap_percent ?? 0) - Math.abs(a.gap_percent ?? 0));
        break;
      case "shadow_desc":
        result.sort((a, b) => b.shadow_spend_kes - a.shadow_spend_kes);
        break;
      case "alpha":
        result.sort((a, b) => a.display_name.localeCompare(b.display_name));
        break;
    }

    return result;
  }, [data, search, entityType, riskLevel, county, sortBy]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  if (!data) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
          Failed to load data.
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container py-8 space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-1">Entity Explorer</h1>
          <p className="text-sm text-muted-foreground">Search, filter, and sort all tracked political entities.</p>
        </div>

        <ExplorerFilters
          entities={data.entities}
          search={search} onSearchChange={setSearch}
          entityType={entityType} onEntityTypeChange={setEntityType}
          riskLevel={riskLevel} onRiskLevelChange={setRiskLevel}
          county={county} onCountyChange={setCounty}
          sortBy={sortBy} onSortByChange={setSortBy}
        />

        <p className="text-sm text-muted-foreground">{filtered.length} entities found</p>

        <EntityTable entities={filtered} allEntities={data.entities} />
      </div>
    </AppLayout>
  );
};

export default Explorer;
