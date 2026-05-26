import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "../components/MiniWidgets";
import { LogOut } from "lucide-react";

export default function ChildSettings() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <GlassCard>
        <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Account</div>
        <div className="text-sm">{user?.email}</div>
      </GlassCard>
      <GlassCard>
        <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">Preferences</div>
        <div className="space-y-3 text-sm">
          {["Sound effects", "Animations", "Notifications"].map(p => (
            <label key={p} className="flex items-center justify-between cursor-pointer">
              <span>{p}</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-purple-500" />
            </label>
          ))}
        </div>
      </GlassCard>
      <button onClick={async () => { await signOut(); nav("/"); }}
        className="w-full px-4 py-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-200 font-semibold flex items-center justify-center gap-2 hover:bg-red-500/30 transition">
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </motion.div>
  );
}
