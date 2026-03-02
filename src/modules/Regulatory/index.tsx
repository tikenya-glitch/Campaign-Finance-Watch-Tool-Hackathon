import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
import { Plus, Minus, Menu, Info, ChevronLeft, ChevronRight } from 'lucide-react';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Mock Data Interfaces
interface RegulationItem {
    id: number;
    question: string;
    code: string;
    comment: string;
    source: string;
}

type Categories = 'Bans and limits on private income' | 'Public funding' | 'Regulations of spending' | 'Reporting, oversight and sanctions';

// Extracted from the mockup images
const mockData: Record<string, Record<Categories, RegulationItem[]>> = {
    '2018': {
        'Bans and limits on private income': [
            {
                id: 1,
                question: '1. Is there a ban on donations from foreign interests to political parties?',
                code: 'Yes',
                comment: "Section 28(1) of the political parties' Act 2011 (Revised Edition 2015) states that a political party which receives funds from a non-citizen contrary to section 27(1)(c), commits an offence.",
                source: "Political Parties Act 2011"
            },
            {
                id: 2,
                question: '2. Is there a ban on donations from foreign interests to candidates?',
                code: 'No',
                comment: "Although not clearly stated in law, section 27 (2) of the Political Parties Act 2011 states that a foreign agency, or a foreign political party which shares an ideology with a political party registered in Kenya, may provide technical assistance to that political party. It may be seen that this section does not explicitly talk about donations to individuals but to a political party.",
                source: "Political Parties Act 2011"
            },
            {
                id: 3,
                question: '3. Is there a ban on corporate donations to political parties?',
                code: 'No',
                comment: "Section 27(1)(c) of the Political Parties Act 2011 on other sources of funding to political parties provides that the sources of other funds for a political party are donations, bequests and grants from any other lawful source, not being from a non-citizen, foreign government, inter-governmental or non-governmental organisation.",
                source: "Political Parties Act 2011"
            },
            {
                id: 4,
                question: '4. Is there a ban on corporate donations to candidates?',
                code: 'No',
                comment: "Section 11 of the Election Campaign Financing Act 2013 provides that the sources of funds for purposes of financing party nomination, election or referendum campaign are—\n(a) contributions received from any person, political party or any other lawful source;\n\n(2) A person who, during an election period, accepts or agrees to accept a bribe that is offered in the circumstances described above commits an offence.",
                source: "Election Campaign Financing Act 2013\nElection Offences Act 2016"
            }
        ],
        'Public funding': [],
        'Regulations of spending': [
            {
                id: 39,
                question: '39. Are there limits on the amount a political party can spend?',
                code: 'Yes',
                comment: "Section 18 of the Election Campaign Financing Act 2013 states that the Independent Electoral and Boundaries Commission shall, at least twelve months before an election, by notice in the Gazette, prescribe the spending limits including the total amount that a candidate, political party or referendum committee may spend during an expenditure period, including the limit for media coverage.",
                source: "Election Campaign Financing Act 2013"
            },
            {
                id: 40,
                question: '40. If there are limits on the amount a political party can spend, what is the limit?',
                code: 'Not applicable',
                comment: "The limit varies. The Election Campaign Financing Act 2013 stipulates that the Commission shall, in prescribing spending limits under subsection take into consideration—\n(a) geographical features and urban centres;\n(b) the type of election;\n(c) the population in an electoral area;",
                source: "Election Campaign Financing Act 2013"
            }
        ],
        'Reporting, oversight and sanctions': [
            {
                id: 49,
                question: '49. Do candidates have to report on their election campaign finances?',
                code: 'Yes',
                comment: "Election Campaign Financing Act 2013 states that the party expenditure committee shall compile the expenditure reports received from the party candidates and submit to the Commission the preliminary nomination expenditure report and the final campaign expenditure report; and submit to the Commission the final campaign expenditure report of the political party.",
                source: "Election Campaign Financing Act 2013"
            },
            {
                id: 50,
                question: '50. Do third parties have to report on election campaign finances?',
                code: 'No',
                comment: "It is candidates, political parties or referendum committees that are supposed to disclose that to the Independent Electoral and Boundaries Commission.",
                source: ""
            },
            {
                id: 51,
                question: '51. Is information in reports from political parties and/or candidates to be made public?',
                code: 'Yes',
                comment: "The law requires that any person shall be entitled to inspect the audited accounts of political parties filed by a political party and, upon payment of a fee prescribed by the Registrar be issued copies of the audited accounts.",
                source: "Political Parties Act 2011"
            },
            {
                id: 52,
                question: '52. Must reports from political parties and/or candidates reveal the identity of donors?',
                code: 'Yes',
                comment: "As stipulated in section 29 of the Political Parties Act 2011 on publishing sources of funds. It states that a political party shall, within ninety days of the end of its financial year, publish—\n(a) the sources of its funds stating—\n(i) the amount of money received from the Fund;\n(ii) the amount of money received from its members and supporters; and\n(iii) the amount and sources of the donations given to the party;",
                source: "Political Parties Act 2011"
            }
        ]
    }
}

