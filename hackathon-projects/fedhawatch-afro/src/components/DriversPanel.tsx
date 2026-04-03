import { AlertCircle } from "lucide-react";

interface DriversPanelProps {
  drivers: string[];
}

export function DriversPanel({ drivers }: DriversPanelProps) {
  if (drivers.length === 0) return null;

  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="font-display text-lg font-bold mb-4 text-card-foreground">Risk Drivers</h3>
      <ul className="space-y-3">
        {drivers.map((driver, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-card-foreground">
            <AlertCircle className="h-4 w-4 text-risk-yellow mt-0.5 flex-shrink-0" />
            <span>{driver}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
