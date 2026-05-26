import { motion } from "framer-motion";
import { BookOpen, Play, Sparkles } from "lucide-react";
import { GlassCard } from "../components/MiniWidgets";

const PICKS = [
  { title: "Fractions Made Fun",  by: "Khan Academy",   mins: 12, color: "from-purple-500 to-pink-500", Icon: BookOpen },
  { title: "Space Exploration",   by: "NASA Kids",      mins: 8,  color: "from-blue-500 to-cyan-500",   Icon: Sparkles },
  { title: "Learn to Code",       by: "Scratch",        mins: 20, color: "from-emerald-500 to-teal-500",Icon: Play },
  { title: "World Animals",       by: "Nat Geo Kids",   mins: 10, color: "from-amber-500 to-orange-500",Icon: BookOpen },
];

export default function LearningZone() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Learning Zone</h1>
      <p className="text-slate-400 text-sm">Hand-picked safe content just for you.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PICKS.map((p, i) => (
          <motion.div key={p.title}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
          >
            <GlassCard>
              <div className={`w-full aspect-video rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-3`}>
                <p.Icon className="w-10 h-10 text-white" />
              </div>
              <div className="font-semibold">{p.title}</div>
              <div className="text-xs text-slate-400">{p.by} · {p.mins} min</div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
