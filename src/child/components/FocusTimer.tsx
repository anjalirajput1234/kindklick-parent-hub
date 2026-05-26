import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import confetti from "canvas-confetti";
// TODO: persist sessions to Supabase `focus_sessions` and xp to `xp_logs`

const PRESETS = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 } as const;
type Mode = keyof typeof PRESETS;

interface Props { onComplete?: (mode: Mode) => void; }

/** Pomodoro timer with SVG ring + ambient sound stub. */
export function FocusTimer({ onComplete }: Props) {
  const [mode, setMode] = useState<Mode>("focus");
  const [seconds, setSeconds] = useState(PRESETS.focus);
  const [running, setRunning] = useState(false);
  const [session, setSession] = useState(1);
  const intRef = useRef<number | null>(null);

  useEffect(() => { setSeconds(PRESETS[mode]); setRunning(false); }, [mode]);

  useEffect(() => {
    if (!running) return;
    intRef.current = window.setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          window.clearInterval(intRef.current!); setRunning(false);
          confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
          onComplete?.(mode);
          if (mode === "focus") setSession(n => n + 1);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => { if (intRef.current) window.clearInterval(intRef.current); };
  }, [running, mode, onComplete]);

  const total = PRESETS[mode];
  const pct = seconds / total;
  const R = 120, CIRC = 2 * Math.PI * R;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-2 p-1 rounded-2xl bg-white/5 border border-white/10">
        {(["focus", "short", "long"] as Mode[]).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition
              ${mode === m ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "text-slate-300 hover:bg-white/5"}`}
          >{m === "focus" ? "Focus" : m === "short" ? "Short Break" : "Long Break"}</button>
        ))}
      </div>

      <div className="relative w-[280px] h-[280px]">
        <svg className="-rotate-90 w-full h-full">
          <circle cx="140" cy="140" r={R} stroke="rgba(255,255,255,0.08)" strokeWidth="14" fill="none" />
          <motion.circle
            cx="140" cy="140" r={R} stroke="url(#ftg)" strokeWidth="14" fill="none"
            strokeLinecap="round" strokeDasharray={CIRC}
            animate={{ strokeDashoffset: CIRC * (1 - pct) }}
            transition={{ duration: 0.5, ease: "linear" }}
          />
          <defs>
            <linearGradient id="ftg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#A855F7" /><stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-6xl font-bold tabular-nums">{mm}:{ss}</div>
          <div className="text-xs text-slate-400 mt-2">Session {session} of 4</div>
          <div className="text-xs text-amber-300 mt-1">+50 XP on complete</div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setRunning(r => !r)}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/30 hover:scale-105 transition">
          {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} {running ? "Pause" : "Start"}
        </button>
        <button onClick={() => { setSeconds(PRESETS[mode]); setRunning(false); }}
          className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button onClick={() => { setSeconds(0); setRunning(false); }}
          className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Ambient sound selector — UI only. TODO: wire <audio> elements. */}
      <div className="flex gap-2 flex-wrap justify-center">
        {[["🌧️","Rain"],["🌊","Ocean"],["🌿","Forest"],["☕","Cafe"]].map(([e,l]) => (
          <button key={l} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition">
            {e} {l}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FocusTimer;
