import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Mail, Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';

// ─── Particle Canvas overlay for Left Panel ──────────────────────────────────
function ParticleOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const PARTICLES = 80;
    const particles = Array.from({ length: PARTICLES }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.3, // slight upward drift
      size: 1 + Math.random() * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
      pulse: Math.random() * Math.PI * 2,
      risk: Math.random() > 0.85,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        p.pulse += p.pulseSpeed;
        const alpha = 0.2 + 0.5 * Math.sin(p.pulse);
        const radius = p.size * (1 + 0.3 * Math.sin(p.pulse));

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 3, 0, Math.PI * 2);
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 3);
        const col = p.risk ? '225,29,72' : '125,211,252';
        grd.addColorStop(0, `rgba(${col},${alpha * 0.6})`);
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},${alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}


// ─── Main Auth Page ─────────────────────────────────────────────────────────
export default function Auth() {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      setError('Invalid email or password. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen flex bg-[#0B0F19] text-[#E5E7EB] font-sans selection:bg-[#E11D48]/30">
      
      {/* ─── LEFT PANEL: NARRATIVE (Hidden on mobile) ───────────────────────── */}
      <div className="hidden lg:flex relative w-1/2 flex-col justify-end p-16 overflow-hidden border-r border-[#7DD3FC]/10">
        
        {/* Background Graphic */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear hover:scale-105"
          style={{ backgroundImage: 'url(/funds.png)', opacity: 0.45 }}
        />
        
        {/* Dark Gradients for blending */}
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/80 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#0B0F19]/40 to-transparent" />
        
        {/* Animated Particles */}
        <ParticleOverlay />

        {/* Narrative Content */}
        <div className="relative z-10 max-w-xl">          
          <h1 className="text-4xl xl:text-5xl font-black leading-tight mb-5 tracking-tight text-white drop-shadow-xl">
            Political Finance <br /> Intelligence.
          </h1>
        </div>
      </div>

      {/* ─── RIGHT PANEL: LOGIN CARD ────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        
        {/* Ambient background glows for the right side */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#E11D48]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#7DD3FC]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-[420px] relative z-10">
          
          {/* Header & Logo */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#E11D48]/10 border border-[#E11D48]/30 shadow-[0_0_20px_rgba(225,29,72,0.15)] mb-5">
              <Activity className="text-[#E11D48]" size={24} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">Admin Access</h2>
            <p className="text-slate-400 text-sm">Restricted access for authorized investigative personnel.</p>
          </motion.div>

          {/* Login Card */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl p-8 shadow-2xl relative"
          >
            {/* Corner embellishments */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#7DD3FC]/30 rounded-tl-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#E11D48]/30 rounded-br-2xl pointer-events-none" />

            <form onSubmit={handleLogin} className="space-y-5">
              
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Secure Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#7DD3FC] text-slate-500">
                    <Mail size={16} />
                  </div>
                  <input 
                    type="email" 
                    required
                    placeholder="admin@kwelinet.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0B0F19]/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#7DD3FC] focus:border-[#7DD3FC] transition-all"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                  <button type="button" className="text-xs text-[#7DD3FC]/70 hover:text-[#7DD3FC] transition-colors">Forgot?</button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#7DD3FC] text-slate-500">
                    <Lock size={16} />
                  </div>
                  <input 
                    type="password" 
                    required
                    placeholder="Enter secure password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0B0F19]/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#7DD3FC] focus:border-[#7DD3FC] transition-all"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-2">
                <button 
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex items-center justify-center gap-2 bg-[#E11D48] overflow-hidden rounded-lg py-3.5 font-bold text-white transition-all hover:shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:-translate-y-[1px] disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={16} className={`transition-transform ${loading ? '' : 'group-hover:translate-x-1'}`} />
                  </span>
                  {/* Subtle hover gradient slide */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                </button>
              </motion.div>

            </form>

            <motion.div variants={itemVariants} className="mt-6 flex items-start gap-2 text-[10px] text-slate-500 border-t border-slate-800 pt-5">
              <ShieldCheck size={14} className="text-[#E11D48] flex-shrink-0 mt-0.5" />
              <p className="leading-snug">
                <span className="text-slate-400 font-semibold block mb-0.5">Authorized access only.</span>
              </p>
            </motion.div>

          </motion.div>
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-center mt-8">
            <p className="text-xs text-slate-600 font-semibold tracking-wider uppercase">Political Finance Intelligence Platform</p>
          </motion.div>
        </div>
      </div>

    </div>
  );
}
