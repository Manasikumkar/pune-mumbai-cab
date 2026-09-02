import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, XCircle, Loader2 } from "lucide-react";
import {
  getAdminRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
} from "../../services/api";
import { Skeleton } from "../../components/ui/Skeleton";
import Modal from "../../components/ui/Modal";
import { cn } from "../../utils/cn";

const emptyRoute = {
  name: "",
  slug: "",
  origin: "",
  destination: "",
  distance: 150,
  travelTime: "3 – 3.5 hours",
  oneWayPrice: 0,
  roundTripPrice: 0,
  currency: "INR",
  shortDescription: "",
  description: "",
  status: "active",
};

export default function AdminRoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyRoute);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    try {
      const data = await getAdminRoutes();
      setRoutes(data);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyRoute });
    setModalOpen(true);
  };

  const openEdit = (route) => {
    setEditing(route);
    setForm({ ...emptyRoute, ...route });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return showToast("Name is required", "error");
    if (!form.slug.trim()) return showToast("Slug is required", "error");
    if (Number(form.oneWayPrice) <= 0) return showToast("One-way price must be positive", "error");
    if (Number(form.roundTripPrice) <= 0) return showToast("Round-trip price must be positive", "error");

    setSaving(true);
    try {
      if (editing) {
        await updateRoute(editing.id, form);
        showToast("Route updated successfully");
      } else {
        await createRoute(form);
        showToast("Route created successfully");
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (route) => {
    if (!confirm(`Deactivate "${route.name}"? It will be hidden from customers.`)) return;
    try {
      await deleteRoute(route.id);
      showToast("Route deactivated");
      await load();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

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

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Routes</h2>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-brand-800"
        >
          <Plus className="h-4 w-4" /> Add Route
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3">Route</th>
              <th className="px-5 py-3">Distance</th>
              <th className="px-5 py-3">One-Way (₹)</th>
              <th className="px-5 py-3">Round-Trip (₹)</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {routes.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/50">
                <td className="px-5 py-3">
                  <div className="font-medium text-slate-900">{r.name}</div>
                  <div className="text-xs text-slate-400">{r.origin} → {r.destination}</div>
                </td>
                <td className="px-5 py-3 text-slate-600">{r.distance} km</td>
                <td className="px-5 py-3 font-semibold text-slate-900">
                  ₹{Number(r.oneWayPrice).toLocaleString("en-IN")}
                </td>
                <td className="px-5 py-3 font-semibold text-slate-900">
                  ₹{Number(r.roundTripPrice).toLocaleString("en-IN")}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      r.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(r)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {r.status === "active" && (
                      <button
                        type="button"
                        onClick={() => handleDeactivate(r)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        title="Deactivate"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {routes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                  No routes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit/Create Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Route" : "Add New Route"}
        description={editing ? `Updating ${editing.name}` : "Create a new route"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={set("name")}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                placeholder="e.g. Pune to Mumbai Cab"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={set("slug")}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                placeholder="e.g. pune-to-mumbai-cab"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Origin</label>
              <input
                type="text"
                value={form.origin}
                onChange={set("origin")}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                placeholder="e.g. Pune"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Destination</label>
              <input
                type="text"
                value={form.destination}
                onChange={set("destination")}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                placeholder="e.g. Mumbai"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Distance (km)</label>
              <input
                type="number"
                min="0"
                value={form.distance}
                onChange={set("distance")}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">One-Way (₹) *</label>
              <input
                type="number"
                min="1"
                value={form.oneWayPrice}
                onChange={set("oneWayPrice")}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Round-Trip (₹) *</label>
              <input
                type="number"
                min="1"
                value={form.roundTripPrice}
                onChange={set("roundTripPrice")}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Status</label>
              <select
                value={form.status}
                onChange={set("status")}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Travel Time</label>
            <input
              type="text"
              value={form.travelTime}
              onChange={set("travelTime")}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              placeholder="e.g. 3 – 3.5 hours"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Description</label>
            <textarea
              value={form.description}
              onChange={set("description")}
              rows={3}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              placeholder="Route description..."
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold text-white",
                saving
                  ? "bg-brand-400 cursor-not-allowed"
                  : "bg-brand-700 hover:bg-brand-800"
              )}
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editing ? "Update Route" : "Create Route"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
