import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useActiveChild } from "@/hooks/useActiveChild";
import { supabase } from "@/integrations/supabase/client";
import toast from "react-hot-toast";
import { Copy, RefreshCw, Loader2 } from "lucide-react";

interface Token { id: string; token: string; label: string | null; last_used_at: string | null; is_active: boolean; created_at: string; }

const COLORS = ["#7C3AED", "#3B82F6", "#EC4899", "#10B981", "#F59E0B", "#EF4444"];

function genToken() {
  const arr = new Uint8Array(24);
  crypto.getRandomValues(arr);
  return "kk_" + Array.from(arr, b => b.toString(16).padStart(2, "0")).join("");
}

export default function Settings() {
  const { dark, toggle } = useTheme();
  const { user, signOut } = useAuth();
  const { child } = useActiveChild();
  const [pin, setPin] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loadingTok, setLoadingTok] = useState(true);
  const [limit, setLimit] = useState<number>(240);

  useEffect(() => { if (child) setLimit(child.daily_limit_minutes); }, [child]);

  useEffect(() => {
    if (!child) return;
    (async () => {
      setLoadingTok(true);
      const { data } = await supabase.from("device_tokens").select("*").eq("child_id", child.id).order("created_at", { ascending: false });
      setTokens((data ?? []) as Token[]);
      setLoadingTok(false);
    })();
  }, [child]);

  const createToken = async () => {
    if (!child) return;
    const token = genToken();
    const { data, error } = await supabase.from("device_tokens")
      .insert({ child_id: child.id, token, label: "Chrome Extension" })
      .select().single();
    if (error) { toast.error(error.message); return; }
    setTokens(t => [data as Token, ...t]);
    toast.success("New device token created");
  };

  const revokeToken = async (id: string) => {
    const { error } = await supabase.from("device_tokens").update({ is_active: false }).eq("id", id);
    if (error) toast.error(error.message);
    else { setTokens(ts => ts.map(t => t.id === id ? { ...t, is_active: false } : t)); toast.success("Revoked"); }
  };

  const saveLimit = async () => {
    if (!child) return;
    const { error } = await supabase.from("children").update({ daily_limit_minutes: limit }).eq("id", child.id);
    if (error) toast.error(error.message); else toast.success("Daily limit saved");
  };

  const apiBase = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Pairing tokens */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-5 shadow-soft">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold">🔗 Device pairing tokens</h3>
          <Button onClick={createToken} size="sm" className="rounded-xl gradient-brand text-white">
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Generate token
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Paste a token into the KindKlick Chrome Extension to pair {child?.name ?? "your child"}'s device.
          The extension uses these endpoints:
          <br /><code className="text-[10px] bg-muted px-1 rounded">POST {apiBase}/ingest-session</code>
          <br /><code className="text-[10px] bg-muted px-1 rounded">GET {apiBase}/get-settings</code>
        </p>
        {loadingTok ? <Loader2 className="w-5 h-5 animate-spin" /> : tokens.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tokens yet. Generate one to get started.</p>
        ) : (
          <div className="space-y-2">
            {tokens.map(t => (
              <div key={t.id} className={`p-3 rounded-xl border ${t.is_active ? "border-border bg-muted/30" : "border-border bg-muted/10 opacity-60"}`}>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs font-mono truncate flex-1">{t.token}</code>
                  <button onClick={() => { navigator.clipboard.writeText(t.token); toast.success("Copied"); }}
                    className="p-1.5 rounded-lg hover:bg-muted"><Copy className="w-3.5 h-3.5" /></button>
                  {t.is_active && (
                    <button onClick={() => revokeToken(t.id)} className="text-xs text-danger hover:underline font-semibold">Revoke</button>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {t.label ?? "Device"} · {t.is_active ? "Active" : "Revoked"} · Last used: {t.last_used_at ? new Date(t.last_used_at).toLocaleString() : "never"}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Chrome extension download */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-5 shadow-soft">
        <h3 className="font-bold mb-1">🧩 KindKlick Chrome Extension</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Install on {child?.name ?? "your child"}'s computer to enable real-time monitoring & blocking.
        </p>
        <Button
          size="sm"
          className="rounded-xl gradient-brand text-white"
          onClick={() => {
            fetch("/kindklick-extension.zip")
              .then(r => { if (!r.ok) throw new Error(`Download failed: ${r.status}`); return r.blob(); })
              .then(blob => {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "kindklick-extension.zip";
                a.click();
                URL.revokeObjectURL(a.href);
                toast.success("Extension downloaded");
              })
              .catch(e => toast.error(e.message));
          }}
        >
          ⬇ Download extension (.zip)
        </Button>
        <ol className="text-xs text-muted-foreground mt-3 space-y-1 list-decimal pl-4">
          <li>Unzip the downloaded file.</li>
          <li>Open <code className="bg-muted px-1 rounded">chrome://extensions</code> in Chrome/Edge.</li>
          <li>Enable <b>Developer mode</b> (top-right toggle).</li>
          <li>Click <b>Load unpacked</b> and select the unzipped folder.</li>
          <li>Click the KindKlick icon and paste a device token above.</li>
        </ol>
      </motion.section>

      {/* Child controls */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-card border border-border rounded-2xl p-5 shadow-soft">
        <h3 className="font-bold mb-4">⏱ Daily screen-time limit ({child?.name ?? "—"})</h3>
        <div className="flex items-center gap-3">
          <Input type="number" min={30} max={1440} step={15} value={limit}
            onChange={e => setLimit(Number(e.target.value))}
            className="rounded-2xl max-w-[140px]" />
          <span className="text-sm text-muted-foreground">minutes / day</span>
          <Button onClick={saveLimit} className="rounded-2xl gradient-brand text-white ml-auto">Save</Button>
        </div>
      </motion.section>

      {/* Profile */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-5 shadow-soft">
        <h3 className="font-bold mb-4">👤 Parent profile</h3>
        <div className="space-y-3">
          <div><Label>Email</Label><Input value={user?.email ?? ""} disabled className="rounded-2xl mt-1" /></div>
        </div>
      </motion.section>

      {/* Security */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-card border border-border rounded-2xl p-5 shadow-soft">
        <h3 className="font-bold mb-4">🔒 Security</h3>
        <div className="space-y-3">
          <div><Label>Dashboard PIN (4 digits)</Label>
            <Input maxLength={4} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ""))} placeholder="••••"
              className="rounded-2xl mt-1 max-w-[120px] tracking-widest text-center font-bold" /></div>
          <Button onClick={() => toast.success("PIN saved")} className="rounded-2xl gradient-brand text-white">Save PIN</Button>
        </div>
      </motion.section>

      {/* Appearance */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-5 shadow-soft">
        <h3 className="font-bold mb-4">🎨 Appearance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Dark mode</span><Switch checked={dark} onCheckedChange={toggle} />
          </div>
          <div>
            <Label className="block mb-2">Accent color</Label>
            <div className="flex gap-2">
              {COLORS.map(c => <button key={c} className="w-9 h-9 rounded-full border-2 border-transparent hover:scale-110 transition" style={{ background: c }} />)}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="bg-card border border-border rounded-2xl p-5 shadow-soft">
        <h3 className="font-bold mb-4">📊 Data & privacy</h3>
        <Button variant="destructive" className="rounded-2xl" onClick={async () => { await signOut(); toast.success("Logged out"); }}>Log out</Button>
      </motion.section>
    </div>
  );
}
