import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, Smile } from "lucide-react";
// TODO: persist messages to Supabase `ai_chats` (user_id, role, content, created_at) — RLS: user_id = auth.uid()
// TODO: Replace with your AI endpoint — e.g. supabase.functions.invoke("kindklick-chat", { body: { messages } })

interface Msg { id: number; role: "user" | "ai"; text: string; at: Date; }

const SUGGESTIONS = [
  "Help me with Math homework",
  "Explain photosynthesis simply",
  "Give me a study tip",
  "What should I learn today?",
  "Tell me something interesting",
];

const SYSTEM_PROMPT =
  "You are a friendly, child-safe educational tutor for kids aged 6-14. " +
  "Always be kind, encouraging, age-appropriate. Never produce harmful, scary, " +
  "violent, or adult content. Keep answers short and easy to understand.";

/** Chat UI styled like iMessage/WhatsApp. */
export default function AIAssistant() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 0, role: "ai", text: "Hi there! 👋 I'm your study buddy. Ask me anything you'd like to learn!", at: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  const send = async (text: string) => {
    const q = text.trim(); if (!q) return;
    const m: Msg = { id: Date.now(), role: "user", text: q, at: new Date() };
    setMsgs(p => [...p, m]); setInput(""); setTyping(true);
    // TODO: call your AI API here using SYSTEM_PROMPT
    setTimeout(() => {
      setMsgs(p => [...p, { id: Date.now()+1, role: "ai", text: "Great question! Let me think about that… 💡 (Hook up your AI endpoint to get real answers.)", at: new Date() }]);
      setTyping(false);
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-9rem)]"
    >
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div><div className="font-semibold">AI Study Buddy</div><div className="text-xs text-green-300">● Online</div></div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-3 scrollbar-thin">
        <AnimatePresence initial={false}>
          {msgs.map(m => (
            <motion.div key={m.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm
                ${m.role === "user"
                  ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-br-md"
                  : "bg-white/10 backdrop-blur-xl border border-white/10 rounded-bl-md"}`}>
                {m.text}
                <div className={`text-[10px] mt-1 ${m.role === "user" ? "text-white/70" : "text-slate-400"}`}>
                  {m.at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <div className="flex gap-1 px-4 py-3 w-fit rounded-2xl bg-white/10 border border-white/10">
            {[0,1,2].map(i => (
              <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-300"
                animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-white/10 pt-3">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)}
              className="shrink-0 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs hover:bg-white/10 transition">
              {s}
            </button>
          ))}
        </div>
        <form onSubmit={e => { e.preventDefault(); send(input); }}
          className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-2">
          <button type="button" className="text-slate-400 hover:text-white" aria-label="Emoji"><Smile className="w-5 h-5" /></button>
          <input value={input} onChange={e => setInput(e.target.value)}
            placeholder="Ask me anything…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-500" />
          <button type="submit" disabled={!input.trim()}
            className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 disabled:opacity-50 hover:scale-105 transition" aria-label="Send">
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
