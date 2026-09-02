import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Car, Route, MessageSquare, ArrowRight } from "lucide-react";
import { getAdminVehicles, getAdminRoutes, getEnquiries } from "../../services/api";
import { Skeleton } from "../../components/ui/Skeleton";
import { cn } from "../../utils/cn";

const statusColors = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CLOSED: "bg-slate-100 text-slate-600",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [vehicles, routes, enquiries] = await Promise.all([
          getAdminVehicles(),
          getAdminRoutes(),
          getEnquiries(),
        ]);
        setStats({
          totalVehicles: vehicles.length,
          activeVehicles: vehicles.filter((v) => v.status === "active").length,
          totalRoutes: routes.length,
          activeRoutes: routes.filter((r) => r.status === "active").length,
          totalEnquiries: enquiries.length,
          newEnquiries: enquiries.filter((e) => e.status === "NEW").length,
        });
        setRecentEnquiries(enquiries.slice(0, 5));
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  const cards = [
    {
      label: "Total Vehicles",
      value: stats?.totalVehicles ?? 0,
      sub: `${stats?.activeVehicles ?? 0} active`,
      icon: Car,
      color: "bg-blue-50 text-blue-600",
      link: "/admin/vehicles",
    },
    {
      label: "Total Routes",
      value: stats?.totalRoutes ?? 0,
      sub: `${stats?.activeRoutes ?? 0} active`,
      icon: Route,
      color: "bg-purple-50 text-purple-600",
      link: "/admin/routes",
    },
    {
      label: "New Enquiries",
      value: stats?.newEnquiries ?? 0,
      sub: `${stats?.totalEnquiries ?? 0} total`,
      icon: MessageSquare,
      color: "bg-accent-50 text-accent-600",
      link: "/admin/enquiries",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", card.color)}>
              <card.icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="text-xs text-slate-400">{card.sub}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:text-brand-600" />
          </Link>
        ))}
      </div>

      {/* Recent enquiries */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-bold text-slate-900">Recent Enquiries</h2>
          <Link
            to="/admin/enquiries"
            className="text-sm font-semibold text-brand-600 hover:text-brand-800"
          >
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Route</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                    No enquiries yet
                  </td>
                </tr>
              ) : (
                recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3 font-medium text-slate-900">{enq.name}</td>
                    <td className="px-5 py-3 text-slate-600">
                      {enq.pickupLocation} → {enq.dropLocation}
                    </td>
                    <td className="px-5 py-3 text-slate-500">{enq.travelDate || "—"}</td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          statusColors[enq.status] || "bg-slate-100 text-slate-600"
                        )}
                      >
                        {enq.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
