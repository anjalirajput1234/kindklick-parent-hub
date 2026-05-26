import { Shield, ShieldCheck, ShieldAlert } from "lucide-react";
import { GlassCard } from "./MiniWidgets";

/** Safe browsing snapshot card. */
export function SafeBrowsingWidget() {
  return (
    <GlassCard accent="green">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-4 h-4 text-green-300" />
        <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Safe Browsing</span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-xl bg-green-500/10 p-3">
          <ShieldCheck className="w-5 h-5 text-green-300 mx-auto" />
          <div className="text-2xl font-bold mt-1">42</div>
          <div className="text-[10px] text-slate-400 uppercase">Safe visits</div>
        </div>
        <div className="rounded-xl bg-red-500/10 p-3">
          <ShieldAlert className="w-5 h-5 text-red-300 mx-auto" />
          <div className="text-2xl font-bold mt-1">3</div>
          <div className="text-[10px] text-slate-400 uppercase">Blocked</div>
        </div>
      </div>
    </GlassCard>
  );
}

export default SafeBrowsingWidget;
