import { useEffect, useState, useCallback } from "react";
import { getEnquiries, updateEnquiryStatus } from "../../services/api";
import { Skeleton } from "../../components/ui/Skeleton";
import { cn } from "../../utils/cn";

const STATUSES = ["NEW", "CONTACTED", "CONFIRMED", "CLOSED"];

const statusColors = {
  NEW: "bg-blue-100 text-blue-700 border-blue-200",
  CONTACTED: "bg-yellow-100 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-green-100 text-green-700 border-green-200",
  CLOSED: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    try {
      const data = await getEnquiries(filter || undefined);
      setEnquiries(data);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const handleStatusChange = async (enquiry, newStatus) => {
    try {
      await updateEnquiryStatus(enquiry.id, newStatus);
      // Update local state immediately for instant UI feedback
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiry.id ? { ...e, status: newStatus } : e))
      );
      showToast(`Enquiry #${enquiry.id} → ${newStatus}`);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50 rounded-xl px-5 py-3 text-sm font-semibold shadow-lg",
            toast.type === "error"
              ? "bg-red-600 text-white"
              : "bg-green-600 text-white"
          )}
        >
          {toast.message}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-slate-900">Enquiries</h2>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3">Route</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Vehicle</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {enquiries.map((enq) => (
              <tr key={enq.id} className="hover:bg-slate-50/50">
                <td className="px-5 py-3">
                  <div className="font-medium text-slate-900">{enq.name}</div>
                  {enq.message && (
                    <div className="mt-0.5 max-w-[200px] truncate text-xs text-slate-400" title={enq.message}>
                      {enq.message}
                    </div>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="text-slate-700">{enq.phone}</div>
                  {enq.email && <div className="text-xs text-slate-400">{enq.email}</div>}
                </td>
                <td className="px-5 py-3 text-slate-600">
                  <div className="max-w-[180px] truncate" title={`${enq.pickupLocation} → ${enq.dropLocation}`}>
                    {enq.pickupLocation} → {enq.dropLocation}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="text-slate-700">{enq.travelDate || "—"}</div>
                  {enq.travelTime && <div className="text-xs text-slate-400">{enq.travelTime}</div>}
                </td>
                <td className="px-5 py-3 text-slate-600">
                  {enq.vehicleName || "—"}
                  {enq.passengers && (
                    <span className="text-xs text-slate-400"> ({enq.passengers} pax)</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <select
                    value={enq.status}
                    onChange={(e) => handleStatusChange(enq, e.target.value)}
                    className={cn(
                      "rounded-lg border px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20",
                      statusColors[enq.status] || "border-slate-200 bg-slate-50 text-slate-600"
                    )}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {enquiries.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                  No enquiries found{filter ? ` with status "${filter}"` : ""}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
