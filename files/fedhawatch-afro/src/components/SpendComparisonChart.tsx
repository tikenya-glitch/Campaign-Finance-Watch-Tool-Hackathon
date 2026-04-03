import { Entity, formatKES } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface SpendComparisonChartProps {
  entity: Entity;
}

export function SpendComparisonChart({ entity }: SpendComparisonChartProps) {
  const data = [
    {
      name: entity.display_name.length > 25 ? entity.display_name.substring(0, 23) + "…" : entity.display_name,
      reported: entity.reported_spend_kes ?? 0,
      shadow: entity.shadow_spend_kes,
    },
  ];

  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="font-display text-lg font-bold mb-4 text-card-foreground">Spend Comparison</h3>
      {entity.reported_spend_kes === null ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No reported spend available — disclosure not filed.
        </p>
      ) : (
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
              <XAxis type="number" tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: number) => formatKES(value)} contentStyle={{ fontSize: 13, borderRadius: 8 }} />
              <Legend iconSize={10} />
              <Bar dataKey="reported" name="Reported" fill="hsl(215, 50%, 23%)" radius={[0, 4, 4, 0]} />
              <Bar dataKey="shadow" name="Shadow" fill="hsl(0, 72%, 51%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
