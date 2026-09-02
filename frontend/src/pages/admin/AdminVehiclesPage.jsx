import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, XCircle, Loader2 } from "lucide-react";
import {
  getAdminVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../../services/api";
import { Skeleton } from "../../components/ui/Skeleton";
import Modal from "../../components/ui/Modal";
import { cn } from "../../utils/cn";

const emptyVehicle = {
  name: "",
  slug: "",
  type: "",
  image: "",
  imageAlt: "",
  seatingCapacity: 4,
  luggageCapacity: 2,
  description: "",
  features: [],
  bestFor: "",
  price: 0,
  pricePerKm: 0,
  currency: "INR",
  isPopular: false,
  status: "active",
};

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = new, object = edit
  const [form, setForm] = useState(emptyVehicle);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    try {
      const data = await getAdminVehicles();
      setVehicles(data);
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
    setForm({ ...emptyVehicle });
    setModalOpen(true);
  };

  const openEdit = (vehicle) => {
    setEditing(vehicle);
    setForm({ ...emptyVehicle, ...vehicle });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return showToast("Name is required", "error");
    if (!form.slug.trim()) return showToast("Slug is required", "error");
    if (Number(form.price) <= 0) return showToast("Price must be a positive number", "error");

    setSaving(true);
    try {
      if (editing) {
        await updateVehicle(editing.id, form);
        showToast("Vehicle updated successfully");
      } else {
        await createVehicle(form);
        showToast("Vehicle created successfully");
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (vehicle) => {
    if (!confirm(`Deactivate "${vehicle.name}"? It will be hidden from customers.`)) return;
    try {
      await deleteVehicle(vehicle.id);
      showToast("Vehicle deactivated");
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
        <h2 className="text-xl font-bold text-slate-900">Vehicles</h2>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-brand-800"
        >
          <Plus className="h-4 w-4" /> Add Vehicle
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Seats</th>
              <th className="px-5 py-3">Price (₹)</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50/50">
                <td className="px-5 py-3">
                  <div className="font-medium text-slate-900">{v.name}</div>
                  <div className="text-xs text-slate-400">{v.slug}</div>
                </td>
                <td className="px-5 py-3 text-slate-600">{v.seatingCapacity}</td>
                <td className="px-5 py-3 font-semibold text-slate-900">
                  ₹{Number(v.price).toLocaleString("en-IN")}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      v.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {v.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(v)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {v.status === "active" && (
                      <button
                        type="button"
                        onClick={() => handleDeactivate(v)}
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
            {vehicles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                  No vehicles found
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
        title={editing ? "Edit Vehicle" : "Add New Vehicle"}
        description={editing ? `Updating ${editing.name}` : "Create a new vehicle listing"}
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
                placeholder="e.g. Sedan"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={set("slug")}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                placeholder="e.g. sedan"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Price (₹) *</label>
              <input
                type="number"
                min="1"
                value={form.price}
                onChange={set("price")}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Seating</label>
              <input
                type="number"
                min="1"
                value={form.seatingCapacity}
                onChange={set("seatingCapacity")}
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
            <label className="mb-1 block text-sm font-semibold text-slate-700">Description</label>
            <textarea
              value={form.description}
              onChange={set("description")}
              rows={3}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              placeholder="Vehicle description..."
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
              {editing ? "Update Vehicle" : "Create Vehicle"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
