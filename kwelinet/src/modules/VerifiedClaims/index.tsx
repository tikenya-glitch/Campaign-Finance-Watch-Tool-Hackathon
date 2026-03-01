import React, { useState, useCallback } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    applyNodeChanges,
    applyEdgeChanges,
    Node,
    Edge,
    NodeChange,
    EdgeChange,
    Handle,
    Position,
    MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CheckCircle2, Video, FileText, X, AlertTriangle, ShieldCheck, Camera } from 'lucide-react';

// --- Custom Types ---
type NodeData = {
    label?: string;
    role?: string;
    emoji?: string;
    type?: string;
    details?: string;
    date?: string;
    [key: string]: unknown;
};

// --- Custom Nodes ---

const ActorNode = ({ data }: { data: NodeData }) => (
    <div className="bg-white border-2 border-slate-700 rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-lg relative">
        <Handle type="source" position={Position.Right} className="w-2 h-2 bg-slate-400" />
        <Handle type="target" position={Position.Left} className="w-2 h-2 bg-slate-400" />
        <div className="text-2xl mb-1">{data.emoji || '👤'}</div>
        <div className="px-2 text-[10px] font-bold text-center leading-tight line-clamp-2">{data.label}</div>
        <div className="absolute -bottom-2 bg-slate-800 text-white text-[8px] px-2 py-0.5 rounded-full uppercase tracking-widest">{data.role}</div>
    </div>
);

const EventNode = ({ data }: { data: NodeData }) => (
    <div className="bg-slate-50 border-2 border-amber-500 rounded-lg p-3 w-40 shadow-lg relative">
        <Handle type="source" position={Position.Right} className="w-2 h-2 bg-amber-500" />
        <Handle type="target" position={Position.Left} className="w-2 h-2 bg-amber-500" />
        <div className="flex items-center gap-1.5 mb-1.5">
            <AlertTriangle size={14} className="text-amber-500" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Verified Event</span>
        </div>
        <div className="text-xs text-slate-600 font-medium">{data.label}</div>
        <div className="text-[10px] text-slate-400 mt-2">{data.date}</div>
    </div>
);

const EvidenceNode = ({ data }: { data: NodeData }) => (
    <div
        className="bg-white border-2 border-emerald-500 p-2 w-32 shadow-lg relative cursor-pointer hover:shadow-emerald-200 transition-shadow"
        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
    >
        <Handle type="target" position={Position.Left} className="w-2 h-2 bg-emerald-500" />

        <div className="flex flex-col items-center justify-center h-24 pt-2">
            {data.type === 'video' ? <Video size={20} className="text-slate-700 mb-1" /> : <Camera size={20} className="text-slate-700 mb-1" />}
            <span className="text-[10px] font-bold text-center leading-tight px-2">{data.label}</span>
        </div>

        {/* Verification Badge */}
        <div className="absolute top-2 right-2 flex items-center justify-center bg-white rounded-full">
            <ShieldCheck size={16} className="text-emerald-500 drop-shadow-sm" />
        </div>
    </div>
);

const nodeTypes = {
    actor: ActorNode,
    event: EventNode,
    evidence: EvidenceNode,
};

// --- Initial Data ---

const initialNodes: Node[] = [
    { id: 'actor-1', type: 'actor', position: { x: 50, y: 150 }, data: { label: 'Gov. James Mwangi', role: 'Governor', emoji: '🧑‍💼' } },
    { id: 'event-1', type: 'event', position: { x: 300, y: 150 }, data: { label: 'UDA Campaign Rally (Kasarani)', date: 'Oct 12, 2025' } },
    { id: 'evid-1', type: 'evidence', position: { x: 600, y: 50 }, data: { label: 'Dashcam Footage', type: 'video', details: 'Clear visual of 3 GK-plated Land Cruisers arriving at the venue dispensing party merchandise.' } },
    { id: 'evid-2', type: 'evidence', position: { x: 600, y: 250 }, data: { label: 'Mobilization Ledger', type: 'document', details: 'Leaked WhatsApp screenshot coordinating county staff to attend during working hours.' } },
];

