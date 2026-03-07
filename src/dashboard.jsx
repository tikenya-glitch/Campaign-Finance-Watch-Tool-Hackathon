import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
  Cell, LabelList, PieChart, Pie
} from "recharts";

const CANDIDATES = [
  { name: "A. Wanjiru", party: "NRM",  color: "#34D399", declared: 4200000, limit: 5000000 },
  { name: "D. Ochieng",  party: "ODM",  color: "#60A5FA", declared: 5800000, limit: 5000000 },
  { name: "G. Muthoni",  party: "UDA",  color: "#FBBF24", declared: 3100000, limit: 5000000 },
  { name: "J. Kariuki",  party: "FORD", color: "#F87171", declared: 6200000, limit: 5000000 },
  { name: "P. Atieno",   party: "NRM",  color: "#A78BFA", declared: 2700000, limit: 5000000 },
  { name: "S. Mwenda",   party: "ODM",  color: "#FB923C", declared: 4900000, limit: 5000000 },
];

const TREND_DATA = [
  { month: "Jan", Wanjiru: 380000,  Ochieng: 610000,  Muthoni: 240000,  Kariuki: 720000,  Atieno: 190000,  Mwenda: 320000  },
  { month: "Feb", Wanjiru: 720000,  Ochieng: 950000,  Muthoni: 420000,  Kariuki: 1150000, Atieno: 370000,  Mwenda: 680000  },
  { month: "Mar", Wanjiru: 1280000, Ochieng: 1560000, Muthoni: 740000,  Kariuki: 1720000, Atieno: 680000,  Mwenda: 1200000 },
  { month: "Apr", Wanjiru: 2050000, Ochieng: 2500000, Muthoni: 1300000, Kariuki: 2800000, Atieno: 1100000, Mwenda: 2100000 },
  { month: "May", Wanjiru: 3100000, Ochieng: 3900000, Muthoni: 2100000, Kariuki: 4300000, Atieno: 1800000, Mwenda: 3400000 },
  { month: "Jun", Wanjiru: 4200000, Ochieng: 5800000, Muthoni: 3100000, Kariuki: 6200000, Atieno: 2700000, Mwenda: 4900000 },
];

const CATEGORY_DATA = [
  { category: "Advertising", Wanjiru: 1500000, Ochieng: 2100000, Muthoni: 900000,  Kariuki: 2400000, Atieno: 700000,  Mwenda: 1800000 },
  { category: "Rallies",     Wanjiru: 900000,  Ochieng: 1300000, Muthoni: 700000,  Kariuki: 1500000, Atieno: 580000,  Mwenda: 1100000 },
  { category: "Media",       Wanjiru: 700000,  Ochieng: 1200000, Muthoni: 500000,  Kariuki: 1100000, Atieno: 620000,  Mwenda: 920000  },
  { category: "Logistics",   Wanjiru: 1100000, Ochieng: 1200000, Muthoni: 1000000, Kariuki: 1200000, Atieno: 800000,  Mwenda: 1080000 },
];

const DONOR_DATA = [
  { name: "Individual",  value: 38, amount: 10640000, color: "#34D399" },
  { name: "Corporate",   value: 34, amount: 9520000,  color: "#60A5FA" },
  { name: "Party Funds", value: 18, amount: 5040000,  color: "#FBBF24" },
  { name: "NGO / PAC",   value: 10, amount: 2800000,  color: "#A78BFA" },
];

const fmt = (n) => `KES ${(n / 1000000).toFixed(1)}M`;
const RADIAN = Math.PI / 180;

