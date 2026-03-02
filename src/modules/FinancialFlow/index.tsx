import { useState, useMemo, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';
import SankeyChart from '../../components/SankeyChart';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import TypewriterText from '../../components/TypewriterText';
import AnimatedCounter from '../../components/AnimatedCounter';
import MultiSelectDropdown from '../../components/MultiSelectDropdown';
import { mockTransactions } from '../../data/mockFinancialData';
import { Copy, Check } from 'lucide-react';
// Color palette for charts
const PREDEFINED_COLORS: Record<string, string> = {
    'UDA (United Democratic Alliance)': '#eab308', // Yellow
    'ODM (Orange Democratic Movement)': '#f97316', // Orange
    'Jubilee Party': '#ef4444', // Red
    'Wiper Democratic Movement': '#3b82f6', // Blue
    'ANC (Amani National Congress)': '#10b981', // Green
    'FORD-Kenya': '#8b5cf6', // Purple
    'KANU': '#475569', // Slate
    'DAP-K': '#ec4899', // Pink
    'PAA (Pamoja African Alliance)': '#06b6d4', // Cyan
    'MCCP (Maendeleo Chap Chap)': '#14b8a6', // Teal
    'Safina Party': '#f43f5e', // Rose
    'NARC-Kenya': '#84cc16', // Lime
};

const EXTRA_COLORS = ['#fb923c', '#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#fb7185', '#2dd4bf', '#a3e635', '#4ade80', '#60a5fa', '#a78bfa', '#f87171'];

let colorIndex = 0;
const getPartyColor = (party: string) => {
    if (PREDEFINED_COLORS[party]) return PREDEFINED_COLORS[party];
    const color = EXTRA_COLORS[colorIndex % EXTRA_COLORS.length];
    colorIndex++;
    PREDEFINED_COLORS[party] = color;
    return color;
};

const formatKES = (value: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumSignificantDigits: 3 }).format(value);
};

// Custom Recharts label to show percentage inside the slice without overlapping
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    if (percent < 0.05) return null; // Don't show label for very small slices

    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
            {`${(percent * 100).toFixed(1)}%`}
        </text>
    );
};