const initialEdges: Edge[] = [
    {
        id: 'e1-2', source: 'actor-1', target: 'event-1', animated: true,
        style: { stroke: '#94a3b8', strokeWidth: 2 }
    },
    {
        id: 'e2-3', source: 'event-1', target: 'evid-1', animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
        style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5,5' }
    },
    {
        id: 'e2-4', source: 'event-1', target: 'evid-2', animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
        style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5,5' }
    },
];

export default function VerifiedClaims() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const [activeEvidence, setActiveEvidence] = useState<NodeData | null>(null);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onNodeClick = (event: React.MouseEvent, node: Node) => {
        if (node.type === 'evidence') {
            setActiveEvidence(node.data);
        }
    };

    return (
        <div className="h-[calc(100vh-64px)] lg:h-screen flex flex-col p-6 max-w-[1600px] mx-auto overflow-hidden">

            {/* Header */}
            <div className="mb-6 shrink-0">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-500" size={24} />
                    Verified Claims Mapping
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Cryptographically verified whistleblower evidence mapped to political state actors. All nodes have bypassed manipulation detection frameworks.
                </p>
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 flex gap-6 relative min-h-0">

                {/* React Flow Container */}
                <div className={`bg-slate-50 border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 relative ${activeEvidence ? 'w-2/3' : 'w-full'}`}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onNodeClick={onNodeClick}
                        nodeTypes={nodeTypes}
                        fitView
                        className="bg-slate-50/50"
                    >
                        <Background color="#cbd5e1" gap={16} />
                        <Controls className="bg-white border-slate-200 shadow-sm" />
                    </ReactFlow>

                    {/* Canvas Overlay Legend */}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg border border-slate-200 shadow-sm text-xs text-slate-600 flex gap-4">
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full border border-slate-400"></div> Actor</div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-amber-200 border border-amber-400"></div> Event</div>
                        <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> Verified Evidence</div>
                    </div>
                </div>

                {/* Investigative Breakdown Split Screen */}
                {activeEvidence && (
                    <div className="w-1/3 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-300">
                        {/* Split Screen Header */}
                        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <ShieldCheck size={18} className="text-emerald-500" />
                                Investigative Breakdown
                            </h3>
                            <button
                                onClick={() => setActiveEvidence(null)}
                                className="text-slate-400 hover:text-slate-700 p-1 bg-white border border-slate-200 rounded shadow-sm"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Split Screen Body */}
                        <div className="p-5 overflow-y-auto flex-1">

                            {/* Media Preview Box */}
                            <div className="w-full aspect-video bg-slate-900 rounded-lg mb-6 flex flex-col items-center justify-center relative overflow-hidden group">
                                {/* Simulated Media */}
                                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity"></div>
                                {activeEvidence.type === 'video' ? (
                                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center z-10 group-hover:bg-white/20 transition-all cursor-pointer">
                                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                                    </div>
                                ) : (
                                    <FileText size={48} className="text-slate-400 z-10" />
                                )}
                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur text-white text-[10px] uppercase font-mono tracking-wider rounded">
                                    ENCRYPTED.MEDIA.PREVIEW
                                </div>
                            </div>

                            {/* Text Breakdown */}
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Evidence Label</h4>
                                    <p className="text-slate-900 font-medium">{activeEvidence.label}</p>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Analyst Summary</h4>
                                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                                        <p className="text-sm text-slate-700 leading-relaxed font-sans">
                                            {activeEvidence.details}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Verification Metadata</h4>
                                    <ul className="text-xs space-y-2 font-mono text-slate-600 bg-slate-50 p-3 rounded border border-slate-200">
                                        <li className="flex justify-between"><span>Deepfake Prob:</span> <span className="text-emerald-600 font-bold">1.2% (Clear)</span></li>
                                        <li className="flex justify-between"><span>EXIF Status:</span> <span>Sanitized</span></li>
                                        <li className="flex justify-between"><span>Blockchain Anchor:</span> <span className="text-blue-500 underline cursor-pointer truncate w-24 ml-2">0x8f3c...9a12</span></li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
