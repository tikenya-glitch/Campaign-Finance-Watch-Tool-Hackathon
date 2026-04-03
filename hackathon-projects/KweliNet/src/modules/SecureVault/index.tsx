import { useState, useCallback } from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import { ShieldAlert, UploadCloud, Lock, FileText, X, Search, CheckCircle2, Loader2, KeyRound, AlertTriangle, ShieldCheck } from 'lucide-react';
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
    // Autocomplete filtering with input sanitization guardrail
    const sanitizedSearch = actorSearch.replace(/[^a-zA-Z0-9 ]/g, "");
    const filteredActors = sanitizedSearch.length > 1
        ? mockActors.filter(a => a.name.toLowerCase().includes(sanitizedSearch.toLowerCase()))
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
        <div className="p-6 max-w-4xl mx-auto pt-10 font-sans selection:bg-emerald-500/30">

            {/* Header */}
            <div className="mb-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full dark:bg-emerald-950/50 bg-emerald-50 border dark:border-emerald-800 border-emerald-200 mb-6 relative">
                    <KeyRound size={28} className="dark:text-emerald-500 text-emerald-600 relative z-10" />
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-full dark:shadow-[0_0_30px_rgba(16,185,129,0.3)] shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-pulse"></div>
                </div>
                <h1 className="text-3xl font-bold font-mono tracking-tight dark:text-white text-slate-900 mb-3">System.Vault :: Secure Node</h1>
                <p className="dark:text-slate-400 text-slate-500 max-w-xl mx-auto font-mono text-sm leading-relaxed">Zero-trust evidentiary drop mechanism. Submissions route through encrypted Tor nodes before landing on our air-gapped ledger.</p>
            </div>

            {/* Disclaimer Banner */}
            {showDisclaimer && (
                <div className="mb-8 dark:bg-emerald-950/40 bg-emerald-50 border dark:border-emerald-800/60 border-emerald-200 rounded-xl p-4 flex items-start gap-4 relative shadow-sm">
                    <ShieldAlert className="dark:text-emerald-500 text-emerald-600 shrink-0 mt-0.5" size={20} />
                    <div className="pr-8">
                        <h3 className="text-sm font-bold dark:text-emerald-400 text-emerald-800 mb-1 tracking-wide uppercase">Anonymity Guaranteed</h3>
                        <p className="text-xs dark:text-emerald-200/70 text-emerald-700 leading-relaxed font-mono">
                            Advanced sanitization active. All EXIF data, IP addresses, localized device vectors, and metadata are automatically stripped before persistent storage. Rate limits apply to prevent malicious payload injections.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowDisclaimer(false)}
                        className="absolute top-4 right-4 dark:text-emerald-600 text-emerald-500 hover:text-emerald-400 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Submission Form Area */}
            {submitStatus === 'success' ? (
                <div className="pulse-card rounded-2xl p-12 text-center flex flex-col items-center">
                    <CheckCircle2 size={64} className="dark:text-emerald-400 text-emerald-500 mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                    <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-2 font-mono uppercase tracking-widest">Payload Secured</h2>
                    <p className="dark:text-slate-400 text-slate-500 mb-8 max-w-md">Your evidence has been cryptographically signed, sanitized, and queued for administrative review. Thank you for protecting the integrity of the state.</p>
                    <div className="dark:bg-slate-950 bg-slate-50 px-6 py-3 rounded-lg border dark:border-slate-800 border-slate-200 flex items-center justify-between w-full max-w-sm gap-4 shadow-inner">
                        <span className="text-xs dark:text-slate-500 text-slate-500 uppercase tracking-widest font-bold flex-shrink-0">Trace ID</span>
                        <span className="dark:text-emerald-500 text-emerald-700 font-mono text-sm truncate font-bold">{traceId}</span>
                    </div>
                </div>
            ) : (
                <div className="pulse-card rounded-2xl p-6 md:p-8 relative overflow-visible">

                    {/* Overlay during submission */}
                    {isSubmitting && (
                        <div className="absolute inset-0 z-50 dark:bg-slate-900/90 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
                            <Loader2 size={48} className="text-emerald-500 animate-spin mb-6" />
                            <h3 className="text-lg font-mono dark:text-white text-slate-900 mb-2 font-bold tracking-tight">Encrypting & Sanitizing Payload...</h3>
                            <div className="w-64 dark:bg-slate-800 bg-slate-200 h-2 rounded-full overflow-hidden relative shadow-inner">
                                {/* Simulate progress bar */}
                                <div className="absolute top-0 left-0 h-full bg-emerald-500 w-full animate-[progress_3.5s_ease-in-out]"></div>
                            </div>
                            <div className="mt-4 font-mono text-xs dark:text-emerald-500/70 text-emerald-700 space-y-1 text-center font-bold tracking-wider">
                                <p>Striping EXIF metadata... [OK]</p>
                                <p className="animate-pulse">Obfuscating source route...</p>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Target Actor (Autocomplete) */}
                    <div className="mb-8">
                        <label className="block text-xs font-bold uppercase tracking-widest dark:text-slate-400 text-slate-500 mb-3">
                            1. Target State Actor Implicated
                        </label>
                        <div className="relative">
                            {selectedActor ? (
                                <div className="flex items-center justify-between dark:bg-emerald-950/30 bg-emerald-50 border dark:border-emerald-800/50 border-emerald-200 p-3 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 dark:bg-slate-800 bg-white rounded-full flex items-center justify-center dark:text-slate-400 text-slate-500 text-sm font-bold border dark:border-slate-700 border-slate-200 font-mono shadow-inner">
                                            {selectedActor.name.split(' ').slice(-2).map((n: string) => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="dark:text-white text-slate-900 font-bold tracking-tight">{selectedActor.name}</p>
                                            <p className="text-xs dark:text-emerald-500 text-emerald-700 font-mono tracking-wide">{selectedActor.role} • {selectedActor.county}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedActor(null)} className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg dark:text-emerald-500 text-emerald-600 transition-colors">
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 dark:text-slate-500 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Type name (e.g., James Mwangi)"
                                        className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-xl pl-12 pr-4 py-3 dark:text-white text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono"
                                        value={actorSearch}
                                        onChange={(e) => setActorSearch(e.target.value)}
                                    />

                                    {/* Autocomplete Dropdown */}
                                    {filteredActors.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-2 dark:bg-slate-800 bg-white border dark:border-slate-700 border-slate-200 rounded-xl shadow-2xl overflow-hidden z-20 max-h-48 overflow-y-auto">
                                            {filteredActors.map(actor => (
                                                <div
                                                    key={actor.id}
                                                    onClick={() => handleSelectActor(actor)}
                                                    className="px-4 py-3 dark:hover:bg-slate-700 hover:bg-slate-50 cursor-pointer border-b dark:border-slate-700/50 border-slate-100 last:border-0 flex items-center gap-3 transition-colors"
                                                >
                                                    <div className="w-8 h-8 rounded dark:bg-slate-900 bg-slate-100 flex items-center justify-center text-xs font-bold dark:text-slate-500 text-slate-500 border dark:border-slate-800 border-slate-200 font-mono">
                                                        {actor.name.split(' ').slice(-2).map((n: string) => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold dark:text-white text-slate-900">{actor.name}</p>
                                                        <p className="text-[10px] uppercase tracking-widest dark:text-slate-400 text-slate-500 font-semibold">{actor.role} • {actor.party}</p>
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
                        <label className="block text-xs font-bold uppercase tracking-widest dark:text-slate-400 text-slate-500 mb-3">
                            2. Raw Evidence Payload
                        </label>

                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
                  ${isDragActive ? 'border-emerald-500 dark:bg-emerald-950/20 bg-emerald-50' : 'dark:border-slate-700 border-slate-300 dark:hover:border-emerald-500/50 hover:border-emerald-500/50 dark:bg-slate-950/50 bg-slate-50 hover:shadow-md'}
                `}
                        >
                            <input {...getInputProps()} />
                            <UploadCloud size={40} className={`mx-auto mb-4 transition-colors ${isDragActive ? 'dark:text-emerald-400 text-emerald-500' : 'dark:text-slate-600 text-slate-400'}`} />
                            <p className="dark:text-slate-300 text-slate-700 font-bold tracking-tight mb-1">
                                {isDragActive ? 'Incoming target payload...' : 'Drag & drop media files here'}
                            </p>
                            <p className="text-[10px] uppercase font-bold tracking-widest dark:text-slate-500 text-slate-400 mt-2">
                                Supported formats: JPG, PNG, MP4, PDF. Max size: 50MB.
                            </p>
                        </div>

                        {/* Uploaded Files List */}
                        {uploadedFiles.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {uploadedFiles.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between dark:bg-slate-800/50 bg-slate-50 border dark:border-slate-700 border-slate-200 p-3 rounded-lg shadow-sm">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <FileText size={16} className="dark:text-emerald-500 text-emerald-600 shrink-0" />
                                            <span className="text-sm dark:text-slate-300 text-slate-700 font-bold truncate">{file.name}</span>
                                            <span className="text-xs font-mono dark:text-slate-500 text-slate-500 shrink-0">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="dark:text-slate-500 text-slate-400 dark:hover:text-red-400 hover:text-red-500 transition-colors p-1">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Step 3: Context */}
                    <div className="mb-8">
                        <label className="block text-xs font-bold uppercase tracking-widest dark:text-slate-400 text-slate-500 mb-3 flex items-center justify-between">
                            <span>3. Contextual Data</span>
                            <span className="dark:text-amber-500 text-amber-600 lowercase font-mono tracking-normal text-[10px] flex items-center gap-1">
                                <AlertTriangle size={12} /> Exclude PII (Personal Info)
                            </span>
                        </label>
                        <textarea
                            placeholder="Briefly describe the context of the alleged violation (e.g., 'Spotted using 3 GK vehicles marked with UDA colors at the Kasarani rally')..."
                            className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-xl p-4 dark:text-white text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-sans resize-none min-h-[120px]"
                            value={contextText}
                            onChange={(e) => setContextText(e.target.value.slice(0, 500))}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-[10px] dark:text-emerald-500/70 text-emerald-600 font-mono flex items-center gap-1 font-bold">
                                <ShieldCheck size={12} /> Automated text sanitization active
                            </span>
                            <span className={`text-[10px] font-mono ${contextText.length >= 500 ? 'dark:text-amber-500 text-amber-600' : 'dark:text-slate-500 text-slate-400'}`}>
                                {contextText.length} / 500
                            </span>
                        </div>
                    </div>

                    {/* Action Row */}
                    <div className="border-t dark:border-slate-800 border-slate-200 pt-6 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] dark:text-slate-500 text-slate-500 uppercase tracking-widest font-bold">
                            <Lock size={12} className="dark:text-emerald-500 text-emerald-600" />
                            <span>End-to-end PGP Encryption</span>
                        </div>
                        <button
                            onClick={simulateSubmission}
                            disabled={!selectedActor || uploadedFiles.length === 0 || isSubmitting}
                            className={`px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-xs transition-all focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-offset-white focus:ring-emerald-500
                    ${(!selectedActor || uploadedFiles.length === 0)
                                    ? 'dark:bg-slate-800 bg-slate-200 dark:text-slate-500 text-slate-400 cursor-not-allowed'
                                    : 'bg-emerald-500 hover:bg-emerald-400 dark:text-slate-950 text-white shadow-[0_4px_15px_rgba(16,185,129,0.3)] dark:shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                }
                  `}
                        >
                            Execute Drop Payload
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}
