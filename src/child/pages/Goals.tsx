import { motion } from "framer-motion";
import { GoalsSection } from "../components/GoalsSection";

export default function Goals() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Goals</h1>
      <GoalsSection />
    </motion.div>
  );
}
