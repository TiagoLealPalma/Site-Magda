import { Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppButton from "./components/WhatsAppButton";
import { useScrollingClass } from "./hooks/useScrollingClass";
import Home from "./pages/Home";
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
  const { pathname } = useLocation();
  const isBackoffice = pathname.startsWith("/backoffice");
  useScrollingClass();

  return (
    <>
      <ScrollToTop />
      {!isBackoffice && <WhatsAppButton />}
      <Routes>
        <Route path="/" element={<Home />} />
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
