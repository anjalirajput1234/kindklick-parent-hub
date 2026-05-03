import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Globe, ShieldOff, Clock, Bell, BookOpen, Bot, Users, FileText, Settings as SettingsIcon,
  Shield, Sun, Moon, ChevronDown, LogOut, User as UserIcon,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useView } from "@/context/ViewContext";
import { ViewToggle } from "@/components/ViewToggle";
import { useActiveChild } from "@/hooks/useActiveChild";
import { mockChild } from "@/lib/mockData";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Overview", end: true },
  { to: "/dashboard/history", icon: Globe, label: "Browsing History" },
  { to: "/dashboard/blocked", icon: ShieldOff, label: "Blocked Sites" },
  { to: "/dashboard/screen-time", icon: Clock, label: "Screen Time" },
  { to: "/dashboard/alerts", icon: Bell, label: "Safety Alerts" },
  { to: "/dashboard/focus", icon: BookOpen, label: "Focus Mode" },
  { to: "/dashboard/ai", icon: Bot, label: "AI Assistant" },
  { to: "/dashboard/children", icon: Users, label: "Multi-Child" },
  { to: "/dashboard/reports", icon: FileText, label: "Reports" },
  { to: "/dashboard/settings", icon: SettingsIcon, label: "Settings" },
];

const TITLES: Record<string, { title: string; sub: string }> = {
  "/dashboard": { title: "Overview", sub: "" },
  "/dashboard/history": { title: "Browsing History", sub: "" },
  "/dashboard/blocked": { title: "Blocked Sites", sub: "" },
  "/dashboard/screen-time": { title: "Screen Time", sub: "" },
  "/dashboard/alerts": { title: "Safety Alerts", sub: "" },
  "/dashboard/focus": { title: "Focus Mode", sub: "" },
  "/dashboard/ai": { title: "AI Assistant", sub: "" },
  "/dashboard/children": { title: "Multi-Child", sub: "" },
  "/dashboard/reports": { title: "Reports", sub: "" },
  "/dashboard/settings": { title: "Settings", sub: "" },
};

export default function DashboardLayout() {
  const { dark, toggle } = useTheme();
  const { signOut, user } = useAuth();
  const { setView } = useView();
  const { child: activeChild } = useActiveChild();
  const nav = useNavigate();
  const loc = useLocation();
  const meta = TITLES[loc.pathname] ?? TITLES["/dashboard"];
  const today = format(new Date(), "EEEE, MMMM d");
  const displayChild = activeChild
    ? { name: activeChild.name, avatarColor: activeChild.avatar_color || "#7C3AED", device: "Chrome Browser" }
    : mockChild;

  const logout = async () => { await signOut(); nav("/"); };

  return (
    <div className="min-h-screen bg-background flex">
      <ViewToggle />

      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col fixed inset-y-0 left-0 z-30">
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-2xl gradient-brand flex items-center justify-center shadow-soft">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold leading-tight gradient-text">KindKlick</p>
              <p className="text-[10px] text-muted-foreground leading-tight">Parent Dashboard</p>
            </div>
          </div>
        </div>

        {/* Child card */}
        <div className="m-3 p-3 rounded-2xl bg-sidebar-accent/50 border border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-soft"
                 style={{ background: `linear-gradient(135deg, ${displayChild.avatarColor}, hsl(var(--accent)))` }}>
              {displayChild.name[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm truncate">{displayChild.name}</p>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="relative flex w-2 h-2">
                  <span className="animate-ping absolute inset-0 rounded-full bg-success opacity-75" />
                  <span className="relative rounded-full w-2 h-2 bg-success" />
                </span>
                Active now
              </div>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">📱 {displayChild.device}</p>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-thin">
          {NAV.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? "bg-primary text-primary-foreground shadow-soft" : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`
              }>
              <item.icon className="w-4 h-4 shrink-0" /> <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border space-y-2">
          <button onClick={() => setView("child")}
            className="w-full text-left text-xs font-semibold rounded-xl px-3 py-2 bg-accent/10 text-accent hover:bg-accent/20 transition-colors">
            👧 Switch to Child View
          </button>
          <NavLink to="/onboarding"
            className="block w-full text-left text-xs font-semibold rounded-xl px-3 py-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            🔗 Setup Extension
          </NavLink>
          <p className="text-[10px] text-muted-foreground text-center">KindKlick v1.0</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-64 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border h-16 flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold leading-tight">{meta.title}</h1>
            <p className="text-xs text-muted-foreground">{today}</p>
          </div>
          <div className="flex items-center gap-3 mr-32">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" /> Safety 98%
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="relative w-10 h-10 rounded-xl hover:bg-muted flex items-center justify-center transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">3</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 rounded-2xl">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Recent alerts</div>
                <DropdownMenuItem className="rounded-xl flex-col items-start">
                  <span className="text-sm font-medium">🚫 Blocked adult content</span>
                  <span className="text-[11px] text-muted-foreground">adult-content.net · 12:05</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl flex-col items-start">
                  <span className="text-sm font-medium">🚫 Scam site blocked</span>
                  <span className="text-[11px] text-muted-foreground">free-prizes-win.xyz · 10:35</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button onClick={toggle} className="w-10 h-10 rounded-xl hover:bg-muted flex items-center justify-center transition-colors">
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-muted transition-colors">
                <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-sm font-bold">
                  {(user?.email?.[0] ?? "P").toUpperCase()}
                </div>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl">
                <DropdownMenuItem className="rounded-xl"><UserIcon className="w-4 h-4 mr-2" /> Profile</DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl" onClick={() => nav("/dashboard/settings")}><SettingsIcon className="w-4 h-4 mr-2" /> Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-xl text-danger" onClick={logout}><LogOut className="w-4 h-4 mr-2" /> Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <motion.main
          key={loc.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="p-6 max-w-[1600px] mx-auto"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
