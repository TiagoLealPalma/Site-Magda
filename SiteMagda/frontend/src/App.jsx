import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import HomeLedger from "./pages/HomeLedger";
import HomeDrafting from "./pages/HomeDrafting";
import HomeAtelier from "./pages/HomeAtelier";
import HomeAtelierInstrument from "./pages/HomeAtelierInstrument";
import HomeAtelierCompact from "./pages/HomeAtelierCompact";
import HomeAtelierStory from "./pages/HomeAtelierStory";
import HomeAtelierFeedbackCharcoal from "./pages/HomeAtelierFeedbackCharcoal";
import HomeAtelierFeedbackCards from "./pages/HomeAtelierFeedbackCards";
import HomeAtelierFeedbackLedger from "./pages/HomeAtelierFeedbackLedger";
import Sobre from "./pages/Sobre";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Login from "./pages/backoffice/Login";
import Dashboard from "./pages/backoffice/Dashboard";
import PropertiesAdmin from "./pages/backoffice/PropertiesAdmin";
import PropertyForm from "./pages/backoffice/PropertyForm";
import LeadsAdmin from "./pages/backoffice/LeadsAdmin";
import BackofficeLayout from "./components/backoffice/BackofficeLayout";
import ProtectedRoute from "./components/backoffice/ProtectedRoute";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/landing/ledger" element={<HomeLedger />} />
        <Route path="/landing/drafting" element={<HomeDrafting />} />
        <Route path="/landing/atelier" element={<HomeAtelier />} />
        <Route path="/landing/atelier-instrument" element={<HomeAtelierInstrument />} />
        <Route path="/landing/atelier-compact" element={<HomeAtelierCompact />} />
        <Route path="/landing/atelier-story" element={<HomeAtelierStory />} />
        <Route path="/landing/feedback-charcoal" element={<HomeAtelierFeedbackCharcoal />} />
        <Route path="/landing/feedback-cards" element={<HomeAtelierFeedbackCards />} />
        <Route path="/landing/feedback-ledger" element={<HomeAtelierFeedbackLedger />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/imoveis" element={<Properties />} />
        <Route path="/imoveis/:id" element={<PropertyDetail />} />

        <Route path="/backoffice/login" element={<Login />} />
        <Route
          path="/backoffice"
          element={
            <ProtectedRoute>
              <BackofficeLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="imoveis" element={<PropertiesAdmin />} />
          <Route path="imoveis/novo" element={<PropertyForm />} />
          <Route path="imoveis/:id" element={<PropertyForm />} />
          <Route path="contactos" element={<LeadsAdmin />} />
        </Route>
      </Routes>
    </>
  );
}
