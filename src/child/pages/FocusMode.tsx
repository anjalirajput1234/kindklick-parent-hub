import { motion } from "framer-motion";
import { FocusTimer } from "../components/FocusTimer";

/** Full-screen calm Pomodoro page. */
export default function FocusMode() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="min-h-[80vh] flex flex-col items-center justify-center py-8 max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">Focus Mode</h1>
        <p className="text-slate-400 text-sm mt-2">Take a deep breath. You've got this. 🌟</p>
      </div>
      <FocusTimer />
    </motion.div>
  );
}
