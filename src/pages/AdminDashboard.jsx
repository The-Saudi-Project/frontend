import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { Card, Button, Input } from "../components/Ui.jsx";
import AdminNav from "../components/AdminNav";

export default function AdminDashboard() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        services: 0,
        bookings: 0,
        pending: 0,
    });

    const [editingService, setEditingService] = useState(null);
    const [editName, setEditName] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    /* ================= LOADERS ================= */

    const loadServices = async () => {
        const res = await apiRequest("/services/admin");
        setServices(res);
    };

    const loadStats = async () => {
        const [servicesRes, bookingsRes] = await Promise.all([
            apiRequest("/services/admin"),
            apiRequest("/bookings"),
        ]);

        setStats({
            services: servicesRes.length,
            bookings: bookingsRes.length,
            pending: bookingsRes.filter(
                (b) => b.status === "pending"
            ).length,
        });
    };

    useEffect(() => {
        Promise.all([loadServices(), loadStats()])
            .finally(() => setLoading(false));
    }, []);

    /* ================= ACTIONS ================= */

    const createService = async () => {
        if (!name || !price) return;

        await apiRequest("/services", "POST", {
            name,
            price: Number(price),
            description,
        });

        setName("");
        setPrice("");
        setDescription("");

        await Promise.all([loadServices(), loadStats()]);
    };

    const startEdit = (service) => {
        setEditingService(service._id);
        setEditName(service.name);
        setEditPrice(service.price);
        setEditDescription(service.description || "");
    };

    const saveEdit = async () => {
        await apiRequest(`/services/${editingService}`, "PATCH", {
            name: editName,
            price: Number(editPrice),
            description: editDescription,
        });

        setEditingService(null);
        await Promise.all([loadServices(), loadStats()]);
    };

    const deleteService = async (id) => {
        const ok = window.confirm(
            "Are you sure you want to permanently delete this service?"
        );
        if (!ok) return;

        await apiRequest(`/services/${id}`, "DELETE");
        await Promise.all([loadServices(), loadStats()]);
    };

    /* ================= LOADING ================= */

    if (loading) {
        return (
            <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-white p-5 rounded-2xl border border-slate-100 animate-pulse"
                        >
                            <div className="h-3 w-24 bg-slate-200 rounded mb-3" />
                            <div className="h-7 w-16 bg-slate-200 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    /* ================= UI ================= */

    return (
        <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-10">
            <AdminNav />

            {/* ================= METRICS ================= */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Services
                    </p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">
                        {stats.services}
                    </p>
                </Card>

                <Card className="p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Bookings
                    </p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">
                        {stats.bookings}
                    </p>
                </Card>

                <Card className="p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Pending
                    </p>
                    <p className="text-2xl font-bold text-amber-600 mt-2">
                        {stats.pending}
                    </p>
                </Card>

                {/* Placeholder for future KPI */}
                <Card className="p-5 opacity-50">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Revenue
                    </p>
                    <p className="text-2xl font-bold text-slate-400 mt-2">
                        —
                    </p>
                </Card>
            </section>

            {/* ================= CREATE SERVICE ================= */}
            <Card className="p-6 md:p-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                    Create New Service
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                        label="Service Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Input
                        label="Base Price (SAR)"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />

                    <div className="md:col-span-2">
                        <Input
                            label="Description"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className="pt-6">
                    <Button onClick={createService}>
                        Publish Service
                    </Button>
                </div>
            </Card>
            {editingService && (
                <Card className="p-6 md:p-8 border-emerald-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6">
                        Edit Service
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input
                            label="Service Name"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                        />

                        <Input
                            label="Base Price (SAR)"
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                        />

                        <div className="md:col-span-2">
                            <Input
                                label="Description"
                                value={editDescription}
                                onChange={(e) =>
                                    setEditDescription(e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            variant="ghost"
                            onClick={() => setEditingService(null)}
                        >
                            Cancel
                        </Button>

                        <Button onClick={saveEdit}>
                            Save Changes
                        </Button>
                    </div>
                </Card>
            )}

            {/* ================= SERVICES – DESKTOP ================= */}
            <div className="hidden md:block">
                <Card className="overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400">
                            <tr>
                                <th className="px-6 py-4">Service</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {services.map((s) => (
                                <tr
                                    key={s._id}
                                    className="hover:bg-slate-50/40 transition"
                                >
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {s.name}
                                    </td>

                                    <td className="px-6 py-4 text-sm font-mono">
                                        {s.price} SAR
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="secondary"
                                                className="text-xs px-4"
                                                onClick={() =>
                                                    startEdit(s)
                                                }
                                            >
                                                Edit
                                            </Button>

                                            <Button
                                                variant="danger"
                                                className="text-xs px-4"
                                                onClick={() =>
                                                    deleteService(s._id)
                                                }
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>

            {/* ================= SERVICES – MOBILE ================= */}
            <div className="md:hidden space-y-4">
                {services.map((s) => (
                    <Card key={s._id} className="p-4 space-y-3">
                        <div>
                            <p className="font-semibold text-slate-900">
                                {s.name}
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                                {s.description || "No description"}
                            </p>
                        </div>

                        <p className="font-bold text-emerald-600">
                            {s.price} SAR
                        </p>

                        <div className="flex gap-2 pt-2">
                            <Button
                                variant="secondary"
                                className="flex-1"
                                onClick={() => startEdit(s)}
                            >
                                Edit
                            </Button>

                            <Button
                                variant="danger"
                                className="flex-1"
                                onClick={() => deleteService(s._id)}
                            >
                                Remove
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* ================= EDIT MODAL (COMING NEXT) ================= */}
            {/* 
                TODO:
                - Convert edit flow to Modal (Lumina style)
                - Add service image upload
                - Add category & duration fields
            */}
        </div>
    );
}
