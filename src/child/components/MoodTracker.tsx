import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "./MiniWidgets";
// import { supabase } from "@/integrations/supabase/client";
// TODO: persist to Supabase `mood_logs` (id, user_id, mood int, created_at) — RLS: user_id = auth.uid()

const MOODS = [
  { value: 1, emoji: "😢", label: "Sad" },
  { value: 2, emoji: "😕", label: "Meh" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "😊", label: "Good" },
  { value: 5, emoji: "🤩", label: "Amazing" },
];

/** Mood tracker — 5-emoji selector that saves to mood_logs. */
export function MoodTracker() {
  const [picked, setPicked] = useState<number | null>(null);

  const select = async (v: number) => {
    setPicked(v);
    // await supabase.from("mood_logs").insert({ mood: v });
  };

  return (
    <GlassCard accent="purple">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">How are you feeling today?</h3>
        <span className="text-xs text-slate-400">Yesterday: 😊</span>
      </div>
      <div className="flex justify-between gap-2">
        {MOODS.map(m => (
          <motion.button
            key={m.value} onClick={() => select(m.value)}
            whileTap={{ scale: 0.9 }}
            animate={picked === m.value ? { scale: 1.2 } : { scale: 1 }}
            className={`flex-1 text-3xl sm:text-4xl py-3 rounded-xl transition
              ${picked === m.value
                ? "bg-purple-500/20 ring-2 ring-purple-400 shadow-lg shadow-purple-500/40"
                : "hover:bg-white/5"}`}
            aria-label={m.label}
          >{m.emoji}</motion.button>
        ))}
      </div>
    </GlassCard>
  );
}

export default MoodTracker;
