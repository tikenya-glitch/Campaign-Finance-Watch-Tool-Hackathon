import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Users, ShieldAlert, Network, Scale,
  ChevronRight, Activity, Shield, Eye,
  AlertTriangle, Database, GitBranch, Zap
} from 'lucide-react';

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedStat({ value, label, prefix = '', suffix = '' }: {
  value: number; label: string; prefix?: string; suffix?: string;
}) {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        let start = 0;
        const duration = 1600;
        const step = (ts: number) => {
          if (!start) start = ts;
          const progress = Math.min((ts - start) / duration, 1);
          setDisplayed(Math.floor(progress * value));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        observer.disconnect();
      }
    }, { threshold: 0.4 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl lg:text-5xl font-black text-white tabular-nums">
        {prefix}{displayed.toLocaleString()}{suffix}
      </div>
      <div className="mt-1 text-sm text-slate-400 tracking-wide">{label}</div>
    </div>
  );
}

// ─── Feature Cards ────────────────────────────────────────────────────────────
const features = [
  { icon: BarChart3,  title: 'Financial Flow',      description: 'Track high-value donations disclosed to political parties and explore financial networks across election cycles.', path: '/flow',       color: '#7DD3FC', glow: 'rgba(125,211,252,0.12)' },
  { icon: Users,      title: 'Actor Matrix',         description: 'Explore political actors, their affiliations, funding networks, and risk classifications across Kenya.',          path: '/actors',     color: '#A78BFA', glow: 'rgba(167,139,250,0.12)' },
  { icon: Network,    title: 'Verified Claims',      description: 'View fact-checked incidents derived from whistleblower submissions and investigative analysis.',                  path: '/claims',     color: '#34D399', glow: 'rgba(52,211,153,0.12)'  },
  { icon: ShieldAlert,title: 'Secure Vault',         description: 'Submit anonymous evidence through a secure whistleblower portal with end-to-end encrypted uploads.',             path: '/vault',      color: '#E11D48', glow: 'rgba(225,29,72,0.12)'   },
  { icon: Scale,      title: 'Regulatory Context',   description: "Understand Kenya's campaign finance laws, the Political Parties Act, and the ORPP regulatory framework.",         path: '/regulatory', color: '#FBBF24', glow: 'rgba(251,191,36,0.12)'  },
];

