import { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Calendar, MapPin, ChevronRight, Scale, Search, Filter, X } from 'lucide-react';

// Mock Data for the Wall of Shame
const verifiedIncidents = [
    {
        id: 1,
        politician: 'Hon. James Mwangi',
        role: 'Governor',
        party: 'UDA',
        county: 'Nairobi',
        date: 'Oct 12, 2025',
        location: 'Kasarani Stadium',
        title: 'Voter Bribery via "Transport Refunds"',
        description: 'Whistleblower submitted raw 4K footage of the Governor\'s aides dispensing KES 1,000 notes to attendees exiting the rally disguised as transport logistics. Our analysts verified the physical cash serials match the recent ORPP county disbursement allocations.',
        severity: 'Critical',
        status: 'Analyst Verified & Condemned'
    },
    {
        id: 2,
        politician: 'Sen. Sarah Koech',
        role: 'Senator',
        party: 'ODM',
        county: 'Kisumu',
        date: 'Nov 02, 2025',
        location: 'Kondele Rally',
        title: 'Undeclared Corporate Vehicle Usage',
        description: 'Fleet of 8 armored luxury SUVs utilized during the campaign were traced back to a shell corporation bidding for the Phase 2 housing project. Use of these assets constitutes illegal, undeclared corporate financing.',
        severity: 'High',
        status: 'Analyst Verified & Condemned'
    },
    {
        id: 3,
        politician: 'MP David Omondi',
        role: 'Member of Parliament',
        party: 'Jubilee',
        county: 'Nakuru',
        date: 'Dec 15, 2025',
        location: 'Naivasha Town Hall',
        title: 'Misappropriation of CDF for Merchandise',
        description: 'Submitted procurement ledger definitively links Constituency Development Funds to the purchase of 10,000 branded t-shirts and umbrellas distributed at the Naivasha town hall. This is a direct violation of the Public Finance Management Act.',
        severity: 'Critical',
        status: 'Analyst Verified & Condemned'
    },
    {
        id: 4,
        politician: 'Gov. Alice Mutua',
        role: 'Governor',
        party: 'Wiper',
        county: 'Machakos',
        date: 'Jan 20, 2026',
        location: 'Machakos Convention Center',
        title: 'Coercion of County Staff',
        description: 'Leaked internal memos and audio recordings verified by digital forensics indicate explicit directives forcing county health workers to attend political rallies during operational hours or face termination.',
        severity: 'High',
        status: 'Analyst Verified & Condemned'
    },
    {
        id: 5,
        politician: 'Hon. Peter Kuria',
        role: 'MCA',
        party: 'UDA',
        county: 'Kiambu',
        date: 'Feb 10, 2026',
        location: 'Gatundu Market',
        title: 'Illegal Campaign Billboards',
        description: 'Erection of 15 unpermitted mega-billboards. The vendor invoices demonstrate the signage was paid for using county beautification funds rather than the declared campaign account.',
        severity: 'Medium',
        status: 'Analyst Verified & Condemned'
    },
    {
        id: 6,
        politician: 'Hon. Fatuma Ali',
        role: 'Women Rep',
        party: 'ODM',
        county: 'Mombasa',
        date: 'Feb 15, 2026',
        location: 'Likoni Ferry',
        title: 'Unlawful Distribution of Relief Food',
        description: 'Branded relief food packages containing government stock were distributed to supporters during a political rally, directly violating electoral code of conduct regarding state resources.',
        severity: 'High',
        status: 'Analyst Verified & Condemned'
    }
];

