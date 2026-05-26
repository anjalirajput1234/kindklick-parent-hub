import { motion } from "framer-motion";
import { ActivitySummary } from "../components/ActivitySummary";
import { SafeBrowsingWidget } from "../components/SafeBrowsingWidget";

export default function MyActivity() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Activity</h1>
      <ActivitySummary />
      <div className="grid lg:grid-cols-2 gap-4"><SafeBrowsingWidget /></div>
    </motion.div>
  );
}
