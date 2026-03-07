import { Entity, RISK_COLORS, RiskLevel, RISK_LABELS } from "@/lib/data";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface RiskDistributionChartProps {
  entities: Entity[];
}

const RISK_ORDER: RiskLevel[] = ["RED", "USI", "YELLOW", "BLUE", "INSUFFICIENT_DATA", "GREEN"];

export function RiskDistributionChart({ entities }: RiskDistributionChartProps) {
  const counts = RISK_ORDER.map((level) => ({
    name: RISK_LABELS[level],
    value: entities.filter((e) => e.risk_level === level).length,
    color: RISK_COLORS[level],
    level,
  })).filter((d) => d.value > 0);

  return (
    <div className="bg-card border rounded-lg p-6 w-full min-w-0">
      <h3 className="font-display text-lg font-bold mb-4 text-card-foreground ">
        Risk Distribution
      </h3>

      <div className="h-[280px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={counts}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
            >
              {counts.map((entry) => (
                <Cell key={entry.level} fill={entry.color} stroke="none" />
              ))}
            </Pie>

            <Tooltip
              formatter={(value: number, name: string) => [`${value} entities`, name]}
              contentStyle={{ fontSize: 13, borderRadius: 8 }}
            />

            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{ right: "15%" }}
              formatter={(value) => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
              iconSize={10}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}