// Custom interactive legend
const CustomLegend = ({ payload, activeFilters, onToggle }: any) => {
    return (
        <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs">
            {payload.map((entry: any, index: number) => {
                const isActive = activeFilters.length === 0 || activeFilters.includes(entry.value);
                if (!isActive) return null; // Only show active items
                return (
                    <div
                        key={`item-${index}`}
                        className={`flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded transition-colors ${isActive ? 'hover:bg-slate-100' : 'opacity-50'}`}
                        onClick={() => onToggle(entry.value)}
                    >
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="font-medium text-slate-700">{entry.value}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default function FinancialFlow() {
    // Extract unique options for filters dropdowns statically
    const uniqueYears = useMemo(() => Array.from(new Set(mockTransactions.map(tx => tx.date.substring(0, 4)))).sort().reverse(), []);
    const uniqueParties = useMemo(() => Array.from(new Set(mockTransactions.map(tx => tx.party))).sort(), []);
    const uniqueDonors = useMemo(() => Array.from(new Set(mockTransactions.map(tx => tx.donor))).sort(), []);
    const uniqueTypes = ['MONETARY', 'IN-KIND'];
    const uniqueQuarters = ['Q1', 'Q2', 'Q3', 'Q4'];

    // Filters state (multi-select arrays)
    const [yearFilter, setYearFilter] = useState<string[]>(uniqueYears);
    const [quarterFilter, setQuarterFilter] = useState<string[]>(uniqueQuarters);
    const [partyFilter, setPartyFilter] = useState<string[]>(uniqueParties);
    const [donorFilter, setDonorFilter] = useState<string[]>(uniqueDonors);
    const [typeFilter, setTypeFilter] = useState<string[]>(uniqueTypes);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortBy, setSortBy] = useState<'Date' | 'Amount'>('Date');
    const [currentPage, setCurrentPage] = useState(1);
    const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
    const [emailCopied, setEmailCopied] = useState(false);
    const itemsPerPage = 10;

    // Derived filtered dataset
    const filteredData = useMemo(() => {
        return mockTransactions.filter(tx => {
            const txYear = tx.date.substring(0, 4);
            const month = parseInt(tx.date.substring(5, 7), 10);
            const txQuarter = "Q" + Math.ceil(month / 3);

            if (yearFilter.length > 0 && !yearFilter.includes(txYear)) return false;
            if (quarterFilter.length > 0 && !quarterFilter.includes(txQuarter)) return false;
            if (partyFilter.length > 0 && !partyFilter.includes(tx.party)) return false;
            if (donorFilter.length > 0 && !donorFilter.includes(tx.donor)) return false;
            if (typeFilter.length > 0 && !typeFilter.includes(tx.donationType)) return false;

            if (startDate && tx.date < startDate) return false;
            if (endDate && tx.date > endDate) return false;

            return true;
        }).sort((a, b) => {
            if (sortBy === 'Amount') return b.amount - a.amount;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
    }, [yearFilter, quarterFilter, partyFilter, donorFilter, typeFilter, startDate, endDate, sortBy]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredData]);

    // Aggregate Data for KPIs and Charts
    const totalDonations = filteredData.reduce((sum, tx) => sum + tx.amount, 0);

    // Timeline Chart Data (Group by YYYY-QQ) - Stacked Bar Chart
    const timelineData = useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const groups: Record<string, any> = {};
        const partiesInFilteredData = new Set<string>();

        filteredData.forEach(tx => {
            const year = tx.date.substring(0, 4);
            const month = parseInt(tx.date.substring(5, 7), 10);
            const quarter = "Q" + Math.ceil(month / 3);
            const period = year + " " + quarter;

            partiesInFilteredData.add(tx.party);

            if (!groups[period]) {
                groups[period] = { name: period, totalPeriodAmount: 0 };
            }
            groups[period][tx.party] = (groups[period][tx.party] || 0) + tx.amount;
            groups[period].totalPeriodAmount += tx.amount;
        });

        const activeParties = Array.from(partiesInFilteredData);
        // Pre-compute colors for all active parties
        activeParties.forEach(p => getPartyColor(p));

        return {
            data: Object.values(groups).sort((a, b) => a.name.localeCompare(b.name)),
            parties: activeParties
        };
    }, [filteredData]);

    // Pie Chart Data (By Party for individual details)
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
            groups[tx.donor] = (groups[tx.donor] || 0) + tx.amount;
        });
        // Group top 10 donors, rest into "Other"
        const sorted = Object.keys(groups).map(donor => ({
            name: donor,
            value: groups[donor]
        })).sort((a, b) => b.value - a.value);

        if (sorted.length > 10) {
            const top10 = sorted.slice(0, 10);
            const othersValue = sorted.slice(10).reduce((sum, item) => sum + item.value, 0);
            return [...top10, { name: 'Other Donors', value: othersValue }];
        }
        return sorted;
    }, [filteredData]);

    // Sankey Chart Data
    const sankeyData = useMemo(() => {
        const nodesSet = new Set<string>();
        const linksMap: Record<string, number> = {};

        // Use top 50 biggest transactions for visual clarity
        const sortedTxs = [...filteredData].sort((a, b) => b.amount - a.amount).slice(0, 50);

        sortedTxs.forEach(tx => {
            nodesSet.add(tx.donor);
            nodesSet.add(tx.party);
            const key = `${tx.donor}|${tx.party}`;
            linksMap[key] = (linksMap[key] || 0) + tx.amount;
        });

        const nodes = Array.from(nodesSet).map(name => ({ id: name, name: name }));

        const links = Object.entries(linksMap).map(([key, value]) => {
            const [sourceStr, targetStr] = key.split('|');
            return {
                source: sourceStr,
                target: targetStr,
                value: parseFloat((value / 1000000).toFixed(2))
            };
        });

        return { nodes, links };
    }, [filteredData]);

    const handleResetFilters = () => {
        setYearFilter(uniqueYears);
        setQuarterFilter(uniqueQuarters);
        setPartyFilter(uniqueParties);
        setDonorFilter(uniqueDonors);
        setTypeFilter(uniqueTypes);
        setStartDate('');
        setEndDate('');
    };

    // Chart Click Handlers for interactivity
    const handleBarClick = (partyName: string) => {
        setPartyFilter([partyName]);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePieClick = (data: any) => {
        if (data && data.name) {
            setPartyFilter([data.name]);
        }
    };

    const handleClusterPieClick = (data: any) => {
        if (data && data.name && data.name !== 'Other Donors') {
            setDonorFilter([data.name]);
        }
    };

    const handleSankeyNodeClick = (nodeName: string) => {
        if (uniqueParties.includes(nodeName)) {
            setPartyFilter([nodeName]);
        } else if (uniqueDonors.includes(nodeName)) {
            setDonorFilter([nodeName]);
        }
    };

    const handleSankeyLinkClick = (sourceName: string, targetName: string) => {
        if (sourceName) setDonorFilter([sourceName]);
        if (targetName) setPartyFilter([targetName]);
    };

    const downloadChartCSV = (chartName: string, data: any[], headers: string[], mapper: (d: any) => any[]) => {
        const rows = data.map(mapper);
        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `kwelinet_${chartName} _export.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const downloadCSV = () => {
        const headers = ["Party", "Donor", "Donor Type", "Date", "Amount", "Quarter"];
        const rows = filteredData.map(tx => [
            `"${tx.party}"`,
            `"${tx.donor}"`,
            `"${tx.donorType}"`,
            `"${tx.date}"`,
            tx.amount.toString(),
            `"Q${Math.ceil(parseInt(tx.date.substring(5, 7), 10) / 3)}"`
        ]);
        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "kwelinet_donations.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const isFiltered = yearFilter.length !== uniqueYears.length ||
        quarterFilter.length !== uniqueQuarters.length ||
        partyFilter.length !== uniqueParties.length ||
        donorFilter.length !== uniqueDonors.length ||
        typeFilter.length !== uniqueTypes.length ||
        startDate !== '' || endDate !== '';

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
            {/* Top Bar / Header */}
            <header className="bg-white border-b border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <img src="/logo.svg" alt="KweliNet" className="w-12 h-12" onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const sibling = e.currentTarget.nextElementSibling as HTMLElement;
                        if (sibling) sibling.style.display = 'flex';
                    }} />
                    <div className="w-12 h-12 bg-blue-600 hidden items-center justify-center text-white font-bold text-2xl -rotate-6 shadow-sm rounded">
                        K
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight">
                            <TypewriterText fullText="KweliNet" eraseAmount={3} typingSpeed={250} delay={6000} />
                        </h2>
                        <p className="text-slate-500 font-medium tracking-wide">Political donations in Kenya</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <button onClick={downloadCSV} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 px-6 py-2 shadow-sm transition-colors text-sm rounded">
                        <Download size={16} /> Download CSV
                    </button>
                    <span className="text-xs text-slate-500 italic">Last update: ORPP published declaration report, 28 November 2025</span>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Intro & Date Filters */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-10">
                    <div className="lg:col-span-5 text-sm text-slate-600 space-y-4">
                        <p>
                            This data explorer contains information on the private funding of politics in Kenya as regulated by the Political Parties Act (PPA) and overseen by the Office of the Registrar of Political Parties (ORPP). Specifically, it tracks disclosed donations from private corporate and individual sources to active political formations.
                        </p>
                        <p>
                            Under Section 31 of the PPA, political parties are required to declare any private donations exceeding KES 1,000,000 from a single source within a financial year. This platform visualizes these disclosures to promote transparency in Kenya's democratic processes.
                        </p>
                        <div className="relative group mt-2">
                            <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-300 font-medium px-4 py-4 shadow-sm transition-colors w-full text-lg rounded-md flex justify-center items-center gap-2">
                                Suggestions, feedback or tips?
                            </button>
                            <div className="absolute top-[-60px] left-1/2 transform -translate-x-1/2 w-64 bg-slate-900 text-white text-xs rounded py-2 px-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col items-center gap-2 z-50">
                                <span className="text-center font-medium">Reach out directly:</span>
                                <div className="flex items-center gap-2 bg-slate-800 rounded px-2 py-1 border border-slate-700 w-full justify-between">
                                    <span className="font-mono text-[11px] text-blue-300">investigations@kwelinet.or.ke</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigator.clipboard.writeText('investigations@kwelinet.or.ke');
                                            setEmailCopied(true);
                                            setTimeout(() => setEmailCopied(false), 2000);
                                        }}
                                        className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                                        title="Copy email address"
                                    >
                                        {emailCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                    </button>
                                </div>
                                {/* Tooltip Triangle */}
                                <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45"></div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 flex flex-col">
                        <div className="w-full">
                            <h3 className="text-xl font-bold text-slate-900 mb-1 text-center md:text-left">Filter by date</h3>
                            <p className="text-sm text-slate-500 mb-4 text-center md:text-left">Choose reporting period</p>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <MultiSelectDropdown
                                    label="Declared Year"
                                    options={uniqueYears}
                                    selectedValues={yearFilter}
                                    onChange={setYearFilter}
                                />
                                <MultiSelectDropdown
                                    label="Quarter"
                                    options={uniqueQuarters}
                                    selectedValues={quarterFilter}
                                    onChange={setQuarterFilter}
                                />
                            </div>

                            <p className="text-sm text-slate-500 mb-2 text-center md:text-left">Or donation date</p>
                            <div className="flex gap-4">
                                <div className="flex-1 bg-white border border-slate-300 rounded p-2 flex items-center justify-between shadow-sm">
                                    <span className="text-xs text-slate-400">Start Date</span>
                                    <input
                                        type="date"
                                        className="outline-none text-sm text-slate-700 bg-transparent"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="flex-1 bg-white border border-slate-300 rounded p-2 flex items-center justify-between shadow-sm">
                                    <span className="text-xs text-slate-400">End Date</span>
                                    <input
                                        type="date"
                                        className="outline-none text-sm text-slate-700 bg-transparent"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Filters & Total Line */}
                <div className="mb-8 pb-6 border-b border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900 text-center mb-6">Filter the data</h3>
                    <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                        <div>
                            <p className="text-sm font-semibold text-slate-600 mb-1">Total donations (as filtered)</p>
                            <div className="text-4xl font-light text-slate-900 bg-white border border-slate-300 p-4 shadow-sm inline-block rounded">
                                <AnimatedCounter value={totalDonations} duration={1500} format={(val) => formatKES(val)} />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-end gap-4 flex-1 justify-end w-full mb-6">
                            <span className="text-sm text-slate-500 mr-2">You can also filter by clicking inside the charts</span>
                            <button onClick={() => downloadChartCSV(
                                'timeline',
                                timelineData.data,
                                ['Period', ...timelineData.parties],
                                (d) => [d.name, ...timelineData.parties.map(p => d[p] || 0)]
                            )} className="px-3 py-1.5 flex items-center gap-2 hover:bg-slate-100 rounded text-slate-600 transition-colors border border-slate-200" title="Export Chart Data">
                                <Download size={16} /> Export CSV
                            </button>
                            <button
                                onClick={handleResetFilters}
                                disabled={!isFiltered}
                                className={`px - 4 py - 2 font - medium transition - colors rounded h - [42px] ${isFiltered ? 'bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-300 shadow-sm' : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'} `}
                            >
                                Reset filters
                            </button>

                            <div className="flex flex-col w-48">
                                <label className="text-xs font-semibold text-slate-500 mb-1">Party Name</label>
                                <MultiSelectDropdown
                                    label="Party"
                                    options={uniqueParties}
                                    selectedValues={partyFilter}
                                    onChange={setPartyFilter}
                                />
                            </div>

                            <div className="flex flex-col w-40">
                                <label className="text-xs font-semibold text-slate-500 mb-1">Donation Type</label>
                                <MultiSelectDropdown
                                    label="Donation Type"
                                    options={uniqueTypes}
                                    selectedValues={typeFilter}
                                    onChange={setTypeFilter}
                                />
                            </div>

                            <div className="flex flex-col w-48">
                                <label className="text-xs font-semibold text-slate-500 mb-1">Donor Name</label>
                                <MultiSelectDropdown
                                    label="Donor"
                                    options={uniqueDonors}
                                    selectedValues={donorFilter}
                                    onChange={setDonorFilter}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline Stacked Bar Chart */}
                <div className="bg-white p-6 border border-slate-200 shadow-sm rounded-md mb-10 overflow-hidden relative">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="font-bold text-slate-800 bg-white border border-slate-200 px-4 py-2 shadow-sm inline-block rounded">Donations timeline</h3>
                        <span className="text-sm font-medium text-slate-500">You can also filter by clicking inside the charts</span>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={timelineData.data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                                    angle={-40}
                                    textAnchor="end"
                                    dy={10}
                                />
                                <YAxis
                                    tickFormatter={(val) => `${(val / 1000000)} M`}
                                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                                    width={60}
                                    label={{ value: "Donations total (KES)", angle: -90, position: 'insideLeft', offset: -10, style: { textAnchor: 'middle', fontSize: 12, fill: '#64748b' } }}
                                />
                                <Tooltip
                                    formatter={(value: any, name: any) => [formatKES(value as number), String(name)]}
                                    cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }}
                                    contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', border: '1px solid #e2e8f0', zIndex: 50 }}
                                    filterNull={false}
                                    itemSorter={(item: any) => -item.value}
                                    content={({ active, payload, label }: any) => {
                                        if (active && payload && payload.length) {
                                            // Sort payload so largest is at top
                                            const sortedPayload = [...payload].sort((a, b) => b.value - a.value);
                                            // Handle highlighting isolation in the tooltip
                                            const displayPayload = hoveredSegment
                                                ? sortedPayload.filter(p => p.dataKey === hoveredSegment)
                                                : sortedPayload.filter(p => p.value > 0);

                                            if (displayPayload.length === 0) return null;

                                            return (
                                                <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
                                                    <p className="font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1">{label}</p>
                                                    {displayPayload.map((entry: any, index: number) => (
                                                        <div key={`item-${index}`} className="flex items-center gap-2 mb-1 justify-between text-xs">
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                                                <span className="font-medium text-slate-600">{entry.name}</span>
                                                            </div>
                                                            <span className="font-bold text-slate-900 ml-4">{formatKES(entry.value)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Legend content={<CustomLegend activeFilters={partyFilter} onToggle={handleBarClick} />} wrapperStyle={{ paddingTop: '20px' }} />
                                {timelineData.parties.map(party => {
                                    const isHighlighted = !hoveredSegment || hoveredSegment === party;
                                    const isSelected = partyFilter.length === 0 || partyFilter.includes(party);

                                    return (
                                        <Bar
                                            key={party}
                                            dataKey={party}
                                            stackId="a"
                                            fill={getPartyColor(party)}
                                            fillOpacity={isHighlighted && isSelected ? 1 : 0.2}
                                            onClick={() => handleBarClick(party)}
                                            onMouseEnter={() => setHoveredSegment(party)}
                                            onMouseLeave={() => setHoveredSegment(null)}
                                            cursor="pointer"
                                            style={{ transition: 'fill-opacity 0.2s ease' }}
                                        />
                                    );
                                })}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Exclusions & Pie Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
                    <div className="lg:col-span-4 space-y-4">
                        <h3 className="font-bold text-slate-900 text-lg">What is excluded from this data?</h3>
                        <div className="text-sm text-slate-700 space-y-5 leading-relaxed">
                            <p>This dataset explicitly maps <strong>disclosed private financing</strong> logged centrally with the ORPP under the Political Parties Act.</p>
                            <p>It <span className="font-bold underline decoration-red-400">does not represent the totality of income</span> available to major political structures.</p>
                            <p>Specifically excluded are statutory public transfers, such as the massive disbursements from the <strong>Political Parties Fund (PPF)</strong>—which are public funds allocated proportionally based on votes secured.</p>
                            <p>Furthermore, it does not reliably track untraceable cash "harambee" networks, informal logistical support, opaque party membership drives, or contributions falling beneath the KES 1M disclosure mandate threshold.</p>
                        </div>
                    </div>

                    <div className="lg:col-span-8 bg-white p-6 border border-slate-200 shadow-sm rounded-md relative flex flex-col">
                        <button onClick={() => downloadChartCSV(
                            'party_share',
                            partyShareData,
                            ['Party', 'Total Received'],
                            (d) => [d.name, d.value]
                        )} className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded text-slate-500 transition-colors border border-slate-200 shadow-sm bg-white z-10" title="Export Chart Data">
                            <Download size={16} />
                        </button>
                        <div className="h-[350px] w-full flex">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={partyShareData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={140}
                                        dataKey="value"
                                        onClick={handlePieClick}
                                        onMouseEnter={(data) => setHoveredSegment(data.name)}
                                        onMouseLeave={() => setHoveredSegment(null)}
                                        cursor="pointer"
                                        stroke="#ffffff"
                                        strokeWidth={1}
                                    >
                                        {partyShareData.map((entry, index) => {
                                            const isHighlighted = !hoveredSegment || hoveredSegment === entry.name;
                                            const isSelected = partyFilter.length === 0 || partyFilter.includes(entry.name);
                                            return (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={getPartyColor(entry.name)}
                                                    fillOpacity={isHighlighted && isSelected ? 1 : 0.2}
                                                    style={{ transition: 'opacity 0.2s ease' }}
                                                />
                                            );
                                        })}
                                    </Pie>
                                    <RechartsTooltip
                                        formatter={(value: any) => formatKES(value as number)}
                                        contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), border: 1px solid #e2e8f0' }}
                                    />
                                    <Legend content={<CustomLegend activeFilters={partyFilter} onToggle={(name: string) => handlePieClick({ name })} />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="text-center mb-4">
                    <h3 className="font-bold text-slate-900 text-lg">Individual donation details</h3>
                </div>

                {/* Data Grid Table */}
                <div className="mb-14">
                    <div className="flex justify-between items-end mb-4 px-2">
                        <p className="text-sm text-slate-600 max-w-2xl">
                            The table below shows all disclosed donations as line items. You can reorder and filter the items by party, donor, donor type, date, amount, and quarter using the main filters above.
                        </p>
                        <button onClick={downloadCSV} className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
                            <Download size={16} /> Export CSV
                        </button>
                    </div>
                    <div className="bg-white border border-slate-200 shadow-sm rounded-md overflow-hidden">
                        <div className="bg-slate-50 p-3 flex justify-end border-b border-slate-200 gap-2">
                            <button
                                onClick={() => setSortBy('Date')}
                                className={`px - 4 py - 1.5 text - xs font - semibold transition - colors ${sortBy === 'Date' ? 'bg-slate-200 text-slate-800 shadow-sm rounded-md' : 'bg-transparent text-slate-500 hover:bg-slate-200 hover:text-slate-700 rounded-md'} `}
                            >
                                ▲ Sort by Date
                            </button>
                            <button
                                onClick={() => setSortBy('Amount')}
                                className={`px - 4 py - 1.5 text - xs font - semibold transition - colors ${sortBy === 'Amount' ? 'bg-slate-200 text-slate-800 shadow-sm rounded-md' : 'bg-transparent text-slate-500 hover:bg-slate-200 hover:text-slate-700 rounded-md'} `}
                            >
                                ▲ Sort by Amount
                            </button>
                        </div>
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-xs text-left text-slate-700 whitespace-nowrap min-w-[800px]">
                                <thead className="bg-slate-100 font-bold border-b border-slate-200 text-slate-500">
                                    <tr>
                                        <th className="p-4 uppercase tracking-wider">Party</th>
                                        <th className="p-4 uppercase tracking-wider">Donor</th>
                                        <th className="p-4 uppercase tracking-wider">Donor type</th>
                                        <th className="p-4 uppercase tracking-wider">Date</th>
                                        <th className="p-4 uppercase tracking-wider">Amount</th>
                                        <th className="p-4 uppercase tracking-wider">Quarter</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((tx, idx) => {
                                        const month = parseInt(tx.date.substring(5, 7), 10);
                                        const quarter = `Q${Math.ceil(month / 3)} `;
                                        return (
                                            <tr key={idx} className="border-b border-slate-100 hover:bg-blue-50 transition-colors">
                                                <td className="p-4 font-semibold text-slate-800 uppercase">{tx.party}</td>
                                                <td className="p-4 uppercase font-medium">{tx.donor}</td>
                                                <td className="p-4 capitalize text-slate-500">{tx.donorType}</td>
                                                <td className="p-4 text-slate-600">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                                <td className="p-4 font-mono font-medium text-slate-900">{formatKES(tx.amount)}</td>
                                                <td className="p-4 text-slate-500">{quarter}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            {filteredData.length === 0 && (
                                <div className="p-8 text-center text-slate-500 font-medium">No donations match the applied filters.</div>
                            )}
                        </div>

                        {filteredData.length > 0 && (
                            <div className="bg-white p-3 flex items-center justify-between text-xs text-slate-600 font-medium">
                                <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries</span>
                                <div className="flex gap-1">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        className="px-3 py-1.5 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 bg-white shadow-sm flex items-center gap-1"
                                    >
                                        <ChevronLeft size={14} /> Previous
                                    </button>
                                    <button
                                        disabled={currentPage >= Math.ceil(filteredData.length / itemsPerPage)}
                                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredData.length / itemsPerPage), p + 1))}
                                        className="px-3 py-1.5 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 bg-white shadow-sm flex items-center gap-1"
                                    >
                                        Next <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900">Donor clusters & financial flows</h3>
                </div>

                {/* Donor Clusters & Sankey */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    <div className="xl:col-span-4 space-y-6 text-sm text-slate-700">
                        <p className="leading-relaxed">While grassroots fundraising captures public attention, forensic tracking indicates that top-tier corporate interests and elite conglomerates architect the majority of substantial monetary injections.</p>
                        <p className="leading-relaxed">The <span className="font-semibold text-slate-900">Sankey visualization</span> traces these capital arteries from origin clusters—such as real estate consortiums, agricultural magnates, and infrastructure developers—directly into party treasuries.</p>
                        <p className="leading-relaxed">A recurring vulnerability in the regulatory framework is "cluster grouping": where individuals systematically bypass single-donor caps by utilizing shell subsidiaries or deploying proxies with interlocking board directorships to flood campaigns with coordinated capital.</p>

                        <div className="bg-white border border-slate-200 shadow-sm rounded-md mt-8 relative">
                            <div className="flex justify-between items-center bg-white p-3 border-b border-slate-200 rounded-t-md relative -top-4 shadow-sm mx-4 mb-2">
                                <h4 className="font-bold text-slate-800 text-sm">Donation totals by cluster</h4>
                                <button onClick={() => downloadChartCSV(
                                    'cluster_share',
                                    clusterData,
                                    ['Cluster/Donor', 'Total Donated'],
                                    (d) => [d.name, d.value]
                                )} className="p-1 hover:bg-slate-100 rounded text-slate-500 transition-colors tooltip" title="Export Chart Data">
                                    <Download size={14} />
                                </button>
                            </div>
                            <div className="h-[280px] w-full p-2 relative -top-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={clusterData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            innerRadius={50}
                                            outerRadius={100}
                                            dataKey="value"
                                            onClick={handleClusterPieClick}
                                            onMouseEnter={(data) => setHoveredSegment(data.name)}
                                            onMouseLeave={() => setHoveredSegment(null)}
                                            cursor="pointer"
                                            stroke="#ffffff"
                                            strokeWidth={1}
                                        >
                                            {clusterData.map((entry, index) => {
                                                const isHighlighted = !hoveredSegment || hoveredSegment === entry.name;
                                                const isSelected = donorFilter.length === 0 || donorFilter.includes(entry.name);
                                                return (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={getPartyColor(entry.name)}
                                                        fillOpacity={isHighlighted && isSelected ? 1 : 0.2}
                                                        style={{ transition: 'opacity 0.2s ease' }}
                                                    />
                                                );
                                            })}
                                        </Pie>
                                        <RechartsTooltip
                                            formatter={(value: any) => formatKES(value as number)}
                                            contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), border: 1px solid #e2e8f0' }}
                                        />
                                        <Legend content={<CustomLegend activeFilters={donorFilter} onToggle={(name: string) => handleClusterPieClick({ name })} />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="xl:col-span-8 bg-white border border-slate-200 shadow-sm rounded-md h-[700px] flex flex-col relative overflow-hidden">
                        <div className="flex justify-between text-xs font-bold text-slate-700 px-6 bg-slate-50 py-3 border-b border-slate-200 z-10 w-full absolute top-0">
                            <span>Donations from</span>
                            <span>Donations to</span>
                        </div>
                        <div className="flex-1 w-full h-full pt-10 px-4 pb-4">
                            {sankeyData.nodes.length > 0 ? (
                                <SankeyChart
                                    data={sankeyData}
                                    partyColors={PREDEFINED_COLORS}
                                    onNodeClick={(node: any) => handleSankeyNodeClick(node.name)}
                                    onLinkClick={(source: any, target: any) => handleSankeyLinkClick(source.name, target.name)}
                                    highlightNode={hoveredSegment}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400 font-medium">
                                    No connectivity found for the selected filters.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
