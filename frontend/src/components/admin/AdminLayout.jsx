import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { CarTaxiFront, LayoutDashboard, Car, Route, MessageSquare, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { adminLogout } from "../../services/api";
import { cn } from "../../utils/cn";

const sidebarLinks = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Vehicles", to: "/admin/vehicles", icon: Car },
  { label: "Routes", to: "/admin/routes", icon: Route },
  { label: "Enquiries", to: "/admin/enquiries", icon: MessageSquare },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-brand-800 text-white transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 border-b border-brand-700 px-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500 text-white">
            <CarTaxiFront className="h-5 w-5" />
          </span>
          <div>
            <span className="block text-sm font-bold leading-tight">Pune Mumbai Cab</span>
            <span className="block text-[11px] font-medium uppercase tracking-wider text-brand-300">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
                  isActive
                    ? "bg-brand-700 text-white"
                    : "text-brand-200 hover:bg-brand-700/50 hover:text-white"
                )
              }
            >
              <link.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-brand-700 px-3 py-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-brand-200 transition hover:bg-red-600 hover:text-white"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-4 lg:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <h1 className="text-lg font-bold text-slate-900">Admin Dashboard</h1>
          <div className="ml-auto">
            <a
              href="/"
              className="text-sm font-semibold text-brand-600 hover:text-brand-800"
            >
              ← Back to Site
            </a>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
