import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Trophy, Sparkles, Target, Shield, Bot, Coins, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ScreenTimeCard } from "../components/ScreenTimeCard";
import { ProductivityScore } from "../components/ProductivityScore";
import { RewardsWidget } from "../components/RewardsWidget";
import { MoodTracker } from "../components/MoodTracker";
import { GoalsSection } from "../components/GoalsSection";
import { ActivitySummary } from "../components/ActivitySummary";
import { HabitTracker } from "../components/HabitTracker";
import { ClockWidget, QuoteWidget, WeatherWidget, GlassCard } from "../components/MiniWidgets";

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

/** ChildHome — primary dashboard with 9 sections. */
export default function ChildHome() {
  const { user } = useAuth();
  const nav = useNavigate();
  const name = user?.email?.split("@")[0] ?? "friend";

  const quick = [
    { label: "Start Focus",   to: "/child/focus",        Icon: Target, grad: "from-purple-500 to-pink-500" },
    { label: "Safe Browse",   to: "/child/browser",      Icon: Shield, grad: "from-blue-500 to-cyan-500"  },
    { label: "Check Rewards", to: "/child/rewards",      Icon: Trophy, grad: "from-amber-500 to-orange-500" },
    { label: "Ask AI Tutor",  to: "/child/ai-assistant", Icon: Bot,    grad: "from-emerald-500 to-teal-500" },
  ];

  return (
    <motion.div
      initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* 1. Welcome banner */}
      <motion.section variants={fade}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600/30 via-pink-500/20 to-blue-600/30 border border-white/10 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 blur-xl opacity-60" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold text-white ring-4 ring-white/20">
              {name[0]?.toUpperCase()}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, <span className="bg-gradient-to-r from-amber-300 to-pink-300 bg-clip-text text-transparent">{name}</span>!</h1>
            <p className="text-slate-300 text-sm mt-1">You're doing amazing today — keep that streak alive! ✨</p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                <span>Level 7 · Focus Champion</span><span>1,240 / 1,500 XP</span>
              </div>
              <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "82%" }} transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-amber-400 via-pink-400 to-purple-400 rounded-full" />
              </div>
            </div>
          </div>
          <div className="flex sm:flex-col items-center gap-2 px-4 py-3 rounded-2xl bg-orange-500/20 border border-orange-400/30">
            <span className="text-3xl">🔥</span>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-300">12</div>
              <div className="text-[10px] text-orange-200 uppercase">Day Streak</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 2. Stat cards row */}
      <motion.section variants={stagger} initial="hidden" animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={fade}><ScreenTimeCard usedMinutes={150} limitMinutes={240} /></motion.div>
        <motion.div variants={fade}><ProductivityScore score={87} delta={4} /></motion.div>
        <motion.div variants={fade}><RewardsWidget xp={1240} level={7} /></motion.div>
        <motion.div variants={fade}>
          <GlassCard accent="blue">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Goals</span>
              <Sparkles className="w-4 h-4 text-blue-300" />
            </div>
            <div className="text-3xl font-bold">3<span className="text-slate-400 text-base"> / 5</span></div>
            <div className="text-xs text-slate-400 mt-1">goals done today</div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mt-3">
              <motion.div initial={{ width: 0 }} animate={{ width: "60%" }} transition={{ duration: 0.8 }}
                className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full" />
            </div>
          </GlassCard>
        </motion.div>
      </motion.section>

      {/* 3. Mood */}
      <motion.section variants={fade}><MoodTracker /></motion.section>

      {/* 4. Quick actions */}
      <motion.section variants={fade} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quick.map(q => (
          <motion.button key={q.label} onClick={() => nav(q.to)}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className={`flex items-center justify-center gap-2 py-4 px-3 rounded-2xl bg-gradient-to-r ${q.grad} text-white font-semibold shadow-lg shadow-purple-500/20`}
          >
            <q.Icon className="w-4 h-4" /><span className="text-sm">{q.label}</span>
          </motion.button>
        ))}
      </motion.section>

      {/* 5 + 6 side-by-side */}
      <div className="grid lg:grid-cols-2 gap-4">
        <motion.section variants={fade}><GoalsSection /></motion.section>
        <motion.section variants={fade}><ActivitySummary /></motion.section>
      </div>

      {/* 7. Rewards preview */}
      <motion.section variants={fade}>
        <GlassCard accent="amber">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-lg font-bold"><Coins className="w-5 h-5 text-amber-300" /> 420</div>
              <div className="flex items-center gap-1 text-lg font-bold"><Star className="w-5 h-5 text-amber-300 fill-amber-300" /> 84</div>
              <div className="hidden sm:block h-8 w-px bg-white/10" />
              <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/30">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span className="text-sm font-semibold text-amber-200">New: 7-Day Streak unlocked!</span>
              </motion.div>
            </div>
            <button onClick={() => nav("/child/rewards")}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:scale-105 transition">
              View all rewards
            </button>
          </div>
        </GlassCard>
      </motion.section>

      {/* 8. Mini widgets */}
      <motion.section variants={fade} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ClockWidget /><QuoteWidget /><WeatherWidget />
      </motion.section>

      {/* 9. Habits */}
      <motion.section variants={fade}>
        <h3 className="font-semibold mb-3">Healthy habits</h3>
        <HabitTracker />
      </motion.section>
    </motion.div>
  );
}
