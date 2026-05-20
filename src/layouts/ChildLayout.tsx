import { useNavigate } from "react-router-dom";
import { Shield, LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useActiveChild } from "@/hooks/useActiveChild";
import { mockChild } from "@/lib/mockData";
import ChildDashboard from "@/pages/ChildDashboard";

export default function ChildLayout() {
  const { signOut, user, role } = useAuth();
  const { child: active } = useActiveChild();
  const nav = useNavigate();
  const childName = active?.name || mockChild.name;
  const avatarColor = active?.avatar_color || "#7C3AED";

  const logout = async () => { await signOut(); nav("/"); };

  return (
    <div className="min-h-screen bg-background">
      {/* Simple top bar — no parent nav */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border h-16 flex items-center justify-between px-4 md:px-6 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl gradient-brand flex items-center justify-center shadow-soft">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold gradient-text">KindKlick</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {role === "parent" && (
            <button
              onClick={() => nav("/parent-dashboard")}
              className="flex items-center gap-1 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Back to Parent Dashboard</span><span className="sm:hidden">Parent</span>
            </button>
          )}
          <div className="hidden sm:block text-sm font-semibold">Hi {childName}! 👋</div>
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-soft"
            style={{ background: `linear-gradient(135deg, ${avatarColor}, hsl(var(--accent)))` }}
            title={user?.email ?? childName}
          >
            {childName[0]?.toUpperCase()}
          </div>
          <button
            onClick={logout}
            aria-label="Logout"
            className="w-9 h-9 rounded-xl hover:bg-muted flex items-center justify-center text-danger transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <ChildDashboard />
    </div>
  );
}
