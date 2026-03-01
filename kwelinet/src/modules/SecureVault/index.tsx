import React, { useState, useCallback } from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { ShieldAlert, UploadCloud, Lock, FileText, X, Search, CheckCircle2, Loader2, KeyRound } from 'lucide-react';
import { mockActors } from '../../data/mockActorData';

export default function SecureVault() {
    const [showDisclaimer, setShowDisclaimer] = useState(true);
    const [actorSearch, setActorSearch] = useState('');
    const [selectedActor, setSelectedActor] = useState<typeof mockActors[0] | null>(null);
    const [contextText, setContextText] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<null | 'success'>(null);
    const [traceId, setTraceId] = useState('');

    // Dropzone setup
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setUploadedFiles(prev => [...prev, ...acceptedFiles]);
    }, []);

    const dropzoneOptions: DropzoneOptions = {
        onDrop,
        maxSize: 52428800, // 50MB
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png'],
            'video/*': ['.mp4', '.mov'],
            'application/pdf': ['.pdf']
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions);

    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Autocomplete filtering
    const filteredActors = actorSearch.length > 1
        ? mockActors.filter(a => a.name.toLowerCase().includes(actorSearch.toLowerCase()))
        : [];

    const handleSelectActor = (actor: typeof mockActors[0]) => {
        setSelectedActor(actor);
        setActorSearch('');
    };

    const simulateSubmission = () => {
        setIsSubmitting(true);
        // Simulate encryption & sanitization delay
        setTimeout(() => {
            setIsSubmitting(false);
            setTraceId(`KWL-${Math.random().toString(36).substring(2, 10).toUpperCase()}-99A`);
            setSubmitStatus('success');
            // Reset after showing success
            setTimeout(() => {
                setSubmitStatus(null);
                setSelectedActor(null);
                setContextText('');
                setUploadedFiles([]);
            }, 4000);
        }, 3500);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-emerald-500/30">

            {/* Top Navigation Adjustments for Dark Mode (if this was a standalone page, but we'll put it here to ensure it bleeds up visually if needed, though standard layout handles the top header) */}
            <div className="p-6 max-w-4xl mx-auto pt-10">

                {/* Header */}
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-950 border border-emerald-800 mb-6 relative">
                        <KeyRound size={28} className="text-emerald-500 relative z-10" />
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-pulse"></div>
                    </div>
                    <h1 className="text-3xl font-bold font-mono tracking-tight text-white mb-3">System.Vault :: Secure Node</h1>
                    <p className="text-slate-400 max-w-xl mx-auto">Zero-trust evidentiary drop mechanism. Submissions route through encrypted Tor nodes before landing on our air-gapped ledger.</p>
                </div>

                {/* Disclaimer Banner */}
                {showDisclaimer && (
                    <div className="mb-8 bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-4 flex items-start gap-4 relative">
                        <ShieldAlert className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                        <div className="pr-8">
                            <h3 className="text-sm font-semibold text-emerald-400 mb-1">Anonymity Guaranteed</h3>
                            <p className="text-xs text-emerald-200/70 leading-relaxed">
                                Advanced sanitization active. All EXIF data, IP addresses, localized device vectors, and metadata are automatically stripped before persistent storage. Rate limits apply to prevent malicious payload injections.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowDisclaimer(false)}
                            className="absolute top-4 right-4 text-emerald-600 hover:text-emerald-400 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Submission Form Area */}
                {submitStatus === 'success' ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center">
                        <CheckCircle2 size={64} className="text-emerald-500 mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-2 font-mono">Payload Secured</h2>
                        <p className="text-slate-400 mb-8 max-w-md">Your evidence has been cryptographically signed, sanitized, and queued for administrative review. Thank you for protecting the integrity of the state.</p>
                        <div className="bg-slate-950 px-6 py-3 rounded-lg border border-slate-800 flex items-center justify-between w-full max-w-sm gap-4">
                            <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold flex-shrink-0">Trace ID</span>
                            <span className="text-emerald-500 font-mono text-sm truncate">{traceId}</span>
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">

                        {/* Overlay during submission */}
                        {isSubmitting && (
                            <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center">
                                <Loader2 size={48} className="text-emerald-500 animate-spin mb-6" />
                                <h3 className="text-lg font-mono text-white mb-2">Encrypting & Sanitizing Payload...</h3>
                                <div className="w-64 bg-slate-800 h-2 rounded-full overflow-hidden relative">
                                    {/* Simulate progress bar */}
                                    <div className="absolute top-0 left-0 h-full bg-emerald-500 w-full animate-[progress_3.5s_ease-in-out]"></div>
                                </div>
                                <div className="mt-4 font-mono text-xs text-emerald-500/70 space-y-1 text-center">
                                    <p>Striping EXIF metadata... [OK]</p>
                                    <p className="animate-pulse">Obfuscating source route...</p>
                                </div>
                            </div>
                        )}

                        {/* Step 1: Target Actor (Autocomplete) */}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                1. Target State Actor Implicated
                            </label>
                            <div className="relative">
                                {selectedActor ? (
                                    <div className="flex items-center justify-between bg-emerald-950/30 border border-emerald-800/50 p-3 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 text-sm font-bold border border-slate-700">
                                                {selectedActor.name.split(' ').slice(-2).map((n: string) => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{selectedActor.name}</p>
                                                <p className="text-xs text-emerald-500">{selectedActor.role} • {selectedActor.county}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setSelectedActor(null)} className="p-2 hover:bg-emerald-900/50 rounded-lg text-emerald-500 transition-colors">
                                            <X size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Type name (e.g., James Mwangi)"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                                            value={actorSearch}
                                            onChange={(e) => setActorSearch(e.target.value)}
                                        />

                                        {/* Autocomplete Dropdown */}
                                        {filteredActors.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-20 max-h-48 overflow-y-auto">
                                                {filteredActors.map(actor => (
                                                    <div
                                                        key={actor.id}
                                                        onClick={() => handleSelectActor(actor)}
                                                        className="px-4 py-3 hover:bg-slate-700 cursor-pointer border-b border-slate-700/50 last:border-0 flex items-center gap-3"
                                                    >
                                                        <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-800">
                                                            {actor.name.split(' ').slice(-2).map((n: string) => n[0]).join('')}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-white">{actor.name}</p>
                                                            <p className="text-xs text-slate-400">{actor.role} • {actor.party}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Step 2: Evidence Dropzone */}
                        <div className="mb-8 relative z-10">
                            <label className="block text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                2. Raw Evidence Payload
                            </label>

                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-emerald-500 bg-emerald-950/20' : 'border-slate-700 hover:border-slate-600 bg-slate-950/50'}
                `}
                            >
                                <input {...getInputProps()} />
                                <UploadCloud size={40} className={`mx-auto mb-4 ${isDragActive ? 'text-emerald-500' : 'text-slate-500'}`} />
                                <p className="text-slate-300 font-medium mb-1">
                                    {isDragActive ? 'Incoming target payload...' : 'Drag & drop media files here'}
                                </p>
                                <p className="text-xs text-slate-500">
                                    Supported formats: JPG, PNG, MP4, PDF. Max size: 50MB.
                                </p>
                            </div>

                            {/* Uploaded Files List */}
                            {uploadedFiles.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {uploadedFiles.map((file, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-slate-800/50 border border-slate-700 p-3 rounded-lg">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <FileText size={16} className="text-emerald-500 shrink-0" />
                                                <span className="text-sm text-slate-300 truncate">{file.name}</span>
                                                <span className="text-xs text-slate-500 shrink-0">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                            </div>
                                            <button onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="text-slate-500 hover:text-red-400 transition-colors p-1">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Step 3: Context */}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2 flex justify-between">
                                <span>3. Contextual Data</span>
                                <span className="text-slate-600 lowercase font-normal">(Optional but recommended)</span>
                            </label>
                            <textarea
                                placeholder="Briefly describe the context of the alleged violation (e.g., 'Spotted using 3 GK vehicles marked with UDA colors at the Kasarani rally')..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium resize-none min-h-[120px]"
                                value={contextText}
                                onChange={(e) => setContextText(e.target.value)}
                            />
                        </div>

                        {/* Action Row */}
                        <div className="border-t border-slate-800 pt-6 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                                <Lock size={12} className="text-emerald-500" />
                                <span>End-to-end PGP Encryption</span>
                            </div>
                            <button
                                onClick={simulateSubmission}
                                disabled={!selectedActor || uploadedFiles.length === 0 || isSubmitting}
                                className={`px-8 py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500
                    ${(!selectedActor || uploadedFiles.length === 0)
                                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                    }
                  `}
                            >
                                Execute Drop Payload
                            </button>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
