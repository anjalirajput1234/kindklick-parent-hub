import { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cloud, Quote } from "lucide-react";

/** Reusable glassmorphism card wrapper with optional accent glow. */
export function GlassCard({
  children, className = "", accent,
}: { children: ReactNode; className?: string; accent?: "purple" | "green" | "amber" | "blue" }) {
  const ring = {
    purple: "before:bg-purple-500/30", green: "before:bg-green-500/30",
    amber:  "before:bg-amber-500/30",  blue:  "before:bg-blue-500/30",
  }[accent ?? "purple"];
  return (
    <motion.div
      whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
      className={`relative bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-5
        before:absolute before:-top-px before:left-8 before:right-8 before:h-px ${ring} ${className}`}
    >
      {children}
    </motion.div>
  );
}

const QUOTES = [
  "Small steps every day lead to big results.", "Curiosity is your superpower.",
  "Mistakes are proof you are trying.", "Be the energy you want to attract.",
  "Dream big, start small, act now.", "Done is better than perfect.",
  "Your future self will thank you.", "Learning is a treasure that follows everywhere.",
  "Practice doesn't make perfect — it makes progress.", "The best time to start is now.",
  "Believe you can and you're halfway there.", "Tiny progress is still progress.",
  "Be kind. Be brave. Be curious.", "Greatness starts with a single try.",
  "Your only limit is you.", "Focus on the step in front of you.",
  "You are capable of amazing things.", "Slow progress is still progress.",
  "Bravery is trying again.", "Knowledge grows when shared.",
  "Effort beats talent every time.", "Today's reader, tomorrow's leader.",
  "Mistakes mean you're learning.", "Stay curious, stay kind.",
  "Hard things become easy with practice.", "Every expert was once a beginner.",
  "Your brain loves a challenge.", "Be patient with yourself.",
  "Wins start with showing up.", "You are exactly where you need to be.",
];

/** Live digital clock (12-hour). */
export function ClockWidget() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const h = ((now.getHours() + 11) % 12) + 1;
  const m = String(now.getMinutes()).padStart(2, "0");
  const ap = now.getHours() >= 12 ? "PM" : "AM";
  return (
    <GlassCard accent="blue">
      <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Now</div>
      <div className="text-3xl font-bold tabular-nums">{h}:{m} <span className="text-base text-slate-400">{ap}</span></div>
      <div className="text-xs text-slate-400 mt-1">{now.toLocaleDateString(undefined, { weekday: "long" })}</div>
    </GlassCard>
  );
}

/** Daily rotating motivational quote (deterministic per day-of-year). */
export function QuoteWidget() {
  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const q = QUOTES[day % QUOTES.length];
  return (
    <GlassCard accent="amber">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
        <Quote className="w-3.5 h-3.5" /> Daily Quote
      </div>
      <p className="italic text-sm leading-relaxed text-slate-200">"{q}"</p>
    </GlassCard>
  );
}

/** Weather placeholder — replace static values with OpenWeatherMap API call. */
export function WeatherWidget() {
  // TODO: Replace with OpenWeatherMap API key:
  // fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEY}`)
  return (
    <GlassCard accent="blue">
      <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Weather</div>
      <div className="flex items-center gap-3">
        <Cloud className="w-10 h-10 text-blue-300" />
        <div>
          <div className="text-2xl font-bold">24°C</div>
          <div className="text-xs text-slate-400">Partly cloudy · Mumbai</div>
        </div>
      </div>
    </GlassCard>
  );
}
