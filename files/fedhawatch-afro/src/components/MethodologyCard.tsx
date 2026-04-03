export function MethodologyCard() {
  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="font-display text-lg font-bold mb-3 text-card-foreground">How FedhaWatch Works</h3>
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        <p>
          <strong className="text-card-foreground">Track 2 — Shadow Budget Engine:</strong> FedhaWatch collects
          citizen observations of political campaign assets — billboards, vehicles, rallies, merchandise — and
          estimates their monetary value using a standardized cost model.
        </p>
        <p>
          <strong className="text-card-foreground">Comparison:</strong> The estimated "shadow spend" is compared
          against officially reported expenditures filed with the IEBC. Discrepancies are flagged with a risk
          level based on the severity of the gap.
        </p>
        <p>
          <strong className="text-card-foreground">Track 1 — This Dashboard:</strong> Visualizes the results for
          public accountability. Every data point links to its source — either an official filing or a citizen
          observation record.
        </p>
        <p className="text-xs border-t pt-3 text-muted-foreground/70">
          FedhaWatch does not make accusations. It surfaces discrepancies for public scrutiny and further
          investigation by oversight bodies.
        </p>
      </div>
    </div>
  );
}
