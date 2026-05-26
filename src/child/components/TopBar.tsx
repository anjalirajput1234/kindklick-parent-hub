import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Search, Flame } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/** Sticky top bar with greeting, search, streak and bell. */
export function TopBar() {
  const { user } = useAuth();
  const name = user?.email?.split("@")[0] ?? "friend";
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const hour = now.getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between gap-3 py-4"
    >
      <div className="min-w-0">
        <div className="text-xs text-slate-400">{now.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</div>
        <div className="text-base sm:text-lg font-semibold truncate">{greet}, <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">{name}</span> 👋</div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden md:flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 w-56">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            placeholder="Search…"
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-slate-500"
          />
        </div>
        <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-300 text-sm font-semibold">
          <Flame className="w-4 h-4" /> 12
        </div>
        <button className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500" />
        </button>
      </div>
    </motion.header>
  );
}

export default TopBar;
