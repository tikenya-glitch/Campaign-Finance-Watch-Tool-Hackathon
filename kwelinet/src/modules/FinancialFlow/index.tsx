import React, { useState, useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { Download, Search } from 'lucide-react';
import SankeyChart from '../../components/SankeyChart';
import { mockTransactions, FinancialTransaction } from '../../data/mockFinancialData';

// Color palette for charts
const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#64748b', '#ec4899', '#06b6d4', '#f97316', '#14b8a6'];

const formatKES = (value: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumSignificantDigits: 3 }).format(value);
};

export default function FinancialFlow() {
    // Filters state
    const [yearFilter, setYearFilter] = useState('All');
    const [quarterFilter, setQuarterFilter] = useState('All');
    const [partyFilter, setPartyFilter] = useState('All');
    const [donorFilter, setDonorFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');
    const [sortBy, setSortBy] = useState<'Date' | 'Amount'>('Date');

    // Extract unique options for filters dropdowns
    const uniqueYears = useMemo(() => Array.from(new Set(mockTransactions.map(tx => tx.date.substring(0, 4)))).sort().reverse(), []);
    const uniqueParties = useMemo(() => Array.from(new Set(mockTransactions.map(tx => tx.party))).sort(), []);
    const uniqueDonors = useMemo(() => Array.from(new Set(mockTransactions.map(tx => tx.donor))).sort(), []);

    // Derived filtered dataset
    const filteredData = useMemo(() => {
        return mockTransactions.filter(tx => {
            const txYear = tx.date.substring(0, 4);
            const month = parseInt(tx.date.substring(5, 7), 10);
            const txQuarter = `Q${Math.ceil(month / 3)}`;

            if (yearFilter !== 'All' && txYear !== yearFilter) return false;
            if (quarterFilter !== 'All' && txQuarter !== quarterFilter) return false;
            if (partyFilter !== 'All' && tx.party !== partyFilter) return false;
            if (donorFilter !== 'All' && tx.donor !== donorFilter) return false;
            if (typeFilter !== 'All' && tx.donationType !== typeFilter) return false;

            return true;
        }).sort((a, b) => {
            if (sortBy === 'Amount') return b.amount - a.amount;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
    }, [yearFilter, quarterFilter, partyFilter, donorFilter, typeFilter, sortBy]);

    // Aggregate Data for KPIs and Charts
    const totalDonations = filteredData.reduce((sum, tx) => sum + tx.amount, 0);

    // Timeline Chart Data (Group by YYYY-MM)
    const timelineData = useMemo(() => {
        const groups: Record<string, number> = {};
        filteredData.forEach(tx => {
            const month = tx.date.substring(0, 7);
            groups[month] = (groups[month] || 0) + tx.amount;
        });
        return Object.keys(groups).sort().map(month => ({
            name: month,
            Total: groups[month]
        }));
    }, [filteredData]);

    // Pie Chart Data (By Party)
    const partyShareData = useMemo(() => {
        const groups: Record<string, number> = {};
        filteredData.forEach(tx => {
            groups[tx.party] = (groups[tx.party] || 0) + tx.amount;
        });
        return Object.keys(groups).map(party => ({
            name: party,
            value: groups[party]
        })).sort((a, b) => b.value - a.value);
    }, [filteredData]);

    // Donor Cluster Data (Pie chart by Donor Type)
    const clusterData = useMemo(() => {
        const groups: Record<string, number> = {};
        filteredData.forEach(tx => {
            groups[tx.donorType] = (groups[tx.donorType] || 0) + tx.amount;
        });
        return Object.keys(groups).map(type => ({
            name: type,
            value: groups[type]
        })).sort((a, b) => b.value - a.value);
    }, [filteredData]);

    // Sankey Chart Data (Top 10 pairings to avoid visual clutter)
    const sankeyData = useMemo(() => {
        const nodesSet = new Set<string>();
        const linksMap: Record<string, number> = {};

        // Aggregate links
        let sortedTxs = [...filteredData].sort((a, b) => b.amount - a.amount).slice(0, 50); // Get top 50 biggest transactions for sankey

        sortedTxs.forEach(tx => {
            nodesSet.add(tx.donor);
            nodesSet.add(tx.party);
            const key = `${tx.donor}|${tx.party}`;
            linksMap[key] = (linksMap[key] || 0) + tx.amount;
        });

        const nodes = Array.from(nodesSet).map(name => ({ name }));
        const nodeIndexMap = Object.fromEntries(nodes.map((n, i) => [n.name, i]));

        const links = Object.entries(linksMap).map(([key, value]) => {
            const [sourceStr, targetStr] = key.split('|');
            return {
                source: nodeIndexMap[sourceStr],
                target: nodeIndexMap[targetStr],
                value: parseFloat((value / 1000000).toFixed(2)) // Sankey expects smaller numbers usually, scaling it to millions
            };
        });

        return { nodes, links };
    }, [filteredData]);

    const handleResetFilters = () => {
        setYearFilter('All');
        setQuarterFilter('All');
        setPartyFilter('All');
        setDonorFilter('All');
        setTypeFilter('All');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
            {/* Top Bar / Header */}
            <header className="bg-white border-b border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500 flex items-center justify-center text-white font-bold text-2xl -rotate-6 shadow-sm">
                        X
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Whose Vote Counts?</h1>
                        <p className="text-lg text-slate-600">Political donations in Kenya</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <button className="bg-amber-300 hover:bg-amber-400 text-amber-900 font-medium px-6 py-2 shadow-sm transition-colors text-sm">
                        Download all data
                    </button>
                    <span className="text-xs text-slate-400 italic">Last update: ORPP published declaration report</span>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Intro & Date Filters */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
                    <div className="lg:col-span-5 text-sm text-slate-600 space-y-4">
                        <p>
                            This data explorer contains information on the funding of politics in Kenya as regulated by the Political Parties Funding Act. It contains the disclosed donations from private sources to political parties and public funding (ORPP) distributions.
                        </p>
                        <p>
                            Originally established to level the playing field, the law compels political parties and independents to declare private donations exceeding 1M KES.
                        </p>
                        <button className="bg-amber-300 hover:bg-amber-400 text-amber-900 font-medium px-4 py-3 shadow-sm transition-colors w-full mt-2 text-lg">
                            Suggestions, feedback or tips?
                        </button>
                    </div>

                    <div className="lg:col-span-7 flex flex-col items-end">
                        <div className="w-full max-w-md">
                            <h3 className="text-lg font-bold text-slate-900 mb-2 text-center md:text-left">Filter by date</h3>
                            <p className="text-sm text-slate-500 mb-4 text-center md:text-left">Choose reporting period</p>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <select
                                    className="border border-slate-300 text-slate-700 bg-white p-2 rounded w-full outline-none"
                                    value={yearFilter}
                                    onChange={(e) => setYearFilter(e.target.value)}
                                >
                                    <option value="All">Declared Year</option>
                                    {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                                <select
                                    className="border border-slate-300 text-slate-700 bg-white p-2 rounded w-full outline-none"
                                    value={quarterFilter}
                                    onChange={(e) => setQuarterFilter(e.target.value)}
                                >
                                    <option value="All">Quarter</option>
                                    <option value="Q1">Q1 (Jan-Mar)</option>
                                    <option value="Q2">Q2 (Apr-Jun)</option>
                                    <option value="Q3">Q3 (Jul-Sep)</option>
                                    <option value="Q4">Q4 (Oct-Dec)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Filters & Total Line */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-8 pb-6 border-b border-slate-200">
                    <div>
                        <p className="text-sm font-semibold text-slate-600 mb-1">Total donations (as filtered)</p>
                        <div className="text-4xl font-light text-slate-900 bg-white border border-slate-300 p-4 shadow-sm inline-block">
                            {formatKES(totalDonations)}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-end gap-3 flex-1 justify-end">
                        <button
                            onClick={handleResetFilters}
                            className="bg-green-100 hover:bg-green-200 text-green-800 border border-green-300 px-4 py-2 font-medium transition-colors"
                        >
                            Reset filters
                        </button>

                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-slate-500 mb-1">Party Name</label>
                            <select
                                className="border border-slate-300 text-slate-700 bg-white p-2 rounded w-48 outline-none"
                                value={partyFilter}
                                onChange={(e) => setPartyFilter(e.target.value)}
                            >
                                <option value="All">All Parties</option>
                                {uniqueParties.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-slate-500 mb-1">Donor Name</label>
                            <select
                                className="border border-slate-300 text-slate-700 bg-white p-2 rounded w-48 outline-none"
                                value={donorFilter}
                                onChange={(e) => setDonorFilter(e.target.value)}
                            >
                                <option value="All">All Donors</option>
                                {uniqueDonors.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-slate-500 mb-1">Donation Type</label>
                            <select
                                className="border border-slate-300 text-slate-700 bg-white p-2 rounded w-36 outline-none"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="All">All Types</option>
                                <option value="MONETARY">MONETARY</option>
                                <option value="IN-KIND">IN-KIND</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Timeline Chart */}
                <div className="bg-white p-6 border border-slate-200 shadow-sm mb-10">
                    <h3 className="font-bold text-slate-800 mb-4 inline-block bg-slate-100 px-3 py-1">Donations timeline</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={timelineData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 10, fill: '#64748b' }}
                                    angle={-45}
                                    textAnchor="end"
                                />
                                <YAxis
                                    tickFormatter={(val) => `KES ${(val / 1000000)}M`}
                                    tick={{ fontSize: 10, fill: '#64748b' }}
                                    width={80}
                                />
                                <Tooltip
                                    formatter={(value: any) => formatKES(value as number)}
                                    cursor={{ fill: '#f1f5f9' }}
                                />
                                <Bar dataKey="Total" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Exclusions & Pie Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
                    <div className="lg:col-span-4 space-y-4">
                        <h3 className="font-bold text-slate-900 text-lg">What is excluded from this data?</h3>
                        <div className="text-sm text-slate-700 space-y-4">
                            <p>The data here is limited to disclosed private donations under the Political Funding Act and official public fund allocations from ORPP.</p>
                            <p>Parties and independents may have multiple sources of income, and the majority are not shown in this dashboard if they circumvent official banking channels.</p>
                            <p>This data does not show private donations received under the disclosure threshold (1M KES), membership fees, or undocumented loans.</p>
                        </div>
                    </div>

                    <div className="lg:col-span-8 bg-white p-6 border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 text-center">Individual donation details</h3>
                        <div className="h-[300px] w-full flex">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={partyShareData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={110}
                                        dataKey="value"
                                        paddingAngle={1}
                                    >
                                        {partyShareData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: any) => formatKES(value as number)} />
                                    <Legend
                                        layout="vertical"
                                        verticalAlign="middle"
                                        align="right"
                                        wrapperStyle={{ fontSize: '11px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Data Grid Table */}
                <div className="mb-12">
                    <p className="text-sm text-slate-600 mb-2">
                        The table below shows all disclosed donations as line items. You can reorder and filter the items by party, donor, donor type, date, amount, and quarter using the main filters above.
                    </p>
                    <div className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden">
                        <div className="bg-slate-50 p-2 flex justify-end border-b border-slate-200 gap-2">
                            <button
                                onClick={() => setSortBy('Date')}
                                className={`px-3 py-1 text-xs font-semibold ${sortBy === 'Date' ? 'bg-slate-200' : 'bg-transparent'} hover:bg-slate-200 rounded`}
                            >
                                Sort by Date
                            </button>
                            <button
                                onClick={() => setSortBy('Amount')}
                                className={`px-3 py-1 text-xs font-semibold ${sortBy === 'Amount' ? 'bg-slate-200' : 'bg-transparent'} hover:bg-slate-200 rounded`}
                            >
                                Sort by Amount
                            </button>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            <table className="w-full text-xs text-left text-slate-700">
                                <thead className="bg-slate-100 font-bold sticky top-0 border-b border-slate-200">
                                    <tr>
                                        <th className="p-3">Party</th>
                                        <th className="p-3">Donor</th>
                                        <th className="p-3">Donor type</th>
                                        <th className="p-3">Date</th>
                                        <th className="p-3 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.slice(0, 200).map((tx, idx) => (
                                        <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="p-3 font-medium uppercase text-[10px]">{tx.party}</td>
                                            <td className="p-3 uppercase text-[10px]">{tx.donor}</td>
                                            <td className="p-3 capitalize">{tx.donorType}</td>
                                            <td className="p-3">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                            <td className="p-3 text-right font-mono">{formatKES(tx.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredData.length > 200 && (
                                <div className="p-3 text-center text-xs text-slate-500 bg-slate-50 border-t border-slate-100">
                                    Showing top 200 results. Use filters to narrow down.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Donor Clusters & Sankey */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Donor clusters & financial flows</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-4 space-y-6 text-sm text-slate-700">
                            <p>There are many once-off donations from individuals or companies, but the value of these donations is generally relatively low.</p>
                            <p>With more than 500 disclosed donations since the law's implementation, the data shows that several donors and groups of donors are responsible for a disproportionately high percentage of all private funding and ORPP distribution.</p>
                            <p>In the chart to the right, you can see financial flows from major donors such as State Funding and major logistical/infrastructure corporations to specific parties.</p>
                            <p>Major donors often donate to more than one political party to hedge political bets across administrations.</p>

                            <div className="bg-white border border-slate-200 shadow-sm mt-6">
                                <h4 className="font-bold text-slate-800 bg-slate-50 p-2 border-b border-slate-200 inline-block text-xs">Donation totals by cluster</h4>
                                <div className="h-[200px] w-full p-2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={clusterData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={70}
                                                dataKey="value"
                                            >
                                                {clusterData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: any) => formatKES(value as number)} />
                                            <Legend
                                                layout="vertical"
                                                verticalAlign="middle"
                                                align="right"
                                                wrapperStyle={{ fontSize: '10px' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8 bg-white border border-slate-200 shadow-sm p-4 h-[600px] flex flex-col relative">
                            <div className="flex justify-between text-xs font-bold text-slate-600 mb-4 px-4 bg-slate-50 py-2 border-b border-slate-200">
                                <span>Donations from</span>
                                <span>Donations to</span>
                            </div>
                            <div className="flex-1 overflow-hidden relative">
                                {sankeyData.nodes.length > 0 ? (
                                    <SankeyChart data={sankeyData} />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400">
                                        Not enough data with current filters to build flow topology.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
