import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import confetti from "canvas-confetti";
import { GlassCard } from "./MiniWidgets";
// TODO: persist to Supabase `daily_goals` (user_id, title, completed, date) — RLS: user_id = auth.uid()

interface Goal { id: number; title: string; done: boolean; }
const SEED: Goal[] = [
  { id: 1, title: "Read for 20 minutes",         done: true  },
  { id: 2, title: "Complete Math quiz",          done: true  },
  { id: 3, title: "No social media for 2 hours", done: true  },
  { id: 4, title: "30 min focus session",        done: false },
  { id: 5, title: "Drink 8 glasses of water",    done: false },
];

/** Daily goals checklist with confetti on completion. */
export function GoalsSection() {
  const [goals, setGoals] = useState(SEED);
  const done = goals.filter(g => g.done).length;
  const pct = (done / goals.length) * 100;

  const toggle = (id: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      const next = { ...g, done: !g.done };
      if (next.done) confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 }, colors: ["#A855F7", "#EC4899", "#F59E0B"] });
      return next;
    }));
  };

  return (
    <GlassCard accent="green">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Today's Goals</h3>
        <span className="text-xs text-slate-400">{done}/{goals.length} completed</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }}
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
      </div>
      <ul className="space-y-2">
        {goals.map(g => (
          <motion.li key={g.id} layout
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer"
            onClick={() => toggle(g.id)}
          >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition
              ${g.done ? "bg-gradient-to-br from-green-400 to-emerald-500" : "bg-white/10 border border-white/20"}`}>
              {g.done && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
            </div>
            <span className={`text-sm ${g.done ? "line-through text-slate-500" : "text-slate-100"}`}>{g.title}</span>
          </motion.li>
        ))}
      </ul>
    </GlassCard>
  );
}

export default GoalsSection;
