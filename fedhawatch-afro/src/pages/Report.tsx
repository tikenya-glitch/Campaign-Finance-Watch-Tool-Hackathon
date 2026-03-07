import { AppLayout } from "@/components/layout/AppLayout";
import { ObservationForm } from "@/components/ObservationForm";

const Report = () => {
  return (
    <AppLayout>
      <div className="container py-8 space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-1">Report an Observation</h1>
          <p className="text-sm text-muted-foreground">
            Help strengthen public accountability. Submit what you've seen — billboards, vehicles, rallies, merchandise, or media activity linked to a political entity.
          </p>
        </div>
        <ObservationForm />
      </div>
    </AppLayout>
  );
};

export default Report;
