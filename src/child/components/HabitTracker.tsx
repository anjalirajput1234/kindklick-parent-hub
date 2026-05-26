import { motion } from "framer-motion";
import { Droplet, Moon, Eye, Sparkles } from "lucide-react";

interface Habit {
  icon: typeof Droplet; label: string; detail: string;
  current?: number; target?: number; tint: string; ring: string;
}

const HABITS: Habit[] = [
  { icon: Droplet, label: "Water",    detail: "Drink 8 glasses",   current: 5, target: 8, tint: "bg-blue-500/15 text-blue-300",   ring: "ring-blue-400/40" },
  { icon: Moon,    label: "Sleep",    detail: "Bedtime in 2h 30m",                          tint: "bg-indigo-500/15 text-indigo-300",ring: "ring-indigo-400/40" },
  { icon: Eye,     label: "Eye Break",detail: "Break in 45 min",                            tint: "bg-teal-500/15 text-teal-300",   ring: "ring-teal-400/40" },
  { icon: Sparkles,label: "Stretch",  detail: "Remind at 6:00 PM",                          tint: "bg-green-500/15 text-green-300", ring: "ring-green-400/40" },
];

/** Row of healthy habit reminders with progress where applicable. */
export function HabitTracker() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {HABITS.map((h, i) => {
        const pct = h.current != null && h.target ? Math.round((h.current / h.target) * 100) : null;
        return (
          <motion.div
            key={h.label}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-2xl p-4 border border-white/10 ${h.tint} backdrop-blur-xl ring-1 ${h.ring}`}
          >
            <h.icon className="w-5 h-5 mb-2" />
            <div className="text-sm font-semibold text-white">{h.label}</div>
            <div className="text-[11px] opacity-80">{h.detail}</div>
            {pct != null && (
              <div className="mt-2">
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                    className="h-full bg-current rounded-full" />
                </div>
                <div className="text-[10px] mt-1 opacity-80">{h.current}/{h.target}</div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export default HabitTracker;
