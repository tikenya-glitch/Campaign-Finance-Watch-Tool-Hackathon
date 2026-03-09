'use client';

import { mockCandidates, mockMonthlyTrend } from '../lib/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';

const CHART_COLORS = {
  raised: '#059669',
  spent: '#dc2626',
  limit: '#94a3b8',
  pie: ['#059669', '#0d9488', '#10b981', '#34d399', '#6ee7b7'],
};

export default function Dashboard() {
  const totalFunds = mockCandidates.reduce((sum, c) => sum + c.fundsRaised, 0);
  const verifiedCount = mockCandidates.filter((c) => c.badge === 'verified').length;
  const violationCount = mockCandidates.filter((c) => c.complianceStatus === 'violation').length;

  const fundsOverviewData = mockCandidates.map((c) => ({
    name: c.name.split(' ')[0],
    raised: c.fundsRaised / 1_000_000,
    spent: c.fundsSpent / 1_000_000,
    limit: c.spendingLimit / 1_000_000,
  }));

  const spendingVsLimitData = mockCandidates.map((c) => ({
    name: c.name.split(' ')[0],
    spent: c.fundsSpent / 1_000_000,
    limit: c.spendingLimit / 1_000_000,
    over: Math.max(0, (c.fundsSpent - c.spendingLimit) / 1_000_000),
  }));

  const fundingBySource = (() => {
    const bySource = new Map<string, number>();
    for (const c of mockCandidates) {
      for (const f of c.fundingBreakdown) {
        bySource.set(f.source, (bySource.get(f.source) ?? 0) + f.amount);
      }
    }
    return Array.from(bySource.entries()).map(([source, amount]) => ({ source, amount }));
  })();

  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Total funds raised
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">KES {totalFunds.toLocaleString()}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Across all monitored campaigns</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Verified candidates
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{verifiedCount}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Of {mockCandidates.length} total</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Compliance alerts
          </h3>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{violationCount}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Candidates with violations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Funds raised vs spent</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={fundsOverviewData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-600" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `KES ${v}M`} />
              <Tooltip
                formatter={(value: unknown) => [typeof value === 'number' ? `KES ${value}M` : String(value), '']}
                contentStyle={{ borderRadius: 8 }}
              />
              <Bar dataKey="raised" fill={CHART_COLORS.raised} name="Raised" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spent" fill={CHART_COLORS.spent} name="Spent" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Spending vs legal limit</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={spendingVsLimitData}
              layout="vertical"
              margin={{ top: 8, right: 8, left: 32, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-600" />
              <XAxis type="number" tickFormatter={(v) => `KES ${v}M`} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" width={50} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: unknown) => [typeof value === 'number' ? `KES ${value}M` : String(value), '']}
                contentStyle={{ borderRadius: 8 }}
              />
              <Bar dataKey="limit" fill={CHART_COLORS.limit} name="Limit" radius={[0, 4, 4, 0]} />
              <Bar dataKey="spent" fill={CHART_COLORS.spent} name="Spent" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Funding by source</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={fundingBySource}
                dataKey="amount"
                nameKey="source"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ source, percent }: { source?: string; percent?: number }) =>
                  source && percent != null ? `${source} ${(percent * 100).toFixed(0)}%` : ''}
                labelLine={false}
              >
                {fundingBySource.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS.pie[i % CHART_COLORS.pie.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: unknown) => [typeof value === 'number' ? `KES ${value.toLocaleString()}` : String(value), 'Amount']}
                contentStyle={{ borderRadius: 8 }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Funding trend (cumulative)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={mockMonthlyTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-600" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `KES ${v / 1_000_000}M`} />
              <Tooltip
                formatter={(value: unknown) => [typeof value === 'number' ? `KES ${value.toLocaleString()}` : String(value), '']}
                contentStyle={{ borderRadius: 8 }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="raised"
                name="Raised"
                stroke={CHART_COLORS.raised}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="spent"
                name="Spent"
                stroke={CHART_COLORS.spent}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
