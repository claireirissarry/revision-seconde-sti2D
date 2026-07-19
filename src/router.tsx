import { Routes, Route } from "react-router-dom";
import HomeFeed from "./pages/HomeFeed";
import UniversMaths from "./pages/UniversMaths";
import UniversPhysique from "./pages/UniversPhysique";
import ChapitreDetail from "./pages/ChapitreDetail";
import FocusSessionPage from "./pages/FocusSessionPage";
import ProfilPage from "./pages/ProfilPage";
import BadgesPage from "./pages/BadgesPage";
import ParentDashboard from "./pages/ParentDashboard";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeFeed />} />
      <Route path="/univers/maths" element={<UniversMaths />} />
      <Route path="/univers/physique-chimie" element={<UniversPhysique />} />
      <Route path="/chapitre/:id" element={<ChapitreDetail />} />
      <Route path="/focus" element={<FocusSessionPage />} />
      <Route path="/profil" element={<ProfilPage />} />
      <Route path="/badges" element={<BadgesPage />} />
      <Route path="/parent" element={<ParentDashboard />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
