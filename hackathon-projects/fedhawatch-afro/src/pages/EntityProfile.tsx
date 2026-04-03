import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { EntityProfileHeader } from "@/components/EntityProfileHeader";
import { SpendComparisonChart } from "@/components/SpendComparisonChart";
import { DriversPanel } from "@/components/DriversPanel";
import { EvidencePanel } from "@/components/EvidencePanel";
import { AffiliationPanel } from "@/components/AffiliationPanel";
import { FedhaWatchContract, fetchContract } from "@/lib/data";
import { ArrowLeft, Loader2 } from "lucide-react";

const EntityProfile = () => {
  const { entityId } = useParams<{ entityId: string }>();
  const [data, setData] = useState<FedhaWatchContract | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContract().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  const entity = data?.entities.find((e) => e.entity_id === entityId);

  if (!entity || !data) {
    return (
      <AppLayout>
        <div className="container py-12 text-center">
          <p className="text-muted-foreground mb-4">Entity not found.</p>
          <Link to="/explorer" className="text-primary hover:underline text-sm">← Back to Explorer</Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container py-8 space-y-8">
        <Link to="/explorer" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Explorer
        </Link>

        <EntityProfileHeader entity={entity} allEntities={data.entities} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SpendComparisonChart entity={entity} />
          <DriversPanel drivers={entity.drivers} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <EvidencePanel sources={entity.sources} />
          <AffiliationPanel entity={entity} allEntities={data.entities} />
        </div>
      </div>
    </AppLayout>
  );
};

export default EntityProfile;
