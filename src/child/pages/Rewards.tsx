import { motion } from "framer-motion";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Trophy, Flame, Target, Star, Shield, BookOpen, Sun, Lock, Coins, Gem } from "lucide-react";
import { GlassCard } from "../components/MiniWidgets";

const BADGES = [
  { id: "streak7",  name: "7-Day Streak",        Icon: Flame,    earned: true },
  { id: "focus1",   name: "First Focus Session", Icon: Target,   earned: true },
  { id: "xp100",    name: "100 XP Earned",       Icon: Star,     earned: true },
  { id: "safe",     name: "Safe Surfer",         Icon: Shield,   earned: true },
  { id: "hw",       name: "Homework Hero",       Icon: BookOpen, earned: false },
  { id: "early",    name: "Early Bird",          Icon: Sun,      earned: false },
];

const CHALLENGES = [
  { label: "Complete 2 focus sessions",  cur: 1, tot: 2, xp: 100 },
  { label: "Log your mood",              cur: 1, tot: 1, xp: 20  },
  { label: "Read for 30 minutes",        cur: 22, tot: 30, xp: 50 },
  { label: "Complete all 5 daily goals", cur: 3, tot: 5, xp: 150 },
];

const XP_WEEK = [
  { day: "Mon", xp: 120 }, { day: "Tue", xp: 80 }, { day: "Wed", xp: 200 },
  { day: "Thu", xp: 150 }, { day: "Fri", xp: 240 }, { day: "Sat", xp: 90 }, { day: "Sun", xp: 180 },
];

/** Rewards page with hero, balances, badges, challenges, XP chart. */
export default function Rewards() {
  useEffect(() => {
    // Celebrate page entry — small burst
    const t = setTimeout(() => confetti({ particleCount: 50, spread: 60, origin: { y: 0.3 } }), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-amber-500/20 via-pink-500/20 to-purple-600/30 p-6 sm:p-8 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.6 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 mb-4 shadow-2xl shadow-amber-500/40">
          <Trophy className="w-12 h-12 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold">Level 7 — Focus Champion</h1>
        <p className="text-slate-300 text-sm mt-1">Keep going! You're on fire 🔥</p>
        <div className="max-w-md mx-auto mt-4">
          <div className="flex justify-between text-xs text-slate-300 mb-1">
            <span>1,240 XP</span><span>1,500 XP</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: "82%" }} transition={{ duration: 1.2 }}
              className="h-full bg-gradient-to-r from-amber-400 via-pink-400 to-purple-400" />
          </div>
        </div>
      </section>

      {/* Balances */}
      <section className="grid grid-cols-3 gap-3">
        {[
          { Icon: Coins, label: "Coins", value: 420, tint: "text-amber-300" },
          { Icon: Star,  label: "Stars", value: 84,  tint: "text-yellow-300" },
          { Icon: Gem,   label: "Gems",  value: 12,  tint: "text-cyan-300" },
        ].map(b => (
          <GlassCard key={b.label}>
            <b.Icon className={`w-5 h-5 ${b.tint}`} />
            <div className="text-2xl font-bold mt-2">{b.value}</div>
            <div className="text-xs text-slate-400">{b.label}</div>
          </GlassCard>
        ))}
      </section>

      {/* Badges */}
      <section>
        <h2 className="font-semibold mb-3">Achievement Badges</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {BADGES.map((b, i) => (
            <motion.div key={b.id}
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 200 }}
              className={`relative aspect-square rounded-2xl p-3 flex flex-col items-center justify-center text-center border
                ${b.earned
                  ? "bg-gradient-to-br from-amber-500/20 to-pink-500/20 border-amber-400/40 shadow-lg shadow-amber-500/20"
                  : "bg-white/[0.03] border-white/10 grayscale opacity-60"}`}
            >
              <b.Icon className={`w-7 h-7 mb-1 ${b.earned ? "text-amber-300" : "text-slate-500"}`} />
              <div className="text-[11px] font-semibold leading-tight">{b.name}</div>
              {!b.earned && <Lock className="absolute top-2 right-2 w-3 h-3 text-slate-400" />}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Challenges */}
      <section>
        <h2 className="font-semibold mb-3">Daily Challenges</h2>
        <div className="space-y-3">
          {CHALLENGES.map(c => {
            const done = c.cur >= c.tot;
            const pct = Math.min(100, (c.cur / c.tot) * 100);
            return (
              <GlassCard key={c.label}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{c.label}</span>
                      <span className="text-xs text-amber-300 font-semibold">+{c.xp} XP</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-purple-400 to-pink-400" />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">{c.cur}/{c.tot}</div>
                  </div>
                  <button disabled={!done}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition
                      ${done ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-105"
                              : "bg-white/5 text-slate-500 cursor-not-allowed"}`}
                  >{done ? "Claim" : "In progress"}</button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* XP chart */}
      <section>
        <h2 className="font-semibold mb-3">XP this week</h2>
        <GlassCard accent="purple">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={XP_WEEK}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1A1030", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                <Bar dataKey="xp" fill="url(#xpg)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="xpg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A855F7" /><stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </section>
    </motion.div>
  );
}
