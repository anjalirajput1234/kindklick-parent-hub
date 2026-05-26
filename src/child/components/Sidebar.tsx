import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Activity, BookOpen, Shield, Target, Trophy, Flag,
  Clock, Grid, BarChart2, Bot, Settings, LogOut, ChevronLeft,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface NavItem { to: string; label: string; Icon: typeof Activity; }
const NAV: NavItem[] = [
  { to: "/child/home",         label: "Dashboard",     Icon: LayoutDashboard },
  { to: "/child/activity",     label: "My Activity",   Icon: Activity },
  { to: "/child/learning",     label: "Learning Zone", Icon: BookOpen },
  { to: "/child/browser",      label: "Safe Browser",  Icon: Shield },
  { to: "/child/focus",        label: "Focus Mode",    Icon: Target },
  { to: "/child/rewards",      label: "Rewards",       Icon: Trophy },
  { to: "/child/goals",        label: "Goals",         Icon: Flag },
  { to: "/child/screen-time",  label: "Screen Time",   Icon: Clock },
  { to: "/child/apps",         label: "My Apps",       Icon: Grid },
  { to: "/child/study-stats",  label: "Study Stats",   Icon: BarChart2 },
  { to: "/child/ai-assistant", label: "AI Assistant",  Icon: Bot },
  { to: "/child/settings",     label: "Settings",      Icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}

/** Premium glassmorphism sidebar — collapses 280px ↔ 72px. */
export function Sidebar({ collapsed, onToggle, onNavigate }: SidebarProps) {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const initials = (user?.email?.[0] ?? "K").toUpperCase();

  const handleLogout = async () => { await signOut(); nav("/"); };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 280 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="h-screen flex flex-col bg-white/[0.04] backdrop-blur-xl border-r border-white/10 overflow-hidden"
    >
      {/* Brand */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-purple-500/30">
            K
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              className="font-bold text-base bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent truncate"
            >Kindly</motion.span>
          )}
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors shrink-0"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to} to={to} onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${isActive
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                : "text-slate-300 hover:bg-white/5 hover:text-white"}`
            }
          >
            <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="truncate"
              >{label}</motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer profile */}
      <div className="border-t border-white/10 p-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
            {initials}
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex-1 min-w-0"
            >
              <div className="text-sm font-semibold truncate">{user?.email?.split("@")[0] ?? "Kiddo"}</div>
              <div className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 inline-block font-semibold">⚡ Level 7</div>
            </motion.div>
          )}
          <button
            onClick={handleLogout} aria-label="Logout"
            className="p-2 rounded-lg hover:bg-red-500/20 text-red-300 transition-colors shrink-0"
          ><LogOut className="w-4 h-4" /></button>
        </div>
      </div>
    </motion.aside>
  );
}

export default Sidebar;