// ─── Pipeline Steps ───────────────────────────────────────────────────────────
const pipelineSteps = [
  { num: 1, icon: Database,   title: 'Public Disclosures', desc: 'Political donation filings published by ORPP and regulatory bodies.' },
  { num: 2, icon: GitBranch,  title: 'Data Structuring',   desc: 'KweliNet transforms raw disclosures into structured, queryable datasets.' },
  { num: 3, icon: Activity,   title: 'Network Analysis',   desc: 'Donor clusters and political funding flows are mapped and cross-referenced.' },
  { num: 4, icon: Eye,        title: 'Public Transparency', desc: 'Interactive tools let anyone follow the money shaping Kenyan politics.' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Homepage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  const fade = (delay = 0) => ({
    opacity: ready ? 1 : 0,
    transform: ready ? 'translateY(0)' : 'translateY(18px)',
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  return (
    <div className="min-h-screen font-sans" style={{ background: '#0B0F19', color: '#E5E7EB' }}>

      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-14 h-16"
        style={{ background: 'rgba(11,15,25,0.82)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(125,211,252,0.07)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center"
            style={{ background: 'rgba(225,29,72,0.14)', border: '1px solid rgba(225,29,72,0.38)', boxShadow: '0 0 12px rgba(225,29,72,0.28)' }}
          >
            <Activity size={16} style={{ color: '#E11D48' }} />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">KweliNet</span>
          <span className="hidden sm:block text-[10px] px-2 py-0.5 rounded font-bold tracking-widest uppercase"
            style={{ background: 'rgba(225,29,72,0.1)', color: '#E11D48', border: '1px solid rgba(225,29,72,0.22)' }}>
            Live
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/flow')} className="hidden sm:block text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Explore Data
          </button>
          <button
            onClick={() => navigate('/flow')}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold text-white transition-all"
            style={{ background: '#E11D48', boxShadow: '0 0 18px rgba(225,29,72,0.38)' }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 28px rgba(225,29,72,0.65)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 18px rgba(225,29,72,0.38)')}
          >
            Launch Platform <ChevronRight size={14} />
          </button>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Background image — money flow art */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/funds.png)', opacity: 0.35, backgroundPosition: 'center 40%' }}
        />

        {/* Dark gradient overlay — heavier left side for readability */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(110deg, rgba(11,15,25,0.98) 38%, rgba(11,15,25,0.55) 65%, rgba(11,15,25,0.22) 100%)'
        }} />

        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 40% at 30% 50%, rgba(225,29,72,0.05) 0%, transparent 60%)'
        }} />

        {/* Hero text — left column */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-14 pt-24 pb-20">
          <div className="max-w-[52%] lg:max-w-[46%]">

            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-8"
              style={{ background: 'rgba(225,29,72,0.1)', border: '1px solid rgba(225,29,72,0.28)', color: '#E11D48', ...fade(0) }}
            >
              <AlertTriangle size={10} />
              Political Finance Intelligence
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-[5.5rem] font-black leading-[1.0] tracking-tight mb-7" style={fade(0.08)}>
              Follow the{' '}
              <span className="relative inline-block" style={{ color: '#E11D48', textShadow: '0 0 50px rgba(225,29,72,0.45)' }}>
                Money
              </span>
              <br/>
              <span className="text-white">in Kenyan</span>
              <br/>
              <span style={{ color: '#7DD3FC', textShadow: '0 0 40px rgba(125,211,252,0.35)' }}>Politics.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-slate-300 leading-relaxed mb-3 max-w-lg" style={fade(0.16)}>
              KweliNet is an open-intelligence platform that tracks disclosed political donations, maps political actors, and surfaces verified campaign finance violations.
            </p>

            <p className="text-sm text-slate-500 leading-relaxed mb-10 max-w-md" style={fade(0.22)}>
              Built on ORPP filings, KweliNet transforms fragmented disclosure data into interactive tools for journalists, researchers, and citizens.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mb-10" style={fade(0.3)}>
              <button
                onClick={() => navigate('/flow')}
                className="flex items-center gap-2 px-7 py-3.5 rounded-md font-bold text-[15px] text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #E11D48, #be123c)', boxShadow: '0 0 28px rgba(225,29,72,0.45)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 36px rgba(225,29,72,0.6)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 28px rgba(225,29,72,0.45)'; }}
              >
                Explore Financial Flows <ChevronRight size={16} />
              </button>
              <button
                onClick={() => navigate('/actors')}
                className="flex items-center gap-2 px-7 py-3.5 rounded-md font-semibold text-[15px] transition-all"
                style={{ background: 'rgba(125,211,252,0.06)', color: '#7DD3FC', border: '1.5px solid rgba(125,211,252,0.3)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(125,211,252,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(125,211,252,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                View Actor Network <ChevronRight size={16} />
              </button>
            </div>

            {/* Credibility line */}
            <div className="flex items-center gap-2 text-xs text-slate-600" style={fade(0.38)}>
              <Shield size={11} className="text-slate-600" />
              Powered by publicly disclosed political finance records
            </div>
          </div>
        </div>



        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #0B0F19)' }} />
      </section>

      {/* ── Stats Strip ─────────────────────────────────────────────────────── */}
      <section className="py-14" style={{ background: 'rgba(125,211,252,0.03)', borderTop: '1px solid rgba(125,211,252,0.07)', borderBottom: '1px solid rgba(125,211,252,0.07)' }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-10">
          <AnimatedStat value={248} label="Disclosed Donations" suffix="+" />
          <AnimatedStat value={12}  label="Political Parties Tracked" />
          <AnimatedStat value={4}   label="Billion KES Mapped" prefix="~" suffix="B" />
          <AnimatedStat value={89}  label="Donor Entities Profiled" suffix="+" />
        </div>
      </section>

      {/* ── Platform Capabilities ───────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#E11D48' }}>Intelligence Modules</p>
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">
            Explore the KweliNet<br />Intelligence Platform
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <button
              key={f.path}
              onClick={() => navigate(f.path)}
              className="group relative text-left p-7 rounded-xl transition-all duration-300"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.background = f.glow; el.style.border = `1px solid ${f.color}44`; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = `0 0 30px ${f.glow}`; }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'rgba(255,255,255,0.02)'; el.style.border = '1px solid rgba(255,255,255,0.06)'; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-5" style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}>
                <f.icon size={22} style={{ color: f.color }} />
              </div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white">{f.title}</h3>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
            </button>
          ))}
          <div
            className="rounded-xl p-7 flex flex-col items-center justify-center text-center gap-4 sm:col-span-2 lg:col-span-1"
            style={{ background: 'rgba(225,29,72,0.04)', border: '1px dashed rgba(225,29,72,0.2)' }}
          >
            <AlertTriangle size={28} style={{ color: '#E11D48', opacity: 0.6 }} />
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">Submit anonymous tips, leaks, and evidence through our encrypted Secure Vault.</p>
            <button
              onClick={() => navigate('/vault')}
              className="text-xs font-bold tracking-wider uppercase px-4 py-2 rounded"
              style={{ color: '#E11D48', border: '1px solid rgba(225,29,72,0.3)' }}
            >
              Submit Tip →
            </button>
          </div>
        </div>
      </section>

      {/* ── Pipeline ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-12" style={{ background: 'rgba(7,9,15,0.85)', borderTop: '1px solid rgba(125,211,252,0.06)', borderBottom: '1px solid rgba(125,211,252,0.06)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#7DD3FC' }}>Methodology</p>
            <h2 className="text-4xl lg:text-5xl font-black text-white">From Disclosure to<br />Public Accountability</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 relative">
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(125,211,252,0.22) 20%, rgba(125,211,252,0.22) 80%, transparent)' }} />
            {pipelineSteps.map((step) => (
              <div key={step.num} className="relative flex flex-col items-center text-center px-4 mb-10 lg:mb-0">
                <div className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(11,15,25,1)', border: '2px solid rgba(125,211,252,0.22)', boxShadow: '0 0 20px rgba(125,211,252,0.08)' }}>
                  <step.icon size={26} style={{ color: '#7DD3FC' }} />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black" style={{ background: '#E11D48', color: '#fff' }}>{step.num}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Civic Impact ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-12" style={{ background: 'rgba(8,10,18,0.95)' }}>
        <div className="max-w-4xl mx-auto text-center mb-16">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#FBBF24' }}>Our Mission</p>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">Why Political Finance<br />Transparency Matters</h2>
          <p className="text-slate-400 text-lg leading-relaxed">Campaign finance shapes political power, policy priorities, and electoral outcomes. Yet disclosure records are often fragmented and difficult to interpret.</p>
          <p className="text-slate-500 text-base leading-relaxed mt-4">KweliNet transforms complex political finance disclosures into accessible investigative intelligence tools that strengthen democratic accountability.</p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Eye,    title: 'Transparency',    desc: 'Expose financial networks behind political actors and trace flows of influence.',                  color: '#7DD3FC' },
            { icon: Shield, title: 'Accountability',  desc: 'Surface verified violations, misconduct, and patterns of regulatory breaches.',                   color: '#E11D48' },
            { icon: Zap,    title: 'Public Awareness', desc: 'Equip journalists, researchers, and civil society with actionable financial intelligence.',       color: '#FBBF24' },
          ].map(p => (
            <div key={p.title} className="p-8 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: `${p.color}15`, border: `1px solid ${p.color}30` }}>
                <p.icon size={24} style={{ color: p.color }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{p.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="py-28 px-6 text-center relative overflow-hidden" style={{ background: '#0B0F19' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(225,29,72,0.08) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">Start Exploring Political<br />Finance Intelligence</h2>
          <p className="text-slate-400 mb-10 text-lg">Join journalists, researchers, and civil society organizations using KweliNet to follow the money in Kenyan politics.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/flow')}
              className="px-8 py-4 rounded-md font-bold text-base text-white transition-all"
              style={{ background: '#E11D48', boxShadow: '0 0 30px rgba(225,29,72,0.4)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 0 45px rgba(225,29,72,0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(225,29,72,0.4)'; }}
            >
              Explore the Platform
            </button>
            <button
              onClick={() => navigate('/vault')}
              className="px-8 py-4 rounded-md font-semibold text-base transition-all"
              style={{ background: 'transparent', color: '#7DD3FC', border: '1.5px solid rgba(125,211,252,0.3)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(125,211,252,0.07)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Submit a Secure Tip
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="px-6 lg:px-12 py-10" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(7,9,15,1)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: 'rgba(225,29,72,0.14)', border: '1px solid rgba(225,29,72,0.34)' }}>
                <Activity size={14} style={{ color: '#E11D48' }} />
              </div>
              <span className="font-bold text-white">KweliNet</span>
            </div>
            <p className="text-xs text-slate-600">Political Finance Transparency Platform</p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-slate-600 mb-3">Data Sources</p>
            <ul className="space-y-1 text-xs text-slate-500">
              <li>Office of the Registrar of Political Parties (ORPP)</li>
              <li>International IDEA Political Finance Database</li>
            </ul>
          </div>
          <div className="flex items-end">
            <p className="text-xs text-slate-700">© 2026 KweliNet. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
