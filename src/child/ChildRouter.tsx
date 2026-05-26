import { Routes, Route, Navigate } from "react-router-dom";
import ChildLayout from "./layouts/ChildLayout";
import ChildHome from "./pages/ChildHome";
import MyActivity from "./pages/MyActivity";
import LearningZone from "./pages/LearningZone";
import FocusMode from "./pages/FocusMode";
import Rewards from "./pages/Rewards";
import Goals from "./pages/Goals";
import ScreenTime from "./pages/ScreenTime";
import AIAssistant from "./pages/AIAssistant";
import StudyStats from "./pages/StudyStats";
import ChildSettings from "./pages/ChildSettings";

/** Router for the entire Child experience. All routes mount under /child. */
export default function ChildRouter() {
  return (
    <Routes>
      <Route element={<ChildLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<ChildHome />} />
        <Route path="activity" element={<MyActivity />} />
        <Route path="learning" element={<LearningZone />} />
        <Route path="browser" element={<LearningZone />} />
        <Route path="focus" element={<FocusMode />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path="goals" element={<Goals />} />
        <Route path="screen-time" element={<ScreenTime />} />
        <Route path="apps" element={<MyActivity />} />
        <Route path="study-stats" element={<StudyStats />} />
        <Route path="ai-assistant" element={<AIAssistant />} />
        <Route path="settings" element={<ChildSettings />} />
        <Route path="*" element={<Navigate to="home" replace />} />
      </Route>
    </Routes>
  );
}