const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0D1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>
      <div style={{ color: "#6B7280", marginBottom: 6, letterSpacing: 1 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <span style={{ color: "#E5E7EB" }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      style={{ fontFamily: "IBM Plex Mono", fontSize: 12, fontWeight: 700 }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Dashboard() {
  const [activeLines, setActiveLines] = useState(
    Object.fromEntries(["Wanjiru","Ochieng","Muthoni","Kariuki","Atieno","Mwenda"].map(n => [n, true]))
  );
  const [hoveredDonor, setHoveredDonor] = useState(null);
  const toggle = (name) => setActiveLines(prev => ({ ...prev, [name]: !prev[name] }));

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", color: "#111827", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&family=IBM+Plex+Mono:wght@400;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        .card { animation: fadeUp 0.5s ease both; background: #fff; border: 1px solid #E5E7EB; border-radius: 16px; padding: 22px 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
        .card:nth-child(1) { animation-delay: 0.05s }
        .card:nth-child(2) { animation-delay: 0.15s }
        .card:nth-child(3) { animation-delay: 0.25s }
        .card:nth-child(4) { animation-delay: 0.32s }
        .tog { transition: all 0.15s ease; cursor: pointer; border: none; }
        .tog:hover { opacity: 0.75; transform: scale(0.96); }
        .donor-row { transition: background 0.15s; border-radius: 8px; padding: 10px 12px; cursor: default; }
        ::-webkit-scrollbar { width: 4px }
        ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 4px }
      `}</style>

      {/* HEADER */}
      <header style={{
        borderBottom: "1px solid #E5E7EB", padding: "14px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#fff", position: "sticky", top: 0, zIndex: 50,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#1D4ED8,#0891B2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🗳</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#111827" }}>NURU YA FEDHA</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#6B7280", letterSpacing: 2 }}>CAMPAIGN FINANCE MONITOR</div>
          </div>
        </div>
        {/* <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px #10B981" }} />
        </div> */}
      </header>

      <main style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 22, maxWidth: 1300, margin: "0 auto" }}>

        {/* ── CHART 1: Declared vs Limit ── */}
        <div className="card" style={{ padding: "22px 26px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#9CA3AF", letterSpacing: 2, textTransform: "uppercase", marginBottom: 5 }}>Chart 01</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 700 }}>Campaign Spending vs Legal Limit</h2>
            </div>
            <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
              {[["#3B82F6","Spending Limit"],["#22C55E","Declared Spending"],["#EF4444","Overspending"]].map(([c,l]) => (
                <div key={l} style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <div style={{ width:12, height:12, borderRadius:3, background:c }} />
                  <span style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:10, color:"#6B7280" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={CANDIDATES.map(c => ({ name: c.name, party: c.party, limit: c.limit, withinLimit: Math.min(c.declared, c.limit), overspend: c.declared > c.limit ? c.declared - c.limit : 0, declared: c.declared, isOver: c.declared > c.limit }))}
              margin={{ top: 24, right: 20, bottom: 4, left: 10 }} barCategoryGap="30%" barGap={5}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#6B7280", fontSize: 12, fontFamily: "IBM Plex Mono" }} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} />
              <YAxis tickFormatter={v => `${(v/1000000).toFixed(0)}M`} tick={{ fill: "#9CA3AF", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} domain={[0, 7500000]} />
              <Tooltip content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0]?.payload;
                return (
                  <div style={{ background: "#0D1117", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 9, padding: "12px 16px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, minWidth: 190 }}>
                    <div style={{ color: "#9CA3AF", marginBottom: 8 }}>{label} · {d?.party}</div>
                    <div style={{ color: "#3B82F6", marginBottom: 3 }}>Spending Limit: <span style={{ color: "#E5E7EB" }}>{fmt(d?.limit)}</span></div>
                    <div style={{ color: "#22C55E", marginBottom: 3 }}>Declared (within): <span style={{ color: "#E5E7EB" }}>{fmt(d?.withinLimit)}</span></div>
                    {d?.overspend > 0 && <div style={{ color: "#EF4444", marginBottom: 3 }}>Overspend: <span style={{ fontWeight: 600 }}>+{fmt(d?.overspend)}</span></div>}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: 7, paddingTop: 7, color: d?.isOver ? "#EF4444" : "#22C55E" }}>Total: {fmt(d?.declared)} {d?.isOver ? "⚠" : "✓"}</div>
                  </div>
                );
              }} />
              <Bar dataKey="limit" name="Spending Limit" stackId="limit" fill="#3B82F6" radius={[5,5,0,0]} maxBarSize={52}>
                <LabelList dataKey="limit" position="top" formatter={v => fmt(v)} style={{ fontFamily: "IBM Plex Mono", fontSize: 10, fill: "#6B7280" }} />
              </Bar>
              <Bar dataKey="withinLimit" name="Declared Spending" stackId="declared" fill="#22C55E" maxBarSize={52} />
              <Bar dataKey="overspend" name="Overspending" stackId="declared" fill="#EF4444" radius={[5,5,0,0]} maxBarSize={52}>
                <LabelList content={({ x, y, width, index }) => {
                  const d = CANDIDATES[index];
                  if (!d) return null;
                  return <text x={x + width / 2} y={y - 6} textAnchor="middle" style={{ fontFamily: "IBM Plex Mono", fontSize: 10, fill: d.declared > d.limit ? "#EF4444" : "#22C55E", fontWeight: 600 }}>{fmt(d.declared)}</text>;
                }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── CHARTS 2 & 3 ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1.1fr 1fr", gap:22 }}>
          <div className="card">
            <div style={{ marginBottom:16 }}>
              <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:9, color:"#9CA3AF", letterSpacing:2, textTransform:"uppercase", marginBottom:5 }}>Chart 02</div>
              <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:19, fontWeight:700 }}>Spending Over Time</h2>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
              {CANDIDATES.map(c => {
                const key = c.name.split(". ")[1];
                const on = activeLines[key];
                return (
                  <button key={key} className="tog" onClick={() => toggle(key)} style={{ background: on ? `${c.color}22` : "#F9FAFB", border:`1px solid ${on ? c.color+"88" : "#E5E7EB"}`, borderRadius:20, padding:"3px 11px", fontFamily:"'IBM Plex Mono', monospace", fontSize:10, color: on ? c.color : "#9CA3AF" }}>{c.name}</button>
                );
              })}
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={TREND_DATA} margin={{ top:4, right:10, bottom:0, left:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" tick={{ fill:"#9CA3AF", fontSize:11, fontFamily:"IBM Plex Mono" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `${(v/1000000).toFixed(0)}M`} tick={{ fill:"#9CA3AF", fontSize:10, fontFamily:"IBM Plex Mono" }} axisLine={false} tickLine={false} />
                <Tooltip content={<DarkTooltip />} />
                <ReferenceLine y={5000000} stroke="#EF444455" strokeDasharray="5 4" label={{ value:"Legal Limit", position:"right", fill:"#EF4444", fontSize:10, fontFamily:"IBM Plex Mono" }} />
                {[["Wanjiru","#34D399"],["Ochieng","#60A5FA"],["Muthoni","#FBBF24"],["Kariuki","#F87171"],["Atieno","#A78BFA"],["Mwenda","#FB923C"]].map(([name, color]) => (
                  <Line key={name} type="monotone" dataKey={name} stroke={color} strokeWidth={activeLines[name] ? 2 : 0} dot={false} activeDot={activeLines[name] ? { r:4, strokeWidth:0 } : false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div style={{ marginBottom:16 }}>
              <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:9, color:"#9CA3AF", letterSpacing:2, textTransform:"uppercase", marginBottom:5 }}>Chart 03</div>
              <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:19, fontWeight:700 }}>Spending by Category</h2>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={CATEGORY_DATA} margin={{ top:4, right:8, bottom:0, left:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="category" tick={{ fill:"#6B7280", fontSize:11, fontFamily:"IBM Plex Mono" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `${(v/1000000).toFixed(0)}M`} tick={{ fill:"#9CA3AF", fontSize:10, fontFamily:"IBM Plex Mono" }} axisLine={false} tickLine={false} />
                <Tooltip content={<DarkTooltip />} />
                {[["Wanjiru","#34D399"],["Ochieng","#60A5FA"],["Muthoni","#FBBF24"],["Kariuki","#F87171"],["Atieno","#A78BFA"],["Mwenda","#FB923C"]].map(([name,color]) => (
                  <Bar key={name} dataKey={name} stackId="a" fill={color} />
                ))}
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"5px 14px", marginTop:12 }}>
              {CANDIDATES.map(c => (
                <div key={c.name} style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <div style={{ width:8, height:8, borderRadius:2, background:c.color }} />
                  <span style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:10, color:"#6B7280" }}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CHART 4: Donor Categories Pie ── */}
        <div className="card" style={{ padding: "22px 26px" }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#9CA3AF", letterSpacing: 2, textTransform: "uppercase", marginBottom: 5 }}>Chart 04</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 700 }}>Donor Categories Breakdown</h2>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#9CA3AF", marginTop: 4 }}>Proportion of total campaign contributions by donor type · all candidates combined</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 40, alignItems: "center" }}>

            {/* Pie */}
            <div style={{ position: "relative" }}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={DONOR_DATA} cx="50%" cy="50%"
                    innerRadius={75} outerRadius={120}
                    paddingAngle={3} dataKey="value"
                    labelLine={false} label={PieLabel}
                    onMouseEnter={(_, i) => setHoveredDonor(i)}
                    onMouseLeave={() => setHoveredDonor(null)}
                  >
                    {DONOR_DATA.map((d, i) => (
                      <Cell key={i} fill={d.color}
                        opacity={hoveredDonor === null || hoveredDonor === i ? 1 : 0.3}
                        stroke="#fff" strokeWidth={hoveredDonor === i ? 3 : 1.5}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div style={{ background: "#0D1117", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 9, padding: "12px 16px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>
                        <div style={{ color: d.color, fontWeight: 600, marginBottom: 6 }}>{d.name}</div>
                        <div style={{ color: "#9CA3AF", marginBottom: 3 }}>Share: <span style={{ color: "#E5E7EB" }}>{d.value}%</span></div>
                        <div style={{ color: "#9CA3AF" }}>Amount: <span style={{ color: "#E5E7EB" }}>{fmt(d.amount)}</span></div>
                      </div>
                    );
                  }} />
                </PieChart>
              </ResponsiveContainer>
              {/* Centre label */}
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", pointerEvents: "none" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#111827", lineHeight: 1 }}>
                  {hoveredDonor !== null ? `${DONOR_DATA[hoveredDonor].value}%` : fmt(DONOR_DATA.reduce((s,d) => s+d.amount, 0))}
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#9CA3AF", marginTop: 4, letterSpacing: 1 }}>
                  {hoveredDonor !== null ? DONOR_DATA[hoveredDonor].name.toUpperCase() : "TOTAL RAISED"}
                </div>
              </div>
            </div>

            {/* Breakdown list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#9CA3AF", letterSpacing: 1, marginBottom: 4 }}>
                TOTAL · {fmt(DONOR_DATA.reduce((s,d) => s+d.amount, 0))}
              </div>

              {DONOR_DATA.map((d, i) => (
                <div key={d.name} className="donor-row"
                  style={{ background: hoveredDonor === i ? `${d.color}12` : "transparent", border: `1px solid ${hoveredDonor === i ? d.color+"33" : "transparent"}` }}
                  onMouseEnter={() => setHoveredDonor(i)}
                  onMouseLeave={() => setHoveredDonor(null)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 12, height: 12, borderRadius: 3, background: d.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{d.name}</span>
                    </div>
                    <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#374151" }}>{fmt(d.amount)}</span>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: d.color, fontWeight: 700, minWidth: 36, textAlign: "right" }}>{d.value}%</span>
                    </div>
                  </div>
                  <div style={{ height: 6, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${d.value}%`, height: "100%", background: d.color, borderRadius: 3, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 8, padding: "12px 14px", background: "#F9FAFB", borderRadius: 10, border: "1px solid #E5E7EB" }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#6B7280", marginBottom: 4 }}>
                  🏆 Largest source: <span style={{ color: "#34D399", fontWeight: 600 }}>Individual (38%)</span>
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#6B7280" }}>
                  Corporate + Party funds = <span style={{ color: "#111827", fontWeight: 600 }}>52%</span> of all contributions
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      <footer style={{ padding:"12px 32px", borderTop:"1px solid #E5E7EB", display:"flex", justifyContent:"space-between", marginTop: 8 }}>
        <span style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:9, color:"#9CA3AF" }}>NURU YA FEDHA</span>
      </footer>
    </div>
  );
}