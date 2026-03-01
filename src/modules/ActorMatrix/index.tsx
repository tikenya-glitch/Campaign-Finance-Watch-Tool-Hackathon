import { useState, useMemo } from 'react';
import { Search, Filter, Shield, AlertTriangle, CheckCircle, ChevronRight, MapPin, Briefcase, FileWarning, Calendar, User, Database, ShieldCheck } from 'lucide-react';
import { mockActors } from '../../data/mockActorData';

export default function ActorMatrix() {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [countyFilter, setCountyFilter] = useState('All Counties');
    const [riskFilter, setRiskFilter] = useState('All Risks');
    const [selectedActor, setSelectedActor] = useState<typeof mockActors[0] | null>(null);

    // Guardrail: Simple sanitization simulation (strip special chars)
    const sanitizedSearchTerm = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    // Filter logic
    const filteredActors = useMemo(() => {
        return mockActors.filter(actor => {
            const matchesSearch = actor.name.toLowerCase().includes(sanitizedSearchTerm.toLowerCase());
            const matchesRole = roleFilter === 'All Roles' || actor.role === roleFilter;
            const matchesCounty = countyFilter === 'All Counties' || actor.county === countyFilter;
            const matchesRisk = riskFilter === 'All Risks' || actor.riskIndicator === riskFilter;
            return matchesSearch && matchesRole && matchesCounty && matchesRisk;
        });
    }, [sanitizedSearchTerm, roleFilter, countyFilter, riskFilter]);

    // Extract unique values for dropdowns
    const roles = ['All Roles', ...Array.from(new Set(mockActors.map(a => a.role)))];
    const counties = ['All Counties', ...Array.from(new Set(mockActors.map(a => a.county)))];
    const risks = ['All Risks', ...Array.from(new Set(mockActors.map(a => a.riskIndicator)))];

    // Standard SAAS risk colors (removed neon/pulse drop-shadows)
    const getRiskColor = (indicator: string) => {
        switch (indicator) {
            case 'Critical': return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';
            case 'High': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
            case 'Moderate': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
            case 'Low': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
            default: return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
        }
    };

    return (
        <div className="p-6 max-w-[1600px] mx-auto font-sans">
            {/* Header */}
            <div className="mb-8 border-b dark:border-slate-800 border-slate-200 pb-5">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold dark:text-slate-100 text-slate-900 tracking-tight flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg dark:bg-indigo-500/20 bg-indigo-100 flex items-center justify-center border dark:border-indigo-500/30 border-indigo-200">
                                <Database className="text-indigo-600 dark:text-indigo-400" size={20} />
                            </div>
                            Political Actor Matrix
                        </h1>
                        <p className="dark:text-slate-400 text-slate-500 text-sm mt-3 max-w-2xl leading-relaxed">
                            A comprehensive registry tracking elected officials, affiliated networks, and associated financial entities. Displaying {filteredActors.length} of {mockActors.length} total records.
                        </p>
                    </div>
                </div>
            </div>

            {/* Modern Search & Filter Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 mb-8 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-center">

                {/* Secure Search Bar */}
                <div className="relative w-full lg:w-96 flex-shrink-0 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search for a politician..."
                        className="w-full pl-10 pr-10 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 dark:bg-slate-950 dark:text-slate-200 text-slate-900 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm !== sanitizedSearchTerm && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500" title="Input sanitized">
                            <ShieldCheck size={16} />
                        </div>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap lg:flex-nowrap gap-3 w-full lg:w-auto">
                    <div className="relative w-full sm:w-auto min-w-[160px]">
                        <select
                            className="w-full appearance-none pl-4 pr-10 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 dark:bg-slate-950 dark:text-slate-300 text-slate-700 font-medium cursor-pointer"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            {roles.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    <div className="relative w-full sm:w-auto min-w-[160px]">
                        <select
                            className="w-full appearance-none pl-4 pr-10 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 dark:bg-slate-950 dark:text-slate-300 text-slate-700 font-medium cursor-pointer"
                            value={countyFilter}
                            onChange={(e) => setCountyFilter(e.target.value)}
                        >
                            {counties.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    <div className="relative w-full sm:w-auto min-w-[160px]">
                        <select
                            className="w-full appearance-none pl-4 pr-10 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 dark:bg-slate-950 dark:text-slate-300 text-slate-700 font-medium cursor-pointer"
                            value={riskFilter}
                            onChange={(e) => setRiskFilter(e.target.value)}
                        >
                            {risks.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Data Grid / Actor Cards - Scalable Layout layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredActors.map(actor => (
                    <div
                        key={actor.id}
                        onClick={() => setSelectedActor(actor)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col group"
                    >
                        {/* SAAS Card Header */}
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800/50 flex gap-4 items-center">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 font-medium text-lg flex-shrink-0">
                                <User size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {actor.name}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                                    {actor.role} • {actor.county}
                                </p>
                            </div>
                        </div>

                        {/* Card Body Metrics */}
                        <div className="p-5 flex-1 flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-950/20">
                            {/* Risk Badge */}
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500 font-medium">Risk Profile</span>
                                <span className={`text-[10px] px-2 py-1 rounded-md border font-bold uppercase tracking-wider ${getRiskColor(actor.riskIndicator)}`}>
                                    {actor.riskIndicator}
                                </span>
                            </div>

                            {/* Term limits cleanly formatted */}
                            {actor.termLimit.max !== Infinity && (
                                <div className="space-y-1.5 mt-auto">
                                    <div className="flex justify-between text-[11px] font-medium text-slate-600 dark:text-slate-400">
                                        <span>Term {actor.termLimit.current} of {actor.termLimit.max}</span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${actor.termLimit.current === actor.termLimit.max ? 'bg-amber-500' : 'bg-indigo-500'}`}
                                            style={{ width: `${(actor.termLimit.yearsIn / actor.termLimit.totalYears) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer row */}
                        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">{actor.party}</span>
                            </div>
                            <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </div>
                ))}

                {filteredActors.length === 0 && (
                    <div className="col-span-full py-16 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
                        <User size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                        <p className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">No politicians found</p>
                        <p className="text-sm">Try adjusting your search query or filters.</p>
                    </div>
                )}
            </div>

            {/* Modal remains mostly similar but stripped of neon */}
            {selectedActor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm">
                    {/* ... (Modal content here, same logic but cleaner tails winds) */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start bg-slate-50 dark:bg-slate-950/50">
                            <div className="flex gap-5 items-center">
                                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-400 font-bold text-2xl shadow-sm">
                                    <User size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{selectedActor.name}</h2>
                                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                                        <span className="flex items-center gap-1"><Briefcase size={14} /> {selectedActor.role}</span>
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {selectedActor.county}</span>
                                        <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-slate-800 dark:text-slate-200">{selectedActor.party}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedActor(null)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 shadow-sm transition-colors text-sm font-medium"
                            >
                                Close
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto flex-1 bg-white dark:bg-slate-900">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Left Col */}
                                <div className="md:col-span-1 space-y-6">
                                    <div>
                                        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Integrity Profile</h4>
                                        <span className={`text-sm px-3 py-1.5 rounded-lg border font-bold inline-block ${getRiskColor(selectedActor.riskIndicator)}`}>
                                            {selectedActor.riskIndicator} Risk
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Capital Networks</h4>
                                        <div className="flex flex-col gap-2">
                                            {selectedActor.fundingSources.map((s: string) => (
                                                <div key={s} className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-800">
                                                    <Database size={14} className="text-indigo-500" /> {s}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Col */}
                                <div className="md:col-span-2">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                                        <FileWarning size={18} className={selectedActor.allegations.length > 0 ? 'text-amber-500' : 'text-slate-400'} />
                                        Recorded Allegations & Audit Queries
                                    </h4>

                                    {selectedActor.allegations.length > 0 ? (
                                        <div className="space-y-4">
                                            {selectedActor.allegations.map((alg: { date: string, description: string }, idx: number) => (
                                                <div key={idx} className="bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 p-4 rounded-xl">
                                                    <div className="flex items-center gap-2 text-[11px] font-bold text-amber-600 dark:text-amber-500 mb-2">
                                                        <Calendar size={14} /> {alg.date}
                                                    </div>
                                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{alg.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-slate-50 dark:bg-slate-950/50 p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                                            <Shield size={40} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                                            <p className="font-medium text-slate-900 dark:text-slate-200">No active allegations recorded.</p>
                                            <p className="text-sm text-slate-500 mt-1">Based on current ORPP and public audit datasets.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
