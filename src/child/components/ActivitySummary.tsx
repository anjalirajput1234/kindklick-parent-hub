import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";
import { GlassCard } from "./MiniWidgets";

const APPS = [
  { name: "YouTube Kids", icon: "📺", time: "45m", safe: true },
  { name: "Khan Academy", icon: "🎓", time: "32m", safe: true },
  { name: "Duolingo",     icon: "🦉", time: "18m", safe: true },
  { name: "Scratch",      icon: "🐱", time: "25m", safe: true },
];
const SITES = [
  { domain: "khanacademy.org", safe: true },
  { domain: "wikipedia.org",   safe: true },
  { domain: "scratch.mit.edu", safe: true },
  { domain: "nasa.gov",        safe: true },
];
const STUDY = [
  { day: "Mon", study: 60, break: 20 }, { day: "Tue", study: 75, break: 15 },
  { day: "Wed", study: 50, break: 25 }, { day: "Thu", study: 90, break: 30 },
  { day: "Fri", study: 80, break: 20 }, { day: "Sat", study: 40, break: 40 },
  { day: "Sun", study: 30, break: 50 },
];

/** Horizontally scrollable today-snapshot cards: apps, sites, study/break. */
export function ActivitySummary() {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Activity Summary</h3>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin -mx-1 px-1">
        <GlassCard className="min-w-[260px]">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">Apps opened</div>
          <ul className="space-y-2">
            {APPS.map(a => (
              <li key={a.name} className="flex items-center gap-2 text-sm">
                <span className="text-lg">{a.icon}</span>
                <span className="flex-1 truncate">{a.name}</span>
                <span className="text-slate-400 text-xs">{a.time}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="min-w-[260px]">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">Top sites</div>
          <ul className="space-y-2">
            {SITES.map(s => (
              <li key={s.domain} className="flex items-center gap-2 text-sm">
                <span className="flex-1 truncate">{s.domain}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 font-semibold">SAFE</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="min-w-[280px]">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">Study vs Break</div>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STUDY}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Bar dataKey="study" stackId="a" fill="#A855F7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="break" stackId="a" fill="#EC4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="min-w-[220px]" accent="amber">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Top app</div>
          <div className="text-3xl mb-2">📺</div>
          <div className="font-semibold">YouTube Kids</div>
          <div className="text-xs text-slate-400">45 min today</div>
        </GlassCard>
      </div>
    </div>
  );
}

export default ActivitySummary;
