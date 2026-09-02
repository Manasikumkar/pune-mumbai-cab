import { Navigate, Route, Routes } from "react-router-dom";
import { BookingModalProvider } from "./context/BookingModalContext";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import PuneToMumbaiPage from "./pages/PuneToMumbaiPage";
import MumbaiToPunePage from "./pages/MumbaiToPunePage";
import FleetPage from "./pages/FleetPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";

// Admin imports
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminVehiclesPage from "./pages/admin/AdminVehiclesPage";
import AdminRoutesPage from "./pages/admin/AdminRoutesPage";
import AdminEnquiriesPage from "./pages/admin/AdminEnquiriesPage";

export default function App() {
  return (
    <BookingModalProvider>
      <Routes>
        {/* ===== Public site ===== */}
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="pune-to-mumbai-cab" element={<PuneToMumbaiPage />} />
          <Route path="mumbai-to-pune-cab" element={<MumbaiToPunePage />} />
          <Route path="fleet" element={<FleetPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          {/* Static hosts sometimes serve the entry file directly */}
          <Route path="index.html" element={<Navigate to="/" replace />} />
        </Route>

        {/* ===== Admin panel ===== */}
        {/* Login page — public, no layout */}
        <Route path="admin/login" element={<AdminLoginPage />} />

        {/* Protected admin routes — with sidebar layout */}
        <Route path="admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="vehicles" element={<AdminVehiclesPage />} />
            <Route path="routes" element={<AdminRoutesPage />} />
            <Route path="enquiries" element={<AdminEnquiriesPage />} />
          </Route>
        </Route>

        {/* 404 catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BookingModalProvider>
  );
}
