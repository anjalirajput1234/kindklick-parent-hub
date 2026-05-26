import { motion } from "framer-motion";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { GlassCard } from "../components/MiniWidgets";

const DATA = [
  { day: "Mon", study: 60, break: 20 }, { day: "Tue", study: 75, break: 15 },
  { day: "Wed", study: 50, break: 25 }, { day: "Thu", study: 90, break: 30 },
  { day: "Fri", study: 80, break: 20 }, { day: "Sat", study: 40, break: 40 },
  { day: "Sun", study: 30, break: 50 },
];

export default function StudyStats() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Study Stats</h1>
      <GlassCard>
        <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">Study vs Break (minutes)</div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DATA}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1A1030", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
              <Bar dataKey="study" stackId="a" fill="#A855F7" radius={[0, 0, 0, 0]} />
              <Bar dataKey="break" stackId="a" fill="#EC4899" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </motion.div>
  );
}
