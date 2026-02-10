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
                (b) => b.status === "PENDING_PAY"
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

        await apiRequest("/services", {
            method: "POST",
            body: {
                name,
                price: Number(price),
                description,
            },
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
        await apiRequest(`/services/${editingService}`, {
            method: "PATCH",
            body: {
                name: editName,
                price: Number(editPrice),
                description: editDescription,
            },
        });

        setEditingService(null);
        await Promise.all([loadServices(), loadStats()]);
    };

    const deleteService = async (id) => {
        const ok = window.confirm(
            "Are you sure you want to permanently delete this service?"
        );
        if (!ok) return;

        await apiRequest(`/services/${id}`, {
            method: "DELETE",
        });

        await Promise.all([loadServices(), loadStats()]);
    };

    /* ================= LOADING ================= */

    if (loading) {
        return <div className="p-6 text-slate-500">Loading dashboard…</div>;
    }

    /* ================= UI ================= */

    return (
        <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-10">
            <AdminNav />

            {/* METRICS */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-5">
                    <p className="text-xs text-slate-400">Services</p>
                    <p className="text-2xl font-bold">{stats.services}</p>
                </Card>

                <Card className="p-5">
                    <p className="text-xs text-slate-400">Bookings</p>
                    <p className="text-2xl font-bold">{stats.bookings}</p>
                </Card>

                <Card className="p-5">
                    <p className="text-xs text-slate-400">Pending</p>
                    <p className="text-2xl font-bold text-amber-600">
                        {stats.pending}
                    </p>
                </Card>
            </section>

            {/* CREATE */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                    Create New Service
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                    <Input
                        label="Service Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        label="Price (SAR)"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <Input
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="mt-4">
                    <Button onClick={createService}>
                        Publish Service
                    </Button>
                </div>
            </Card>

            {/* EDIT */}
            {editingService && (
                <Card className="p-6 border-emerald-200">
                    <h3 className="text-lg font-semibold mb-4">
                        Edit Service
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        <Input
                            label="Service Name"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                        />
                        <Input
                            label="Price (SAR)"
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                        />
                        <Input
                            label="Description"
                            value={editDescription}
                            onChange={(e) =>
                                setEditDescription(e.target.value)
                            }
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
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

            {/* LIST */}
            <Card className="overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-xs text-slate-500">
                        <tr>
                            <th className="px-6 py-4">Service</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4 text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {services.map((s) => (
                            <tr key={s._id}>
                                <td className="px-6 py-4">{s.name}</td>
                                <td className="px-6 py-4">
                                    {s.price} SAR
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button
                                        variant="secondary"
                                        className="mr-2"
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
