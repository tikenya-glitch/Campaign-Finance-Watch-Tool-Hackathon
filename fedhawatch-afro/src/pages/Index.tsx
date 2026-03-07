import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SummaryCards } from "@/components/SummaryCards";
import { RiskDistributionChart } from "@/components/RiskDistributionChart";
import { TopFlaggedEntities } from "@/components/TopFlaggedEntities";
import { ShadowSpendChart } from "@/components/ShadowSpendChart";
import { MethodologyCard } from "@/components/MethodologyCard";
import { FedhaWatchContract, fetchContract } from "@/lib/data";
import { Eye, Loader2 } from "lucide-react";

const Index = () => {
  const [data, setData] = useState<FedhaWatchContract | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContract()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
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

  if (!data) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
          Failed to load contract data.
        </div>
      </AppLayout>
    );
  }

  const updatedAt = new Date(data.generated_at).toLocaleDateString("en-KE", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <AppLayout>
      {/* Hero */}
      <section className="bg-hero text-hero-foreground py-12 md:py-16">
        <div className="container">
          <div className="flex items-center gap-3 mb-3">
            <Eye className="h-8 w-8 text-accent" />
            <h1 className="text-3xl md:text-4xl font-display font-bold">FedhaWatch</h1>
          </div>
          <p className="text-lg text-hero-foreground/80 font-body mb-2">Revealing the Shadow Budget</p>
          {/* <p className="text-sm text-hero-foreground/60">
            Last updated: {updatedAt} · Period: {data.period_start} to {data.period_end}
          </p> */}
        </div>
      </section>

      <div className="container py-8 space-y-8">
        <SummaryCards entities={data.entities} />

        <TopFlaggedEntities entities={data.entities} />

        <RiskDistributionChart entities={data.entities} />

        <ShadowSpendChart entities={data.entities} />

        <MethodologyCard />
      </div>
    </AppLayout>
  );
};

export default Index;