export default function VerifiedClaims() {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIncident, setSelectedIncident] = useState<typeof verifiedIncidents[0] | null>(null);

    // Animated Counters
    const [scandalCount, setScandalCount] = useState(0);
    const [moneyCount, setMoneyCount] = useState(0);

    const CARDS_PER_PAGE = 3;

    useEffect(() => {
        // Slow counter animation
        const duration = 2000; // 2 seconds
        const steps = 50;
        const stepTime = duration / steps;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            setScandalCount(Math.round((24 / steps) * currentStep));
            setMoneyCount(Math.round((1.2 / steps) * currentStep * 10) / 10);

            if (currentStep >= steps) {
                clearInterval(timer);
                setScandalCount(24);
                setMoneyCount(1.2);
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, []);

    const filteredIncidents = verifiedIncidents.filter(incident => {
        const matchesSearch = incident.politician.toLowerCase().includes(searchTerm.toLowerCase()) ||
            incident.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' || incident.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const paginatedIncidents = filteredIncidents.slice(0, currentPage * CARDS_PER_PAGE);
    const hasMore = paginatedIncidents.length < filteredIncidents.length;

    const generateGeometry = (id: number) => {
        // Generates a simple SVG geometric pattern based on ID as a placeholder
        const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
        const color = colors[id % colors.length];
        return `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20l20-20H0l20 20z' fill='${color.replace('#', '%23')}' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`;
    };

    return (
        <div className="p-6 max-w-[1600px] mx-auto font-sans relative">
            {/* Header */}
            <div className="mb-8 border-b dark:border-slate-800 border-slate-200 pb-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold dark:text-slate-100 text-slate-900 tracking-tight flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg dark:bg-rose-500/20 bg-rose-100 flex items-center justify-center border dark:border-rose-500/30 border-rose-200 shadow-inner">
                                <ShieldAlert className="text-rose-600 dark:text-rose-400" size={24} />
                            </div>
                            The Wall of Shame
                        </h1>
                        <p className="dark:text-slate-400 text-slate-500 text-sm md:text-base mt-4 max-w-3xl leading-relaxed">
                            A curated registry of fact-checked whistleblower evidence highlighting public finance violations and campaign malpractice. Every claim below represents a verified breach of the Political Parties Act.
                        </p>
                    </div>

                    {/* Animated Condemnation Stats */}
                    <div className="flex gap-4 w-full lg:w-auto">
                        <div className="flex-1 lg:w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex flex-col items-center justify-center">
                            <div className="text-3xl font-black text-rose-600 dark:text-rose-500 font-mono">{scandalCount}</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">Verified Scandals</div>
                        </div>
                        <div className="flex-1 lg:w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex flex-col items-center justify-center">
                            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-500 font-mono">KES {moneyCount.toFixed(1)}B</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">Misappropriated</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-slate-500 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by politician or incident title..."
                        className="w-full pl-10 pr-4 py-3 dark:bg-slate-900 bg-white border dark:border-slate-700 border-slate-300 rounded-xl text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 shadow-sm dark:text-white text-slate-900 font-mono transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative w-full md:w-64">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-slate-500 text-slate-400" size={18} />
                    <select
                        className="w-full pl-10 pr-10 py-3 dark:bg-slate-900 bg-white border dark:border-slate-700 border-slate-300 rounded-xl text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 shadow-sm dark:text-white text-slate-900 appearance-none font-bold"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="All">All Roles</option>
                        <option value="Governor">Governor</option>
                        <option value="Senator">Senator</option>
                        <option value="Member of Parliament">Member of Parliament</option>
                        <option value="Women Rep">Women Rep</option>
                        <option value="MCA">MCA</option>
                    </select>
                </div>
            </div>

            {/* Content Grid (Shorter Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedIncidents.map((incident) => (
                    <div
                        key={incident.id}
                        onClick={() => setSelectedIncident(incident)}
                        className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-rose-200 dark:hover:border-rose-500/30 transition-all duration-200 cursor-pointer group flex flex-col h-[280px]"
                    >
                        {/* Geometric Placeholder Header */}
                        <div
                            className="h-24 relative overflow-hidden bg-slate-100 dark:bg-slate-950 flex items-center justify-center border-b dark:border-slate-800 border-slate-200"
                            style={{ backgroundImage: generateGeometry(incident.id) }}
                        >
                            {/* Verified Badge overlay */}
                            <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 dark:bg-slate-900/90 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border dark:border-emerald-500/30 border-emerald-200 shadow-sm">
                                <CheckCircle2 size={12} className="text-emerald-500" />
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[9px] uppercase tracking-widest leading-none mt-0.5">Verified</span>
                            </div>

                            {/* Severity Overlay */}
                            <div className={`absolute top-3 right-3 z-20 px-2.5 py-1 dark:bg-slate-900/90 bg-white/90 backdrop-blur-md border rounded-full text-[9px] font-bold uppercase tracking-widest shadow-sm ${incident.severity === 'Critical' ? 'border-rose-500/30 text-rose-600 dark:text-rose-400' : 'border-amber-500/30 text-amber-600 dark:text-amber-400'
                                }`}>
                                {incident.severity} Breach
                            </div>

                            {/* Abstract Icon */}
                            <div className="w-12 h-12 rounded-full dark:bg-slate-900/80 bg-white/80 backdrop-blur border dark:border-slate-700 border-slate-300 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <Scale size={20} className="dark:text-slate-400 text-slate-500" />
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 truncate">{incident.politician}</h3>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-1 mb-3">
                                    <span>{incident.role}</span>
                                    <span>•</span>
                                    <span className="text-rose-600 dark:text-rose-400">{incident.party}</span>
                                </div>
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight line-clamp-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                                    {incident.title}
                                </h4>
                            </div>

                            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-500 border-t dark:border-slate-800 border-slate-100 pt-3 mt-4">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={12} /> {incident.date}
                                </div>
                                <div className="flex items-center gap-1 text-rose-600 dark:text-rose-500 hover:underline">
                                    Read Details <ChevronRight size={14} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {paginatedIncidents.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed dark:border-slate-800 border-slate-200 rounded-2xl">
                    <AlertTriangle size={48} className="mx-auto text-slate-400 mb-4 opacity-50" />
                    <h3 className="text-lg font-bold dark:text-slate-300 text-slate-700">No verifiable scandals found.</h3>
                    <p className="text-sm dark:text-slate-500 text-slate-500 mt-2">Adjust your search or filter parameters.</p>
                </div>
            )}

            {/* Pagination / Load More */}
            {hasMore && (
                <div className="mt-10 flex justify-center pb-8">
                    <button
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="px-8 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2 group text-sm uppercase tracking-widest"
                    >
                        Load More Records <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}

            {/* Detail Modal Overlay */}
            {selectedIncident && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6 bg-slate-900/60 backdrop-blur-sm shadow-2xl animate-in fade-in duration-200">
                    <div
                        className="dark:bg-slate-950 bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] border dark:border-slate-800 border-slate-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div
                            className="h-32 relative overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center border-b dark:border-slate-800 border-slate-200"
                            style={{ backgroundImage: generateGeometry(selectedIncident.id) }}
                        >
                            <button
                                onClick={() => setSelectedIncident(null)}
                                className="absolute top-4 right-4 z-30 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <div className="w-16 h-16 rounded-full dark:bg-slate-950 bg-white border-2 dark:border-slate-800 border-slate-200 flex items-center justify-center shadow-lg z-10">
                                <Scale size={28} className="dark:text-rose-500 text-rose-600" />
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
                            <div className="mb-6 flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-black dark:text-white text-slate-900 tracking-tight">{selectedIncident.politician}</h2>
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-2">
                                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{selectedIncident.role}</span>
                                        <span className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-1 rounded border border-rose-100 dark:border-rose-500/20">{selectedIncident.party}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 mb-6">
                                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold dark:text-slate-300 text-slate-700">
                                    <Calendar size={14} className="text-slate-400" /> {selectedIncident.date}
                                </div>
                                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold dark:text-slate-300 text-slate-700">
                                    <MapPin size={14} className="text-slate-400" /> {selectedIncident.location}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-rose-600 dark:text-rose-400 leading-tight mb-4">
                                {selectedIncident.title}
                            </h3>

                            <div className="bg-rose-50 dark:bg-rose-500/5 p-5 rounded-xl border border-rose-100 dark:border-rose-500/10 mb-6">
                                <div className="flex items-center gap-2 mb-3 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-widest border-b dark:border-rose-500/20 border-rose-200 pb-2">
                                    <AlertTriangle size={14} /> The Verdict & Summary
                                </div>
                                <p className="text-sm text-slate-800 dark:text-slate-300 leading-relaxed font-medium">
                                    {selectedIncident.description}
                                </p>
                            </div>

                            <div className="mt-8 border-t dark:border-slate-800 border-slate-200 pt-6 flex justify-end">
                                <button
                                    onClick={() => setSelectedIncident(null)}
                                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-lg transition-colors font-bold text-sm tracking-wide"
                                >
                                    Close Record
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
