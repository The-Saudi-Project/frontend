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

    /* ---------- LOADERS ---------- */

    const loadServices = async () => {
        const res = await apiRequest("/services/admin");
        setServices(res);
    };

    const loadStats = async () => {
        const [servicesRes, bookingsRes] = await Promise.all([
            apiRequest("/services/admin"),
            apiRequest("/bookings"), // ✅ admin sees all
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

    /* ---------- ACTIONS ---------- */

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

    /* ---------- LOADING ---------- */

    if (loading) {
        return (
            <div className="p-8 max-w-5xl mx-auto space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="bg-white p-6 rounded-2xl border border-slate-100 animate-pulse"
                        >
                            <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
                            <div className="h-8 w-20 bg-slate-200 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    /* ---------- UI ---------- */

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-10">
            <AdminNav />
            {/* METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                    <p className="text-sm text-slate-500">Total Services</p>
                    <p className="text-3xl font-bold mt-2">
                        {stats.services}
                    </p>
                </Card>

                <Card className="p-6">
                    <p className="text-sm text-slate-500">Total Bookings</p>
                    <p className="text-3xl font-bold mt-2">
                        {stats.bookings}
                    </p>
                </Card>

                <Card className="p-6">
                    <p className="text-sm text-slate-500">Pending Requests</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">
                        {stats.pending}
                    </p>
                </Card>
            </div>

            {/* CREATE SERVICE */}
            <Card className="p-8">
                <h3 className="text-xl font-bold mb-6">
                    Create New Service
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <Button className="mt-8" onClick={createService}>
                    Publish Service
                </Button>
            </Card>

            {/* SERVICES TABLE */}
            <div className="overflow-hidden border border-slate-100 rounded-2xl bg-white">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                        <tr>
                            <th className="px-6 py-4">Service</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {services.map((s) => (
                            <tr key={s._id}>
                                {editingService === s._id ? (
                                    <>
                                        <td className="px-6 py-4">
                                            <input
                                                className="w-full border rounded-lg px-3 py-2"
                                                value={editName}
                                                onChange={(e) =>
                                                    setEditName(e.target.value)
                                                }
                                            />
                                        </td>

                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                className="w-full border rounded-lg px-3 py-2"
                                                value={editPrice}
                                                onChange={(e) =>
                                                    setEditPrice(e.target.value)
                                                }
                                            />
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button onClick={saveEdit}>
                                                    Save
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() =>
                                                        setEditingService(null)
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-6 py-4 font-medium">
                                            {s.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {s.price} SAR
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => startEdit(s)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() =>
                                                        deleteService(s._id)
                                                    }
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
