import { motion } from "framer-motion";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { ScreenTimeCard } from "../components/ScreenTimeCard";
import { GlassCard } from "../components/MiniWidgets";

const WEEK = [
  { day: "Mon", mins: 180 }, { day: "Tue", mins: 220 }, { day: "Wed", mins: 140 },
  { day: "Thu", mins: 200 }, { day: "Fri", mins: 240 }, { day: "Sat", mins: 280 }, { day: "Sun", mins: 150 },
];

export default function ScreenTime() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Screen Time</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <ScreenTimeCard usedMinutes={150} limitMinutes={240} />
        <GlassCard accent="blue">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">This week</div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WEEK}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1A1030", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="mins" stroke="#A855F7" strokeWidth={3} dot={{ r: 4, fill: "#EC4899" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}
