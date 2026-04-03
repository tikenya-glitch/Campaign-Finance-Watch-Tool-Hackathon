import { Entity, formatKES, RISK_COLORS } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

interface ShadowSpendChartProps {
  entities: Entity[];
}

export function ShadowSpendChart({ entities }: ShadowSpendChartProps) {
  const top = [...entities]
    .sort((a, b) => b.shadow_spend_kes - a.shadow_spend_kes)
    .slice(0, 8)
    .map((e) => ({
      name: e.display_name.length > 20 ? e.display_name.substring(0, 18) + "…" : e.display_name,
      shadow: e.shadow_spend_kes,
      color: RISK_COLORS[e.risk_level],
    }));

  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="font-display text-lg font-bold mb-4 text-card-foreground">Top Shadow Spend</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={top} layout="vertical" margin={{ left: 10, right: 20 }}>
            <XAxis
              type="number"
              tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              formatter={(value: number) => [formatKES(value), "Shadow Spend"]}
              contentStyle={{ fontSize: 13, borderRadius: 8 }}
            />
            <Bar dataKey="shadow" radius={[0, 4, 4, 0]}>
              {top.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
