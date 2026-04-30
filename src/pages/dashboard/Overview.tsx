import { motion } from "framer-motion";
import { Clock, ShieldOff, Globe, Shield, Loader2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import { Link } from "react-router-dom";
import { useActiveChild } from "@/hooks/useActiveChild";
import { useChildLive } from "@/hooks/useChildLive";
import { useMemo } from "react";

const CAT_COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#7C3AED", "#EF4444", "#EC4899"];

function fmtMin(min: number) {
  return `${Math.floor(min / 60)}h ${min % 60}m`;
}
function barColor(min: number, limit: number) {
  if (min < limit * 0.6) return "hsl(var(--success))";
  if (min < limit * 0.85) return "hsl(var(--warning))";
  return "hsl(var(--danger))";
}

export default function Overview() {
  const { child, loading: cLoading } = useActiveChild();
  const { sessions, today, weekly, blocked, loading } = useChildLive(child?.id ?? null);

  const limit = today?.limit_minutes ?? child?.daily_limit_minutes ?? 240;
  const todayMin = today?.total_minutes ?? 0;

  const last24h = useMemo(() => {
    const cutoff = Date.now() - 24 * 3600_000;
    return sessions.filter(s => new Date(s.visited_at).getTime() >= cutoff);
  }, [sessions]);

  const blockedToday = useMemo(() =>
    last24h.filter(s => s.status === "blocked").length, [last24h]);

  const safetyScore = useMemo(() => {
    if (last24h.length === 0) return 100;
    const safe = last24h.filter(s => s.status === "safe").length;
    return Math.round((safe / last24h.length) * 100);
  }, [last24h]);

  const stats = [
    { icon: Clock, label: "Screen Time", value: fmtMin(todayMin), sub: `of ${fmtMin(limit)} limit`, color: "primary" },
    { icon: ShieldOff, label: "Blocked", value: blockedToday.toString(), sub: `${blocked.length} on block list`, color: "danger" },
    { icon: Globe, label: "Sites Visited", value: last24h.length.toString(), sub: `${new Set(last24h.map(s => s.category).filter(Boolean)).size} categories`, color: "secondary" },
    { icon: Shield, label: "Safety Score", value: `${safetyScore}%`, sub: safetyScore >= 90 ? "Excellent" : safetyScore >= 70 ? "Good" : "Needs attention", color: "success" },
  ];

  const colorMap: Record<string, string> = {
    primary: "border-primary/30 text-primary bg-primary/5",
    danger: "border-danger/30 text-danger bg-danger/5",
    secondary: "border-secondary/30 text-secondary bg-secondary/5",
    success: "border-success/30 text-success bg-success/5",
  };

  // Build weekly chart (last 7 days, fill missing)
  const weeklyChart = useMemo(() => {
    const map = new Map(weekly.map(w => [w.date, w.total_minutes]));
    const out: { day: string; minutes: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400_000);
      const key = d.toISOString().slice(0, 10);
      out.push({ day: d.toLocaleDateString("en", { weekday: "short" }), minutes: map.get(key) ?? 0 });
    }
    return out;
  }, [weekly]);

  // Categories from last 7 days
  const categoryData = useMemo(() => {
    const cutoff = Date.now() - 7 * 86400_000;
    const counts: Record<string, number> = {};
    sessions.forEach(s => {
      if (new Date(s.visited_at).getTime() < cutoff) return;
      const k = s.category ?? "Other";
      counts[k] = (counts[k] ?? 0) + 1;
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(counts).map(([name, v], i) => ({
      name, value: Math.round((v / total) * 100), color: CAT_COLORS[i % CAT_COLORS.length],
    })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [sessions]);

  // Safety trend (last 14 days)
  const safetyTrend = useMemo(() => {
    const buckets = new Map<string, { safe: number; total: number }>();
    sessions.forEach(s => {
      const day = s.visited_at.slice(0, 10);
      const b = buckets.get(day) ?? { safe: 0, total: 0 };
      b.total++; if (s.status === "safe") b.safe++;
      buckets.set(day, b);
    });
    const out: { day: string; score: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400_000).toISOString().slice(0, 10);
      const b = buckets.get(d);
      out.push({ day: d.slice(5), score: b && b.total > 0 ? Math.round((b.safe / b.total) * 100) : 100 });
    }
    return out;
  }, [sessions]);

  if (cLoading || loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className={`bg-card border-2 ${colorMap[s.color]} rounded-2xl p-5 shadow-soft hover:shadow-elevated transition-shadow`}>
            <div className={`w-10 h-10 rounded-xl bg-${s.color}/10 flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 text-${s.color}`} />
            </div>
            <p className="text-3xl font-extrabold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label} · {s.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-soft">
          <h3 className="font-bold">Weekly screen time</h3>
          <p className="text-xs text-muted-foreground mb-3">Daily limit: {fmtMin(limit)}</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "hsl(var(--muted))" }}
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }}
                formatter={(v: number) => [fmtMin(v), "Time"]} />
              <ReferenceLine y={limit} stroke="hsl(var(--danger))" strokeDasharray="4 4" />
              <Bar dataKey="minutes" radius={[10, 10, 0, 0]} animationDuration={800}>
                {weeklyChart.map((d, i) => <Cell key={i} fill={barColor(d.minutes, limit)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-5 shadow-soft">
          <h3 className="font-bold mb-1">Site categories</h3>
          <p className="text-xs text-muted-foreground mb-3">Last 7 days</p>
          {categoryData.length === 0 ? (
            <p className="text-sm text-muted-foreground py-12 text-center">No activity yet</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={3} animationDuration={800}>
                    {categoryData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {categoryData.map(c => (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                      <span>{c.name}</span>
                    </div>
                    <span className="font-semibold">{c.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-2xl p-5 shadow-soft">
        <h3 className="font-bold mb-1">Safety score · last 14 days</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={safetyTrend}>
            <defs>
              <linearGradient id="safetyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
            <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#safetyGrad)" animationDuration={1000} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-2xl p-5 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Recent activity {child && <span className="text-xs font-normal text-muted-foreground">· {child.name}</span>}</h3>
          <Link to="/dashboard/history" className="text-xs font-semibold text-primary hover:underline">View all →</Link>
        </div>
        <div className="space-y-1.5">
          {sessions.slice(0, 8).map((a) => (
            <motion.div key={a.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-sm font-bold text-primary shrink-0">
                {a.domain[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{a.domain}</p>
                <p className="text-xs text-muted-foreground truncate">{a.title ?? "—"}</p>
              </div>
              {a.category && <span className="hidden sm:inline-flex text-[10px] px-2 py-1 rounded-full bg-muted font-semibold">{a.category}</span>}
              <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
                a.status === "safe" ? "bg-success/15 text-success" :
                a.status === "warning" ? "bg-warning/15 text-warning" :
                "bg-danger/15 text-danger"
              }`}>{a.status === "safe" ? "✓ Safe" : a.status === "warning" ? "⚠ Warn" : "✗ Block"}</span>
              <span className="text-xs text-muted-foreground w-14 text-right">
                {new Date(a.visited_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </motion.div>
          ))}
          {sessions.length === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No activity yet. Pair a device in Settings to start monitoring.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
