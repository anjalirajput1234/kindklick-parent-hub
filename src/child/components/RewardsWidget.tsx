import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard } from "./MiniWidgets";

/** XP / level summary card. */
export function RewardsWidget({ xp = 1240, level = 7, levelName = "Focus Champion" }: { xp?: number; level?: number; levelName?: string }) {
  return (
    <GlassCard accent="amber">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">XP Points</span>
        <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
          <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
        </motion.div>
      </div>
      <div className="text-4xl font-bold tabular-nums">{xp.toLocaleString()}</div>
      <div className="text-xs text-slate-400 mt-2">Level {level} · {levelName}</div>
    </GlassCard>
  );
}

export default RewardsWidget;
