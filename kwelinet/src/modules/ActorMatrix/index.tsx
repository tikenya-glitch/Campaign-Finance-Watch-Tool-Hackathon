import React, { useState } from 'react';
import { Search, Filter, Shield, AlertTriangle, CheckCircle, ChevronRight, MapPin, Briefcase, FileWarning, Calendar } from 'lucide-react';
import { mockActors } from '../../data/mockActorData';

export default function ActorMatrix() {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [countyFilter, setCountyFilter] = useState('All Counties');
    const [selectedActor, setSelectedActor] = useState<typeof mockActors[0] | null>(null);

    // Filter logic
    const filteredActors = mockActors.filter(actor => {
        const matchesSearch = actor.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All Roles' || actor.role === roleFilter;
        const matchesCounty = countyFilter === 'All Counties' || actor.county === countyFilter;
        return matchesSearch && matchesRole && matchesCounty;
    });

    // Extract unique roles and counties for dropdowns
    const roles = ['All Roles', ...Array.from(new Set(mockActors.map(a => a.role)))];
    const counties = ['All Counties', ...Array.from(new Set(mockActors.map(a => a.county)))];

    // Helper for risk badge colors
    const getRiskColor = (indicator: string) => {
        switch (indicator) {
            case 'Red': return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
            case 'Yellow': return 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]';
            case 'Green': return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
            default: return 'bg-slate-400';
        }
    };

    const getRiskLabel = (indicator: string) => {
        switch (indicator) {
            case 'Red': return 'Active Allegations';
            case 'Yellow': return 'Under Review';
            case 'Green': return 'Clear';
            default: return 'Unknown';
        }
    };

    return (
        <div className="p-6 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <Shield className="text-emerald-600" size={24} />
                    Political Actor Matrix
                </h1>
                <p className="text-slate-500 text-sm mt-1">High-density intelligence grid tracking elected individual integrity and campaign capital mobilization.</p>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by actor name..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-48">
                        <select
                            className="w-full appearance-none pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 text-slate-700 font-medium"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            {roles.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    <div className="relative w-full md:w-48">
                        <select
                            className="w-full appearance-none pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 text-slate-700 font-medium"
                            value={countyFilter}
                            onChange={(e) => setCountyFilter(e.target.value)}
                        >
                            {counties.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Data Grid / Actor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredActors.map(actor => (
                    <div
                        key={actor.id}
                        onClick={() => setSelectedActor(actor)}
                        className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group flex flex-col h-full relative"
                    >
                        {/* Risk Badge Absolute positioned */}
                        <div
                            className={`absolute top-4 right-4 w-3 h-3 rounded-full ${getRiskColor(actor.riskIndicator)}`}
                            title={getRiskLabel(actor.riskIndicator)}
                        />

                        <div className="p-5 flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 font-bold text-xl overflow-hidden">
                                    {/* Fallback to Initials */}
                                    {actor.name.split(' ').slice(-2).map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">{actor.name}</h3>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                        <span className="font-semibold text-slate-700">{actor.role}</span>
                                        <span>•</span>
                                        <span>{actor.county}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Term Limit Progress (Only show for limited roles like Governor in MVP) */}
                            {actor.termLimit.max !== Infinity && (
                                <div className="mb-4">
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="text-slate-500 font-medium">Term {actor.termLimit.current} of {actor.termLimit.max}</span>
                                        <span className={`font-semibold ${actor.termLimit.current === actor.termLimit.max ? 'text-amber-600' : 'text-slate-700'}`}>
                                            Year {actor.termLimit.yearsIn}/10
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className={`h-1.5 rounded-full ${actor.termLimit.current === actor.termLimit.max ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                            style={{ width: `${(actor.termLimit.yearsIn / actor.termLimit.totalYears) * 100}%` }}
                                        />
                                    </div>
                                    {actor.termLimit.current === actor.termLimit.max && (
                                        <p className="text-[10px] text-amber-600 font-medium mt-1 uppercase tracking-wider">Ineligible for Re-election</p>
                                    )}
                                </div>
                            )}

                            {/* Funding Tags */}
                            <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-slate-50">
                                {actor.fundingSources.map(source => (
                                    <span key={source} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] uppercase font-bold tracking-wider rounded border border-slate-200">
                                        {source}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-between items-center group-hover:bg-slate-100 transition-colors">
                            <span className="text-xs font-semibold text-slate-500">Party: <span className="text-slate-800">{actor.party}</span></span>
                            <ChevronRight size={16} className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                ))}

                {filteredActors.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
                        No actors found matching the current filters.
                    </div>
                )}
            </div>

            {/* Expanded View Modal */}
            {selectedActor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-200 flex justify-between items-start bg-slate-50">
                            <div className="flex gap-5 items-center">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-slate-200 text-slate-400 font-bold text-2xl shadow-sm">
                                    {selectedActor.name.split(' ').slice(-2).map((n: string) => n[0]).join('')}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">{selectedActor.name}</h2>
                                    <div className="flex items-center gap-3 mt-2 text-sm text-slate-600 font-medium">
                                        <span className="flex items-center gap-1"><Briefcase size={14} className="text-slate-400" /> {selectedActor.role}</span>
                                        <span className="flex items-center gap-1"><MapPin size={14} className="text-slate-400" /> {selectedActor.county}</span>
                                        <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs font-bold shadow-sm">{selectedActor.party}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedActor(null)}
                                className="text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-md p-1.5 shadow-sm"
                            >
                                Close
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto flex-1 bg-white">

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Left Col: Timeline & Stats */}
                                <div className="md:col-span-1 space-y-6">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Integrity Status</h4>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${getRiskColor(selectedActor.riskIndicator)}`} />
                                            <span className="font-semibold text-slate-700 text-sm">{getRiskLabel(selectedActor.riskIndicator)}</span>
                                        </div>
                                    </div>

                                    {selectedActor.termLimit.max !== Infinity && (
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Constitutional Limits</h4>
                                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                                <p className="text-sm font-semibold text-slate-800 mb-1">Term {selectedActor.termLimit.current} of {selectedActor.termLimit.max}</p>
                                                <p className="text-xs text-slate-500">Year {selectedActor.termLimit.yearsIn} of absolute {selectedActor.termLimit.totalYears} year maximum.</p>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Capital Networks</h4>
                                        <div className="flex flex-col gap-2">
                                            {selectedActor.fundingSources.map((s: string) => (
                                                <div key={s} className="flex items-center gap-2 text-sm text-slate-700">
                                                    <CheckCircle size={14} className="text-emerald-500" /> {s}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Col: Allegations & Details */}
                                <div className="md:col-span-2">
                                    <h4 className="text-sm border-b border-slate-200 pb-2 font-bold text-slate-900 flex items-center gap-2 mb-4">
                                        <FileWarning size={16} className={selectedActor.allegations.length > 0 ? 'text-amber-500' : 'text-slate-300'} />
                                        Misappropriation Allegations & Audit Queries
                                    </h4>

                                    {selectedActor.allegations.length > 0 ? (
                                        <div className="space-y-4">
                                            {selectedActor.allegations.map((alg: { date: string, description: string }, idx: number) => (
                                                <div key={idx} className="flex gap-4 relative">
                                                    {/* Timeline connector line */}
                                                    {idx !== selectedActor.allegations.length - 1 && (
                                                        <div className="absolute left-[11px] top-6 bottom-[-16px] w-[1px] bg-slate-200"></div>
                                                    )}
                                                    <div className="mt-1">
                                                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center relative z-10">
                                                            <AlertTriangle size={10} className="text-amber-600" />
                                                        </div>
                                                    </div>
                                                    <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-lg flex-1">
                                                        <div className="flex items-center gap-2 text-xs text-amber-700 font-semibold mb-1">
                                                            <Calendar size={12} /> {alg.date}
                                                        </div>
                                                        <p className="text-sm text-slate-700">{alg.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-center flex flex-col items-center justify-center text-slate-500">
                                            <Shield size={32} className="text-slate-300 mb-2" />
                                            <p className="text-sm font-medium text-slate-700">No active allegations recorded.</p>
                                            <p className="text-xs mt-1">Based on current ORPP and public audit datasets.</p>
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