export default function RegulatoryContext() {
    const years = ['2016', '2018', '2023'];
    const categories: Categories[] = [
        'Bans and limits on private income',
        'Public funding',
        'Regulations of spending',
        'Reporting, oversight and sanctions'
    ];

    const [activeYear, setActiveYear] = useState<string>('2018');
    const [activeCategory, setActiveCategory] = useState<Categories>('Bans and limits on private income');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    // Zoom map state - Start far away, animate closer to Kenya
    const [position, setPosition] = useState({ coordinates: [37.9062, 0.0236] as [number, number], zoom: 1 });

    useEffect(() => {
        // Trigger camera focus effect on mount
        const timer = setTimeout(() => {
            setPosition({ coordinates: [37.9062, 0.0236], zoom: 5.5 });
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    // Reset pagination when year or category changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeYear, activeCategory]);

    const handleZoomIn = () => {
        if (position.zoom >= 15) return;
        setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.5 }));
    };

    const handleZoomOut = () => {
        if (position.zoom <= 1) return;
        setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.5 }));
    };

    // Safely get data. In a real app we'd fetch this.
    const currentData = mockData[activeYear]?.[activeCategory] || [];
    const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);
    const paginatedData = currentData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="bg-white min-h-screen text-slate-800 font-sans">
            {/* Header */}
            <div className="flex items-center gap-3 p-6 border-b border-slate-200">
                {/* Kenya flag proper external SVG */}
                <img
                    src="https://flagcdn.com/ke.svg"
                    alt="Flag of Kenya"
                    className="w-10 h-7 object-cover border border-slate-300 shadow-sm rounded-sm"
                />
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Kenya</h1>
            </div>

            <div className="p-6 max-w-7xl mx-auto space-y-8">
                {/* The Map Section */}
                <div className="border border-slate-200 relative bg-[#f1f5f8] rounded overflow-hidden shadow-sm" style={{ height: '400px' }}>
                    {/* Map Controls */}
                    <div className="absolute top-4 left-4 z-10 flex flex-col bg-white border border-slate-300 rounded shadow-sm">
                        <button onClick={handleZoomIn} className="p-1 hover:bg-slate-100 border-b border-slate-300 text-slate-600"><Plus size={16} /></button>
                        <button onClick={handleZoomOut} className="p-1 hover:bg-slate-100 text-slate-600"><Minus size={16} /></button>
                    </div>
                    <div className="absolute top-4 right-4 z-10 bg-white border border-slate-300 p-1 rounded shadow-sm text-slate-600 hover:bg-slate-100 cursor-pointer">
                        <Menu size={16} />
                    </div>

                    {/* Actual Map using TopoJSON */}
                    <ComposableMap
                        projection="geoMercator"
                        projectionConfig={{
                            scale: 200,
                        }}
                        width={900}
                        height={400}
                        style={{ width: "100%", height: "100%" }}
                    >
                        <ZoomableGroup
                            zoom={position.zoom}
                            center={position.coordinates as [number, number]}
                            onMoveEnd={(pos: { coordinates: [number, number]; zoom: number }) => setPosition({ coordinates: pos.coordinates, zoom: pos.zoom })}
                        >
                            <Geographies geography={geoUrl}>
                                {({ geographies }: { geographies: any[] }) =>
                                    geographies.map((geo: any) => (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            // "114" is Burundi, "404" is Kenya in ISO 3166-1 numeric 
                                            fill={geo.id === "404" || geo.properties.name === "Kenya" ? "#0f4277" : "#cbd5e1"}
                                            stroke="#ffffff"
                                            strokeWidth={0.5}
                                            style={{
                                                default: { outline: "none" },
                                                hover: { fill: geo.properties.name === "Kenya" ? "#0c3563" : "#b4c3d3", outline: "none" },
                                                pressed: { outline: "none" },
                                            }}
                                        />
                                    ))
                                }
                            </Geographies>

                            {/* Marker on Kenya */}
                            <Marker coordinates={[37.9062, 0.0236]}>
                                {/* Custom Tooltip Pin */}
                                <g transform="translate(-15, -30)">
                                    <rect x="0" y="0" width="40" height="20" fill="white" stroke="#ccc" strokeWidth="1" rx="2" />
                                    <path d="M 15 20 L 20 25 L 25 20 Z" fill="white" stroke="#ccc" strokeWidth="1" strokeDasharray="50, 5, 0" />
                                    <line x1="16" y1="20" x2="24" y2="20" stroke="white" strokeWidth="2" />
                                    <circle cx="8" cy="10" r="2" fill="#0f4277" />
                                    <text x="14" y="13" fontSize="8" fill="#333" fontFamily="Arial">Kenya</text>
                                </g>
                            </Marker>
                        </ZoomableGroup>
                    </ComposableMap>
                    <div className="absolute bottom-2 right-2 text-[9px] text-slate-400">Highcharts.com © Natural Earth (Simulated via D3)</div>
                </div>

                {/* About the Database Intro Card */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-6 flex flex-col gap-4 shadow-sm mb-2 mt-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#379dec]/10 text-[#379dec] rounded-lg">
                            <Info size={22} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">About this database</h2>
                    </div>
                    <div className="text-slate-600 leading-relaxed text-sm space-y-4">
                        <p>
                            <span className="font-semibold text-slate-800">International IDEA's Political Finance Database</span> is the leading global resource of comparative political finance data for those interested in money in politics and has been since its launch in 2003.
                        </p>
                        <p>
                            The Database provides answers to fundamental questions on political finance within four broad categories: <strong>a) Bans and Limits on Private Income, b) Public Funding, c) Regulations on Spending, and d) Reporting, Oversight and Sanctions.</strong> The Database provides country-specific data tailored for Kenya, allowing users to view the prevalence of different regulations and provisions, customize their search, and download the data. It is our intention that this tool is used by legislators, regulators, political party officials, civil society activists, journalists, researchers, and concerned citizens.
                        </p>
                    </div>
                </div>

                {/* Years Tabs */}
                <div className="flex gap-4 border-b border-transparent items-center pt-2">
                    {years.map(year => (
                        <button
                            key={year}
                            onClick={() => setActiveYear(year)}
                            className={`px-4 py-2 font-bold text-sm transition-colors ${activeYear === year ? 'bg-[#379dec] text-white rounded shadow-sm' : 'text-slate-600 hover:bg-slate-100 rounded bg-transparent'}`}
                        >
                            {year}
                        </button>
                    ))}
                </div>

                {/* Categories Tabs */}
                <div className="flex gap-1 border-b border-slate-200 mt-2 mb-6 overflow-x-auto pb-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-3 font-bold text-sm transition-colors whitespace-nowrap border-b-2 ${activeCategory === cat ? 'bg-[#379dec] text-white rounded-t border-[#379dec]' : 'text-slate-600 bg-transparent hover:bg-slate-50 border-transparent'} `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Data Table */}
                <div className="w-full">
                    <table className="w-full text-left text-sm text-slate-700 bg-white">
                        <thead className="bg-[#a8b1c4] text-slate-800 border-t border-slate-300">
                            <tr>
                                <th className="p-4 font-bold w-[40%]">Question</th>
                                <th className="p-4 font-bold w-[60%]">Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white border-b border-slate-200">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((row, idx) => (
                                    <tr key={row.id} className={idx % 2 === 0 ? 'bg-[#fcfcfc]' : 'bg-[#fcfcfc]'} style={{ borderBottom: '10px solid white' }}>
                                        <td className="p-4 align-top border-r border-white font-medium pr-10">
                                            {row.question}
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="flex flex-col gap-4">
                                                <div>
                                                    <span className="font-bold text-xs text-slate-900 block mb-1">Code</span>
                                                    <span className="text-slate-700">{row.code}</span>
                                                </div>
                                                <div>
                                                    <span className="font-bold text-xs text-slate-900 block mb-1">Comment</span>
                                                    <span className="text-slate-700 leading-relaxed whitespace-pre-wrap">{row.comment}</span>
                                                </div>
                                                {row.source && (
                                                    <div>
                                                        <span className="font-bold text-xs text-slate-900 block mb-1">Source</span>
                                                        <span className="text-slate-700 whitespace-pre-wrap">{row.source}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="p-8 text-center text-slate-500 italic bg-slate-50">
                                        No data available for {activeCategory} in {activeYear}.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-b border-l border-r border-slate-200 bg-slate-50 rounded-b-lg">
                            <span className="text-sm text-slate-500 font-medium">
                                Showing <span className="text-slate-700">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-slate-700">{Math.min(currentPage * ITEMS_PER_PAGE, currentData.length)}</span> of <span className="text-slate-700">{currentData.length}</span> entries
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                >
                                    <ChevronLeft size={16} /> Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                >
                                    Next <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
