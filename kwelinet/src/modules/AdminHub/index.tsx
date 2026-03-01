import React, { useState } from 'react';
import { DatabaseBackup, Layers, ShieldCheck, Activity, Search, AlertCircle, FileVideo, CheckSquare, XSquare, MessageSquare, Fingerprint, Eye } from 'lucide-react';

const mockQueue = [
    { id: 'KWL-10A', actor: 'Hon. James Mwangi', riskScore: 88, type: 'video', status: 'Pending', date: '2026-03-01', subject: 'Suspicious campaign convoy' },
    { id: 'KWL-11B', actor: 'Hon. Fatuma Ali', riskScore: 94, type: 'document', status: 'Pending', date: '2026-03-01', subject: 'Leaked county rezoning memo' },
    { id: 'KWL-12C', actor: 'Unknown', riskScore: 42, type: 'image', status: 'Pending', date: '2026-02-28', subject: 'Rally cash handouts' },
    { id: 'KWL-09X', actor: 'Sen. Peter Kipkurui', riskScore: 12, type: 'video', status: 'Flagged', date: '2026-02-28', subject: 'Probably deepfake rally speech' },
    { id: 'KWL-08Y', actor: 'ORPP Official', riskScore: 76, type: 'document', status: 'Reviewed', date: '2026-02-27', subject: 'Fund disbursement irregularity' }
];

