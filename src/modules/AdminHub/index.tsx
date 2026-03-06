import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { DatabaseBackup, Layers, ShieldCheck, Search, FileVideo, CheckSquare, XSquare, Fingerprint, Eye, Lock, UploadCloud, Edit3, Send, LogOut } from 'lucide-react';

const mockQueue = [
    { id: 'KWL-10A', actor: 'Hon. James Mwangi', riskScore: 88, type: 'video', status: 'Pending', date: '2026-03-01', subject: 'Suspicious campaign convoy', description: 'Raw 4K footage of aides dispensing KES 1000 notes disguised as transport logistics.' },
    { id: 'KWL-11B', actor: 'Hon. Fatuma Ali', riskScore: 94, type: 'document', status: 'Pending', date: '2026-03-01', subject: 'Leaked county rezoning memo', description: 'Internal memo linking rezoning approvals to campaign kickbacks.' },
    { id: 'KWL-12C', actor: 'Unknown Target', riskScore: 42, type: 'image', status: 'Pending', date: '2026-02-28', subject: 'Rally cash handouts', description: 'Photos of supporters receiving envelopes at a youth rally.' }
];

export default function AdminHub() {
    const [activeTab, setActiveTab] = useState('review');
    const [selectedSubmission, setSelectedSubmission] = useState<typeof mockQueue[0] | null>(null);
    const [editingApproval, setEditingApproval] = useState<typeof mockQueue[0] | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsCheckingAuth(false);
            } else {
                navigate('/auth');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    // Entity Management State
    const [entityType, setEntityType] = useState('Financial Flow Ledger');

    const getRiskColor = (score: number) => {
        if (score >= 80) return 'dark:text-rose-400 text-rose-600 dark:bg-rose-500/10 bg-rose-100 dark:border-rose-500/30 border-rose-200';
        if (score >= 50) return 'dark:text-amber-400 text-amber-600 dark:bg-amber-500/10 bg-amber-100 dark:border-amber-500/30 border-amber-200';
        return 'dark:text-emerald-400 text-emerald-600 dark:bg-emerald-500/10 bg-emerald-100 dark:border-emerald-500/30 border-emerald-200';
    };

    const handleApprove = () => {
        if (selectedSubmission) {
            setEditingApproval(selectedSubmission);
            setSelectedSubmission(null);
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-mono text-sm tracking-widest uppercase">
                <div className="flex flex-col items-center gap-4">
                    <DatabaseBackup className="animate-pulse text-rose-500" size={32} />
                    Verifying Credentials...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen dark:bg-slate-950 bg-slate-100 flex flex-col md:flex-row font-sans text-slate-900 dark:text-slate-100">

            {/* Admin Sidebar */}
            <aside className="w-full md:w-64 dark:bg-slate-900 bg-white dark:text-slate-300 text-slate-600 flex-shrink-0 flex-col border-r dark:border-slate-800 border-slate-200 hidden md:flex z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                <div className="h-16 flex items-center px-6 border-b dark:border-slate-800 border-slate-200 dark:bg-slate-950 bg-slate-50">
                    <DatabaseBackup className="dark:text-rose-500 text-rose-600 mr-2" size={20} />
                    <span className="font-bold dark:text-white text-slate-900 tracking-widest text-sm uppercase font-mono">Intel Hub</span>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('review')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold tracking-tight transition-all ${activeTab === 'review' ? 'bg-rose-500/10 dark:text-rose-400 text-rose-600 border dark:border-rose-500/20 border-rose-200 shadow-sm' : 'dark:hover:bg-slate-800 hover:bg-slate-100 dark:hover:text-white hover:text-slate-900'}`}
                    >
                        <ShieldCheck size={18} className={activeTab === 'review' ? 'dark:text-rose-400 text-rose-600' : ''} /> Review Queue
                    </button>
                    <button
                        onClick={() => setActiveTab('records')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold tracking-tight transition-all ${activeTab === 'records' ? 'bg-rose-500/10 dark:text-rose-400 text-rose-600 border dark:border-rose-500/20 border-rose-200 shadow-sm' : 'dark:hover:bg-slate-800 hover:bg-slate-100 dark:hover:text-white hover:text-slate-900'}`}
                    >
                        <Lock size={18} className={activeTab === 'records' ? 'dark:text-rose-400 text-rose-600' : ''} /> Entity Management
                    </button>
                </nav>

                {/* Admin Sign Out Footer */}
                <div className="p-4 border-t dark:border-slate-800 border-slate-200">
                    <button
                        onClick={async () => {
                            await signOut(auth);
                            navigate('/');
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold tracking-tight text-white bg-rose-600 hover:bg-rose-500 dark:bg-rose-500/20 dark:hover:bg-rose-500/30 dark:text-rose-400 border border-transparent dark:border-rose-500/30 transition-all shadow-sm"
                    >
                        <LogOut size={18} /> Sign Out Admin
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto flex flex-col h-screen">
                <div className="p-6 md:p-8 flex-1">
                    {/* REVIEW QUEUE TAB */}
                    {activeTab === 'review' && !editingApproval && (
                        <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold dark:text-white text-slate-900 tracking-tight">Whistleblower Verification Queue</h1>
                                    <p className="text-sm dark:text-slate-400 text-slate-500 mt-2 font-mono tracking-tight">Review pending evidence payloads before authorizing Wall of Shame listing.</p>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-slate-500 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search SubID or Actor..."
                                        className="pl-9 pr-4 py-2 dark:bg-slate-900 bg-white border dark:border-slate-700 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-rose-500 w-full md:w-64"
                                    />
                                </div>
                            </div>

                            {/* Data Table */}
                            <div className="pulse-card rounded-xl shadow-sm border dark:border-slate-800 border-slate-200 overflow-hidden bg-white dark:bg-slate-900">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left dark:text-slate-300 text-slate-600 whitespace-nowrap">
                                        <thead className="dark:bg-slate-950 bg-slate-50 border-b dark:border-slate-800 border-slate-200 text-[10px] uppercase font-bold tracking-widest text-slate-500 font-mono">
                                            <tr>
                                                <th className="px-6 py-4">Ref ID</th>
                                                <th className="px-6 py-4">Political Target</th>
                                                <th className="px-6 py-4">AI Tamper Risk</th>
                                                <th className="px-6 py-4">Payload</th>
                                                <th className="px-6 py-4">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y dark:divide-slate-800/50 divide-slate-100 font-sans">
                                            {mockQueue.map((item) => (
                                                <tr key={item.id} className="dark:hover:bg-slate-800/50 hover:bg-slate-50/80 transition-colors group">
                                                    <td className="px-6 py-4 font-mono font-bold">{item.id}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold dark:text-slate-200 text-slate-900">{item.actor}</div>
                                                        <div className="text-xs dark:text-slate-500 text-slate-500 truncate max-w-[200px] mt-0.5">{item.subject}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded border text-[10px] font-black tracking-widest font-mono ${getRiskColor(item.riskScore)}`}>
                                                            {item.riskScore}% Probability
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="flex items-center gap-1.5 px-2 py-1 dark:bg-slate-800 bg-slate-100 rounded text-[10px] font-bold tracking-widest border border-transparent w-fit uppercase">
                                                            <FileVideo size={14} /> {item.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => setSelectedSubmission(item)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 dark:bg-slate-950 bg-white border dark:border-slate-700 border-slate-300 rounded shadow-sm text-xs uppercase tracking-widest font-bold dark:hover:border-rose-500 hover:border-rose-400 transition-colors"
                                                        >
                                                            <Eye size={14} /> Triage
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

                    {/* EDIT POST-APPROVAL PIPELINE */}
                    {activeTab === 'review' && editingApproval && (
                        <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold dark:text-emerald-400 text-emerald-600 tracking-tight flex items-center gap-2">
                                        <CheckSquare size={24} /> Claim Approved - Finalize Listing
                                    </h1>
                                    <p className="text-sm dark:text-slate-400 text-slate-500 mt-2 font-mono tracking-tight">Draft the public Wall of Shame incident card before broadcasting.</p>
                                </div>
                                <button onClick={() => setEditingApproval(null)} className="px-4 py-2 border dark:border-slate-700 border-slate-300 rounded shadow-sm font-bold text-xs uppercase tracking-widest dark:bg-slate-900 bg-white hover:bg-slate-50 transition-colors">Abort</button>
                            </div>

                            <div className="pulse-card bg-white dark:bg-slate-900 border dark:border-slate-800 border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest dark:text-slate-400 text-slate-500 mb-2">Target Politician</label>
                                        <input type="text" defaultValue={editingApproval.actor} className="w-full px-4 py-3 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 dark:text-white text-slate-900 font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest dark:text-slate-400 text-slate-500 mb-2">Incident Location</label>
                                        <input type="text" placeholder="e.g. Rally Ground" className="w-full px-4 py-3 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 dark:text-white text-slate-900 font-bold" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold uppercase tracking-widest dark:text-slate-400 text-slate-500 mb-2">Public Title Summary</label>
                                        <input type="text" defaultValue={editingApproval.subject} className="w-full px-4 py-3 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 dark:text-white text-slate-900 font-bold" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold uppercase tracking-widest dark:text-slate-400 text-slate-500 mb-2">Detailed Verdict & Explanation</label>
                                        <textarea rows={4} defaultValue={editingApproval.description} className="w-full px-4 py-3 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 dark:text-white text-slate-900 font-sans leading-relaxed"></textarea>
                                    </div>
                                </div>

                                <div className="border-2 border-dashed dark:border-slate-700 border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center dark:bg-slate-950/50 bg-slate-50 mb-8 cursor-pointer hover:border-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors group">
                                    <UploadCloud size={40} className="dark:text-slate-500 text-slate-400 group-hover:text-rose-500 transition-colors mb-3" />
                                    <h4 className="text-sm font-bold dark:text-slate-300 text-slate-800">Attach Public Verification Image</h4>
                                    <p className="text-xs dark:text-slate-500 text-slate-500 mt-1">Upload verified evidence frame to serve as card header.</p>
                                </div>

                                <div className="flex justify-end pt-4 border-t dark:border-slate-800 border-slate-100">
                                    <button onClick={() => setEditingApproval(null)} className="px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20 transition-all flex items-center gap-2">
                                        <Send size={16} /> Publish to Wall of Shame
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ENTITY MANAGEMENT TAB */}
                    {activeTab === 'records' && (
                        <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold dark:text-white text-slate-900 tracking-tight">System Entity Provisioning</h1>
                                <p className="text-sm dark:text-slate-400 text-slate-500 mt-2 font-mono tracking-tight">Inject new verified datasets directly into the respective public modules.</p>
                            </div>

                            <div className="pulse-card rounded-xl p-6 md:p-8 border dark:border-slate-800 border-slate-200 bg-white dark:bg-slate-900 shadow-sm">
                                <div className="mb-8 p-4 dark:bg-slate-950 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200">
                                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest dark:text-slate-400 text-slate-500 mb-3 ml-1"><Layers size={14} /> Target Core Module</label>
                                    <select
                                        className="w-full md:w-1/2 pl-4 pr-10 py-3 dark:bg-slate-900 bg-white border dark:border-slate-700 border-slate-300 rounded-lg text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 dark:text-white text-slate-900 font-bold"
                                        value={entityType}
                                        onChange={e => setEntityType(e.target.value)}
                                    >
                                        <option>Financial Flow Ledger</option>
                                        <option>Actor Matrix Database</option>
                                        <option>Regulatory Framework Item</option>
                                    </select>
                                </div>

                                <div className="border-t dark:border-slate-800 border-slate-200 pt-6 mb-6">
                                    <h3 className="text-xs font-bold uppercase tracking-widest dark:text-rose-400 text-rose-600 mb-5 flex items-center gap-2"><Edit3 size={14} /> New Record Pipeline</h3>

                                    {/* CONDITIONAL FORMS BASED ON MODULE SELECT */}
                                    {entityType === 'Financial Flow Ledger' && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-left-4 duration-300">
                                            <div>
                                                <label className="block text-xs font-semibold dark:text-slate-400 text-slate-500 mb-2">Donor / Origin Name</label>
                                                <input type="text" placeholder="e.g. Zenith Logistics Ltd" className="w-full px-4 py-2.5 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-rose-500 dark:text-white text-slate-900 font-mono" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold dark:text-slate-400 text-slate-500 mb-2">Recipient Party</label>
                                                <select className="w-full px-4 py-2.5 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-rose-500 dark:text-white text-slate-900 font-mono">
                                                    <option>UDA</option>
                                                    <option>ODM</option>
                                                    <option>Jubilee</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold dark:text-slate-400 text-slate-500 mb-2">Declared Amount (KES)</label>
                                                <input type="number" placeholder="5,000,000" className="w-full px-4 py-2.5 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-rose-500 dark:text-white text-slate-900 font-mono" />
                                            </div>
                                            <div className="md:col-span-3">
                                                <label className="block text-xs font-semibold dark:text-slate-400 text-slate-500 mb-2">Date Frame</label>
                                                <input type="date" className="w-full md:w-1/3 px-4 py-2.5 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-rose-500 dark:text-slate-300 text-slate-900 font-mono" />
                                            </div>
                                        </div>
                                    )}

                                    {entityType === 'Actor Matrix Database' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-left-4 duration-300">
                                            <div>
                                                <label className="block text-xs font-semibold dark:text-slate-400 text-slate-500 mb-2">Target Full Name</label>
                                                <input type="text" placeholder="Hon. John Doe" className="w-full px-4 py-2.5 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-rose-500 dark:text-white text-slate-900 font-mono" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold dark:text-slate-400 text-slate-500 mb-2">Primary Role</label>
                                                <select className="w-full px-4 py-2.5 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-rose-500 dark:text-white text-slate-900 font-mono">
                                                    <option>Governor</option>
                                                    <option>Senator</option>
                                                    <option>MP</option>
                                                    <option>MCA</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-semibold dark:text-slate-400 text-slate-500 mb-2">Associated County</label>
                                                <input type="text" placeholder="e.g. Kiambu" className="w-full md:w-1/2 px-4 py-2.5 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-rose-500 dark:text-white text-slate-900 font-mono" />
                                            </div>
                                        </div>
                                    )}

                                    {entityType === 'Regulatory Framework Item' && (
                                        <div className="grid grid-cols-1 gap-6 animate-in slide-in-from-left-4 duration-300">
                                            <div>
                                                <label className="block text-xs font-semibold dark:text-slate-400 text-slate-500 mb-2">Legal Question / Restriction Title</label>
                                                <input type="text" placeholder="Are corporate donations banned?" className="w-full px-4 py-2.5 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-rose-500 dark:text-white text-slate-900 font-mono" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold dark:text-slate-400 text-slate-500 mb-2">Code Response / Source Act</label>
                                                <textarea rows={3} placeholder="PPA Sec 34. (1) ..." className="w-full px-4 py-2.5 dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-rose-500 dark:text-white text-slate-900 font-mono"></textarea>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3 border-t dark:border-slate-800 border-slate-200 pt-6 mt-6">
                                    <button className="px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all flex items-center gap-2">
                                        <Layers size={16} /> Broadcast To Module
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Triaging Modal overlay (Review Queue) */}
            {selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm shadow-2xl font-sans">
                    <div className="dark:bg-slate-950 bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 shadow-[0_0_50px_rgba(0,0,0,0.5)] border dark:border-slate-800 border-slate-200">
                        <div className="px-6 py-4 border-b dark:border-slate-800 border-slate-200 dark:bg-slate-900 bg-slate-50 flex justify-between items-center">
                            <h2 className="font-bold dark:text-white text-slate-900 text-lg flex items-center gap-2">
                                Payload Assessment <span className="dark:text-rose-500 text-rose-600 font-mono text-sm ml-2 tracking-widest">[{selectedSubmission.id}]</span>
                            </h2>
                            <button onClick={() => setSelectedSubmission(null)} className="p-1 dark:text-slate-500 text-slate-400 hover:text-rose-500 transition-colors">
                                <XSquare size={20} />
                            </button>
                        </div>
                        <div className="p-6 flex-1 overflow-y-auto flex flex-col md:flex-row gap-8">
                            <div className="md:w-1/2 flex flex-col border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-900/50">
                                <h3 className="text-[10px] font-bold dark:text-slate-500 text-slate-400 uppercase tracking-widest mb-4">Target Identity</h3>
                                <div className="space-y-4 text-sm font-sans mb-6">
                                    <div><span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Actor:</span><strong className="text-lg">{selectedSubmission.actor}</strong></div>
                                    <div><span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Subject:</span><span className="dark:text-slate-300">{selectedSubmission.subject}</span></div>
                                    <div><span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Raw Claim:</span><span className="dark:text-slate-300 italic">"{selectedSubmission.description}"</span></div>
                                </div>
                            </div>
                            <div className="md:w-1/2 flex flex-col">
                                <h3 className="text-[10px] font-bold dark:text-slate-500 text-slate-400 uppercase tracking-widest mb-3 border-b dark:border-slate-800 pb-2 flex items-center gap-2"><Fingerprint size={14} className="text-rose-500" /> AI Integrity Scan</h3>
                                <div className="dark:bg-slate-900/50 bg-slate-50 border dark:border-slate-800 border-slate-200 p-4 rounded-xl shadow-inner mb-6">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-xs font-bold dark:text-slate-400 uppercase tracking-wider">Tamper Probability</span>
                                        <span className={`text-2xl font-black font-mono tracking-tighter ${getRiskColor(selectedSubmission.riskScore).split(' ')[0]}`}>{selectedSubmission.riskScore}%</span>
                                    </div>
                                    <div className="w-full dark:bg-slate-800 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                        <div className={`h-1.5 rounded-full ${getRiskColor(selectedSubmission.riskScore).split(' ')[0].replace('text-', 'bg-')}`} style={{ width: `${selectedSubmission.riskScore}%` }}></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-3 mt-auto">
                                    <button onClick={handleApprove} className="w-full py-3 dark:bg-emerald-500/10 bg-emerald-50 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-lg font-bold text-xs uppercase tracking-widest transition-all box-border">Verify Facts & Proceed</button>
                                    <button onClick={() => setSelectedSubmission(null)} className="w-full py-3 dark:bg-slate-800 bg-slate-100 dark:text-white text-slate-900 rounded-lg font-bold text-xs uppercase tracking-widest transition-all">Dismiss Claim</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
