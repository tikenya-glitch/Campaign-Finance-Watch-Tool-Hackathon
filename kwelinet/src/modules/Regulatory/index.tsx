import React, { useState } from 'react';
import { Scale, Map as MapIcon, ChevronDown, ChevronUp, Globe, Info, AlertOctagon, FileText } from 'lucide-react';

// We'd ideally load a real topojson of Kenya counties here. 
// For scaffolding/mock purposes, we'll try a generic Africa map focused on Kenya if a local file isn't present,
// or just a stylized placeholder box if the geojson is too large/complex for this prompt.
// We will use a stylized placeholder for the map to avoid heavy TopoJSON dependencies in this generated file.

const mockCountyData = [
    { id: '1', name: 'Nairobi', limit: 'KES 250M', risk: 'High' },
    { id: '2', name: 'Mombasa', limit: 'KES 150M', risk: 'High' },
    { id: '3', name: 'Kiambu', limit: 'KES 180M', risk: 'Medium' },
    { id: '4', name: 'Nakuru', limit: 'KES 160M', risk: 'Medium' },
    { id: '5', name: 'Turkana', limit: 'KES 120M', risk: 'Low' },
    { id: '6', name: 'Kisumu', limit: 'KES 140M', risk: 'Medium' },
];

export default function RegulatoryContext() {
    const [openAccordion, setOpenAccordion] = useState<string | null>('finance-act');
    const [activeCounty, setActiveCounty] = useState<typeof mockCountyData[0]>(mockCountyData[0]);

    const toggleAccordion = (id: string) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    return (
        <div className="p-6 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <Scale className="text-emerald-600" size={24} />
                    Regulatory Context & Legal Sandbox
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Understanding the legal frameworks governing political financing and accountability in Kenya.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Interactive Map & County Data */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                        <div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                <MapIcon size={18} className="text-emerald-500" /> Regional Campaign Spending Limits
                            </h2>
                            <span className="text-xs text-slate-500 font-medium">Interactive Topography</span>
                        </div>

                        <div className="flex-1 flex flex-col md:flex-row">
                            {/* Map Area Placeholder (Simulated with CSS for reliability without external heavy geojson files in generation) */}
                            <div className="flex-1 bg-slate-100 relative min-h-[300px] flex items-center justify-center p-8">
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-400 via-slate-100 to-slate-100"></div>

                                {/* Simulated Kenya Map Grid */}
                                <div className="relative w-full max-w-sm aspect-square grid grid-cols-3 grid-rows-3 gap-1 rotate-45 scale-75">
                                    {mockCountyData.map((c, i) => (
                                        <div
                                            key={c.id}
                                            onClick={() => setActiveCounty(c)}
                                            className={`
                                rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-center -rotate-45
                                shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] hover:scale-110 z-10
                                ${activeCounty.id === c.id ? 'bg-emerald-500 ring-4 ring-emerald-200 z-20 shadow-xl' : 'bg-slate-300 hover:bg-emerald-400'}
                             `}
                                            style={{
                                                // Deterministic position offset based on index
                                                transform: `rotate(-45deg) translate(${(i * 7 % 10) - 5}px, ${(i * 13 % 10) - 5}px)`
                                            }}
                                        >
                                            <span className="text-[10px] font-bold text-white drop-shadow-md hidden md:block">{c.name}</span>
                                        </div>
                                    ))}
                                    {/* Filler blocks to make a generic shape */}
                                    <div className="bg-slate-200 rounded-lg -rotate-45 opacity-50"></div>
                                    <div className="bg-slate-200 rounded-lg -rotate-45 opacity-50"></div>
                                    <div className="bg-slate-200 rounded-lg -rotate-45 opacity-50"></div>
                                </div>

                                <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur rounded p-2 text-[10px] text-slate-500 font-mono shadow-sm">
                                    GEO_SYS: KNY_TOPO_SIMULATED
                                </div>
                            </div>

                            {/* County Details Sidebar */}
                            <div className="w-full md:w-64 bg-white p-6 border-l border-slate-200 flex flex-col justify-center">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Selected County</h3>

                                {activeCounty ? (
                                    <div className="space-y-4 animate-in fade-in duration-300">
                                        <div>
                                            <p className="text-2xl font-bold text-slate-900">{activeCounty.name}</p>
                                            <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                County No. 00{activeCounty.id}
                                            </span>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100">
                                            <p className="text-xs text-slate-500 font-medium mb-1">Gubernatorial Spending Cap</p>
                                            <p className="text-lg font-mono font-bold text-emerald-600">{activeCounty.limit}</p>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100">
                                            <p className="text-xs text-slate-500 font-medium mb-1">Electoral Risk Profile</p>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${activeCounty.risk === 'High' ? 'bg-red-500' :
                                                    activeCounty.risk === 'Medium' ? 'bg-amber-400' : 'bg-emerald-500'
                                                    }`} />
                                                <span className="text-sm font-semibold text-slate-700">{activeCounty.risk}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">Select a county on the map to view financial regulations.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Accordions & Benchmarks */}
                <div className="space-y-6">

                    {/* Legal Accordions */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-200 bg-slate-50">
                            <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                <FileText size={18} className="text-emerald-500" /> Legislative Framework
                            </h2>
                        </div>
                        <div className="divide-y divide-slate-100">

                            {/* Accordion 1 */}
                            <div>
                                <button
                                    onClick={() => toggleAccordion('finance-act')}
                                    className="w-full p-4 flex justify-between items-center hover:bg-slate-50 transition-colors text-left"
                                >
                                    <span className={`font-semibold text-sm ${openAccordion === 'finance-act' ? 'text-emerald-600' : 'text-slate-800'}`}>
                                        Electoral Campaign Finance Act, 2013
                                    </span>
                                    {openAccordion === 'finance-act' ? <ChevronUp size={16} className="text-emerald-500" /> : <ChevronDown size={16} className="text-slate-400" />}
                                </button>
                                {openAccordion === 'finance-act' && (
                                    <div className="p-4 pt-0 text-sm text-slate-600 bg-slate-50/50 leading-relaxed border-t border-slate-50">
                                        Mandates the disclosure of campaign funds sources and sets spending limits for specific elective positions. Crucially, its implementation has been historically deferred by Parliament, severely limiting ORPP's enforcement capabilities.
                                    </div>
                                )}
                            </div>

                            {/* Accordion 2 */}
                            <div>
                                <button
                                    onClick={() => toggleAccordion('parties-act')}
                                    className="w-full p-4 flex justify-between items-center hover:bg-slate-50 transition-colors text-left"
                                >
                                    <span className={`font-semibold text-sm ${openAccordion === 'parties-act' ? 'text-emerald-600' : 'text-slate-800'}`}>
                                        Political Parties Act, 2011 (Article 27)
                                    </span>
                                    {openAccordion === 'parties-act' ? <ChevronUp size={16} className="text-emerald-500" /> : <ChevronDown size={16} className="text-slate-400" />}
                                </button>
                                {openAccordion === 'parties-act' && (
                                    <div className="p-4 pt-0 text-sm text-slate-600 bg-slate-50/50 leading-relaxed border-t border-slate-50">
                                        Outlines the sources of funds for a political party, including the Political Parties Fund. It restricts foreign donations and mandates annual independent audits by the Auditor-General.
                                    </div>
                                )}
                            </div>

                            {/* Accordion 3 */}
                            <div>
                                <button
                                    onClick={() => toggleAccordion('constitution')}
                                    className="w-full p-4 flex justify-between items-center hover:bg-slate-50 transition-colors text-left"
                                >
                                    <span className={`font-semibold text-sm ${openAccordion === 'constitution' ? 'text-emerald-600' : 'text-slate-800'}`}>
                                        Constitution of Kenya (Article 88)
                                    </span>
                                    {openAccordion === 'constitution' ? <ChevronUp size={16} className="text-emerald-500" /> : <ChevronDown size={16} className="text-slate-400" />}
                                </button>
                                {openAccordion === 'constitution' && (
                                    <div className="p-4 pt-0 text-sm text-slate-600 bg-slate-50/50 leading-relaxed border-t border-slate-50">
                                        Establishes the IEBC (Independent Electoral and Boundaries Commission) and tasks it with the regulation of the amount of money that may be spent by or on behalf of a candidate or party in respect of any election.
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Global Benchmark Callout */}
                    <div className="bg-slate-900 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-800 relative overflow-hidden text-slate-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>

                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Globe size={18} className="text-emerald-400" /> Global Benchmark
                        </h3>

                        <div className="space-y-4 text-sm relative z-10">
                            <div className="flex gap-3 items-start">
                                <AlertOctagon size={16} className="text-rose-400 shrink-0 mt-0.5" />
                                <p><strong className="text-white">Corporate Bans:</strong> Unlike 29% of nations globally, Kenya <span className="text-rose-400 font-semibold">does not prohibit</span> corporate donations to political parties, creating high vectors for state capture.</p>
                            </div>
                            <div className="flex gap-3 items-start">
                                <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
                                <p><strong className="text-white">Anonymous Donations:</strong> Kenya limits anonymous donations to KES 1M, reflecting tighter controls than the regional average, but enforcement remains low.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Sub Footer */}
            <div className="mt-8 text-center border-t border-slate-200 pt-6">
                <p className="text-xs text-slate-400">
                    Regulatory framework data benchmarked against International IDEA’s Political Finance Database.
                </p>
            </div>
        </div>
    );
}
