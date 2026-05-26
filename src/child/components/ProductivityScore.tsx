import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard } from "./MiniWidgets";

/** Focus / productivity score card with trend indicator. */
export function ProductivityScore({ score = 87, delta = 4 }: { score?: number; delta?: number }) {
  return (
    <GlassCard accent="green">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Focus Score</span>
        <TrendingUp className="w-4 h-4 text-green-300" />
      </div>
      <div className="flex items-baseline gap-2">
        <motion.span
          key={score}
          initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-bold"
        >{score}</motion.span>
        <span className="text-slate-400 text-sm">/100</span>
      </div>
      <div className={`text-xs mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold
        ${delta >= 0 ? "bg-green-500/15 text-green-300" : "bg-red-500/15 text-red-300"}`}>
        {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}% vs yesterday
      </div>
    </GlassCard>
  );
}

export default ProductivityScore;
