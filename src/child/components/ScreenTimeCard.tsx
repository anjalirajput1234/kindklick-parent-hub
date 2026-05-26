import { motion } from "framer-motion";
import { RadialBar, RadialBarChart, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Clock } from "lucide-react";
import { GlassCard } from "./MiniWidgets";

interface Props { usedMinutes?: number; limitMinutes?: number; }

/** Circular radial chart showing today's screen time vs limit. */
export function ScreenTimeCard({ usedMinutes = 150, limitMinutes = 240 }: Props) {
  const pct = Math.min(100, Math.round((usedMinutes / limitMinutes) * 100));
  const data = [{ name: "used", value: pct, fill: "url(#stGrad)" }];
  const h = Math.floor(usedMinutes / 60), m = usedMinutes % 60;

  return (
    <GlassCard accent="purple">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Screen Time</span>
        <Clock className="w-4 h-4 text-purple-300" />
      </div>
      <div className="relative h-32">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart innerRadius="75%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
            <defs>
              <linearGradient id="stGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#A855F7" /><stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar dataKey="value" cornerRadius={20} background={{ fill: "rgba(255,255,255,0.06)" }} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold"
          >{h}h {m}m</motion.div>
          <div className="text-xs text-slate-400">of {Math.floor(limitMinutes / 60)}h limit</div>
        </div>
      </div>
    </GlassCard>
  );
}

export default ScreenTimeCard;