export default function AdminHub() {
    const [activeTab, setActiveTab] = useState('review');
    const [selectedSubmission, setSelectedSubmission] = useState<typeof mockQueue[0] | null>(null);

    const getRiskColor = (score: number) => {
        if (score >= 80) return 'text-red-600 bg-red-100 border-red-200';
        if (score >= 50) return 'text-amber-600 bg-amber-100 border-amber-200';
        return 'text-emerald-600 bg-emerald-100 border-emerald-200';
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">

            {/* Admin Sidebar */}
            <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col border-r border-slate-800 hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
                    <DatabaseBackup className="text-emerald-500 mr-2" size={20} />
                    <span className="font-bold text-white tracking-widest text-sm uppercase">Intelligence Hub</span>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-1">
                    <button
                        onClick={() => setActiveTab('review')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'review' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'hover:bg-slate-800 hover:text-white'}`}
                    >
                        <ShieldCheck size={18} /> Review Queue
                        {mockQueue.filter(q => q.status === 'Pending').length > 0 && (
                            <span className="ml-auto bg-emerald-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {mockQueue.filter(q => q.status === 'Pending').length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('verified')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Layers size={18} /> Verified DB
                    </button>
                    <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white opacity-50 cursor-not-allowed"
                        title="Feature locked in MVP"
                    >
                        <Activity size={18} /> System Logs
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-400">SA</div>
                        <div>
                            <p className="text-sm font-medium text-white">System Admin</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Node Active</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-x-hidden flex flex-col">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 md:hidden">
                    <div className="flex items-center gap-2">
                        <DatabaseBackup className="text-emerald-500" size={20} />
                        <span className="font-bold text-slate-900 tracking-widest text-sm uppercase">Intel Hub</span>
                    </div>
                </header>

                <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                    {activeTab === 'review' && (
                        <div className="max-w-6xl mx-auto animate-in fade-in duration-300">

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">Whistleblower Review Queue</h1>
                                    <p className="text-sm text-slate-500 mt-1">Process pending submissions for public ledger verification.</p>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search SubID or Actor..."
                                        className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-full md:w-64 shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Data Table */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-slate-600">
                                        <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold tracking-wider text-slate-500">
                                            <tr>
                                                <th className="px-6 py-4">Submission ID</th>
                                                <th className="px-6 py-4">Target Actor</th>
                                                <th className="px-6 py-4">Risk Score (AI)</th>
                                                <th className="px-6 py-4">File Type</th>
                                                <th className="px-6 py-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {mockQueue.map((item) => (
                                                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="px-6 py-4 font-mono font-medium text-slate-900">{item.id}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-slate-900">{item.actor}</div>
                                                        <div className="text-xs text-slate-500 truncate max-w-[200px]">{item.subject}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded border text-xs font-bold ${getRiskColor(item.riskScore)}`}>
                                                            {item.riskScore}%
                                                            {item.riskScore >= 80 && <AlertCircle size={12} className="ml-1" />}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded text-xs font-medium border border-slate-200 w-fit uppercase text-slate-600">
                                                            <FileVideo size={14} className="text-slate-400" /> {item.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => setSelectedSubmission(item)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded shadow-sm hover:bg-slate-50 text-slate-700 font-medium transition-colors hover:border-emerald-300 hover:text-emerald-700"
                                                        >
                                                            <Eye size={14} /> Review
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'verified' && (
                        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-200 rounded-xl border-dashed">
                            <Layers size={48} className="text-slate-300 mb-4" />
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Verified Database Access</h2>
                            <p className="text-slate-500 max-w-md">This section connects directly to the public ledger modules (Dashboard & Matrix). Direct editing of verified claims requires multisig authorization.</p>
                        </div>
                    )}

                </div>
            </main>

            {/* Verification Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm shadow-2xl">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 shadow-2xl border border-slate-200">

                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <div>
                                <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                    Submission Review <span className="text-slate-400 font-mono text-sm ml-2">[{selectedSubmission.id}]</span>
                                </h2>
                            </div>
                            <button onClick={() => setSelectedSubmission(null)} className="p-1 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded shadow-sm">
                                <XSquare size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 flex-1 overflow-y-auto bg-white flex flex-col md:flex-row gap-8">

                            {/* Left: Media Preview Placeholder */}
                            <div className="md:w-1/2 flex flex-col">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sanitized Media Payload</h3>
                                <div className="flex-1 bg-slate-950 rounded-xl overflow-hidden relative flex flex-col items-center justify-center min-h-[300px] border border-slate-800 shadow-inner group">
                                    <FileVideo size={48} className="text-slate-700 mb-2 z-10" />
                                    <span className="text-slate-500 font-mono text-xs z-10 uppercase">{selectedSubmission.type} Preview</span>
                                    <div className="absolute inset-0 bg-emerald-500/5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                            </div>

                            {/* Right: AI Analysis & Actions */}
                            <div className="md:w-1/2 flex flex-col">

                                <div className="mb-6">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Fingerprint size={14} className="text-emerald-500" /> AI Manipulation Probability</h3>
                                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-sm font-semibold text-slate-700">Deepfake / Tamper Score</span>
                                            <span className={`text-xl font-black font-mono ${getRiskColor(selectedSubmission.riskScore).split(' ')[0]}`}>{selectedSubmission.riskScore}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                            <div className={`h-2 rounded-full ${getRiskColor(selectedSubmission.riskScore).split(' ')[0].replace('text-', 'bg-')}`} style={{ width: `${selectedSubmission.riskScore}%` }}></div>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-3 border-t border-slate-200 pt-3">
                                            {selectedSubmission.riskScore >= 80 ? 'High probability of manipulation detected. Advise manual forensic review before publishing.' : 'Media signatures appear untampered. Audio/Visual coherence is stable.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-6 flex-1">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target & Context</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex gap-2 border-b border-slate-100 pb-2">
                                            <span className="text-slate-500 w-24">Actor:</span>
                                            <strong className="text-slate-900">{selectedSubmission.actor}</strong>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-slate-500 w-24">Subject:</span>
                                            <span className="text-slate-700 italic">"{selectedSubmission.subject}"</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 rounded-lg font-semibold text-sm transition-all shadow-sm">
                                        <CheckSquare size={16} /> Approve
                                    </button>
                                    <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 rounded-lg font-semibold text-sm transition-all shadow-sm">
                                        <MessageSquare size={16} /> Request Info
                                    </button>
                                    <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 hover:border-rose-300 rounded-lg font-semibold text-sm transition-all shadow-sm">
                                        <AlertCircle size={16} /> Quarantine
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
