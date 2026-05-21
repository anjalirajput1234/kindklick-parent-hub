import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Loader2, Gamepad2, Users, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const COLORS = ["#7C3AED", "#3B82F6", "#EC4899", "#10B981", "#F59E0B", "#EF4444"];
type Step = "age" | "child" | "parent";

function Bg() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary/30 blur-3xl blob" />
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-secondary/30 blur-3xl blob" style={{ animationDelay: "4s" }} />
    </div>
  );
}

function Logo() {
  return (
    <Link to="/" className="flex flex-col items-center gap-2 mb-6">
      <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center shadow-soft">
        <Shield className="w-7 h-7 text-white" />
      </div>
      <span className="font-bold text-xl gradient-text">KindKlick</span>
    </Link>
  );
}

export default function Signup() {
  const nav = useNavigate();
  const [step, setStep] = useState<Step>("age");

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative bg-background">
      <Bg />
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md bg-card/95 backdrop-blur-xl border border-border rounded-3xl shadow-elevated p-8"
      >
        <Logo />
        <AnimatePresence mode="wait">
          {step === "age" && <AgeStep key="age" onChild={() => setStep("child")} onParent={() => setStep("parent")} />}
          {step === "child" && <ChildForm key="child" onBack={() => setStep("age")} nav={nav} />}
          {step === "parent" && <ParentForm key="parent" onBack={() => setStep("age")} nav={nav} />}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function AgeStep({ onChild, onParent }: { onChild: () => void; onParent: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h1 className="text-2xl font-bold text-center mb-1">How old are you?</h1>
      <p className="text-center text-muted-foreground text-sm mb-6">Choose to get the right experience</p>
      <div className="space-y-3">
        <button
          onClick={onChild}
          className="w-full p-5 rounded-2xl border-2 border-primary/40 hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-4 text-left group"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            <Gamepad2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="font-semibold">I am a child</div>
            <div className="text-sm text-muted-foreground">Under 18 years</div>
          </div>
        </button>
        <button
          onClick={onParent}
          className="w-full p-5 rounded-2xl border-2 border-secondary/40 hover:border-secondary hover:bg-secondary/5 transition-all flex items-center gap-4 text-left group"
        >
          <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6 text-secondary-foreground" />
          </div>
          <div>
            <div className="font-semibold">I am a parent</div>
            <div className="text-sm text-muted-foreground">18+ years</div>
          </div>
        </button>
      </div>
      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
      </p>
    </motion.div>
  );
}

function BackBtn({ onBack }: { onBack: () => void }) {
  return (
    <button type="button" onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
      <ArrowLeft className="w-4 h-4" /> Go back
    </button>
  );
}

function ChildForm({ onBack, nav }: { onBack: () => void; nav: ReturnType<typeof useNavigate> }) {
  const [form, setForm] = useState({ name: "", age: "10", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error("Passwords don't match");
    if (form.password.length < 6) return toast.error("Password must be at least 6 chars");
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/child-dashboard`,
        data: { full_name: form.name, child_age: form.age, role: "child" },
      },
    });
    if (error) {
      setLoading(false);
      return toast.error(error.message);
    }
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: form.name,
        role: "child",
      } as any);
    }
    setLoading(false);
    toast.success("Welcome! 🎮");
    nav("/child-dashboard");
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <BackBtn onBack={onBack} />
      <h1 className="text-2xl font-bold text-center mb-1">Create your account</h1>
      <p className="text-center text-muted-foreground text-sm mb-6">Safe browsing, just for you</p>
      <form onSubmit={submit} className="space-y-3">
        <div className="space-y-1.5">
          <Label>Your name</Label>
          <Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="rounded-2xl h-11" placeholder="First name" />
        </div>
        <div className="space-y-1.5">
          <Label>Age</Label>
          <Select value={form.age} onValueChange={v => setForm({ ...form, age: v })}>
            <SelectTrigger className="rounded-2xl h-11"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: 14 }, (_, i) => i + 4).map(a => <SelectItem key={a} value={String(a)}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="rounded-2xl h-11" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Password</Label>
            <Input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="rounded-2xl h-11" />
          </div>
          <div className="space-y-1.5">
            <Label>Confirm</Label>
            <Input type="password" required value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} className="rounded-2xl h-11" />
          </div>
        </div>
        <Button type="submit" disabled={loading} className="w-full h-12 rounded-2xl gradient-brand text-white shadow-soft hover:opacity-90 font-semibold">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create account"}
        </Button>
      </form>
    </motion.div>
  );
}

function ParentForm({ onBack, nav }: { onBack: () => void; nav: ReturnType<typeof useNavigate> }) {
  const [form, setForm] = useState({
    parentName: "", email: "", password: "", confirm: "",
    childName: "", childAge: "10", color: "#7C3AED", terms: false,
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error("Passwords don't match");
    if (form.password.length < 6) return toast.error("Password must be at least 6 chars");
    if (!form.terms) return toast.error("Please accept the terms");
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding`,
        data: {
          full_name: form.parentName,
          child_name: form.childName || "My Child",
          child_age: form.childAge,
          avatar_color: form.color,
          role: "parent",
        },
      },
    });
    if (error) {
      setLoading(false);
      if (error.message.toLowerCase().includes("weak") || error.message.toLowerCase().includes("pwned"))
        return toast.error("Yeh password commonly used hai. Kuch unique try karein.");
      if (error.message.toLowerCase().includes("already"))
        return toast.error("Yeh email pehle se registered hai. Login karein.");
      return toast.error(error.message);
    }
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: form.parentName,
        role: "parent",
      } as any);
    }
    setLoading(false);
    toast.success("Account created! 🎉");
    nav("/onboarding");
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <BackBtn onBack={onBack} />
      <h1 className="text-2xl font-bold text-center mb-1">Create your account</h1>
      <p className="text-center text-muted-foreground text-sm mb-6">Start protecting your child today</p>
      <form onSubmit={submit} className="space-y-3">
        <div className="space-y-1.5">
          <Label>Your name</Label>
          <Input required value={form.parentName} onChange={e => setForm({ ...form, parentName: e.target.value })} className="rounded-2xl h-11" />
        </div>
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="rounded-2xl h-11" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Password</Label>
            <Input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="rounded-2xl h-11" />
          </div>
          <div className="space-y-1.5">
            <Label>Confirm</Label>
            <Input type="password" required value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} className="rounded-2xl h-11" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Child name <span className="text-xs text-muted-foreground">(optional)</span></Label>
            <Input value={form.childName} onChange={e => setForm({ ...form, childName: e.target.value })} className="rounded-2xl h-11" />
          </div>
          <div className="space-y-1.5">
            <Label>Child age <span className="text-xs text-muted-foreground">(optional)</span></Label>
            <Select value={form.childAge} onValueChange={v => setForm({ ...form, childAge: v })}>
              <SelectTrigger className="rounded-2xl h-11"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Array.from({ length: 15 }, (_, i) => i + 4).map(a => <SelectItem key={a} value={String(a)}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Avatar color</Label>
          <div className="flex gap-2">
            {COLORS.map(c => (
              <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                className={`w-9 h-9 rounded-full border-2 transition-transform ${form.color === c ? "scale-110 border-foreground ring-2 ring-foreground/20" : "border-transparent"}`}
                style={{ background: c }} />
            ))}
          </div>
        </div>
        <label className="flex items-start gap-2 text-sm pt-1">
          <Checkbox checked={form.terms} onCheckedChange={v => setForm({ ...form, terms: !!v })} className="mt-0.5" />
          <span className="text-muted-foreground">I agree to the <a href="#" className="text-primary">Terms</a> & <a href="#" className="text-primary">Privacy Policy</a></span>
        </label>
        <Button type="submit" disabled={loading} className="w-full h-12 rounded-2xl gradient-brand text-white shadow-soft hover:opacity-90 font-semibold">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create account"}
        </Button>
      </form>
    </motion.div>
  );
}
