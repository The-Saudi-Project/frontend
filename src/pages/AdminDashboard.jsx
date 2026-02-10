import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { Card, Button, Input } from "../components/Ui.jsx";
import AdminNav from "../components/AdminNav";
import Modal from "../components/Modal";

export default function AdminDashboard() {
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        services: 0,
        bookings: 0,
        pending: 0,
        paid: 0,
        completed: 0,
        revenue: 0,
    });

    /* ---------- EDIT MODAL STATE ---------- */
    const [editService, setEditService] = useState(null);
    const [editName, setEditName] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editDescription, setEditDescription] = useState("");

    /* ---------- CREATE STATE ---------- */
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    /* ---------- LOADERS ---------- */

    const loadAll = async () => {
        const [servicesRes, bookingsRes] = await Promise.all([
            apiRequest("/services/admin"),
            apiRequest("/bookings"),
        ]);

        setServices(servicesRes);
        setBookings(bookingsRes);

        const paidStatuses = [
            "CONFIRMED",
            "ASSIGNED",
            "IN_PROGRESS",
            "COMPLETED",
        ];

        const paidBookings = bookingsRes.filter((b) =>
            paidStatuses.includes(b.status)
        );

        const completedBookings = bookingsRes.filter(
            (b) => b.status === "COMPLETED"
        );

        const revenue = paidBookings.reduce(
            (sum, b) => sum + (b.service?.price || 0),
            0
        );

        setStats({
            services: servicesRes.length,
            bookings: bookingsRes.length,
            pending: bookingsRes.filter(
                (b) => b.status === "PENDING_PAY"
            ).length,
            paid: paidBookings.length,
            completed: completedBookings.length,
            revenue,
        });
    };

    useEffect(() => {
        loadAll().finally(() => setLoading(false));
    }, []);

    /* ---------- ACTIONS ---------- */

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
        await loadAll();
    };

    const openEditModal = (service) => {
        setEditService(service);
        setEditName(service.name);
        setEditPrice(service.price);
        setEditDescription(service.description || "");
    };

    const saveEdit = async () => {
        await apiRequest(`/services/${editService._id}`, {
            method: "PATCH",
            body: {
                name: editName,
                price: Number(editPrice),
                description: editDescription,
            },
        });

        setEditService(null);
        await loadAll();
    };

    const deleteService = async (id) => {
        if (!window.confirm("Delete this service permanently?")) return;

        await apiRequest(`/services/${id}`, { method: "DELETE" });
        await loadAll();
    };

    /* ---------- LOADING ---------- */

    if (loading) {
        return <div className="p-6 text-slate-500">Loading…</div>;
    }

    return (
        <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-10">
            <AdminNav />

            {/* ---------- METRICS ---------- */}
            <section className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <Card className="p-5">
                    <p className="text-xs font-bold uppercase text-slate-400">
                        Services
                    </p>
                    <p className="text-2xl font-bold">{stats.services}</p>
                </Card>

                <Card className="p-5">
                    <p className="text-xs font-bold uppercase text-slate-400">
                        Bookings
                    </p>
                    <p className="text-2xl font-bold">{stats.bookings}</p>
                </Card>

                <Card className="p-5">
                    <p className="text-xs font-bold uppercase text-slate-400">
                        Pending Payment
                    </p>
                    <p className="text-2xl font-bold text-amber-600">
                        {stats.pending}
                    </p>
                </Card>

                <Card className="p-5">
                    <p className="text-xs font-bold uppercase text-slate-400">
                        Paid Jobs
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                        {stats.paid}
                    </p>
                </Card>

                <Card className="p-5">
                    <p className="text-xs font-bold uppercase text-slate-400">
                        Completed
                    </p>
                    <p className="text-2xl font-bold text-emerald-600">
                        {stats.completed}
                    </p>
                </Card>

                <Card className="p-5">
                    <p className="text-xs font-bold uppercase text-slate-400">
                        Revenue
                    </p>
                    <p className="text-2xl font-bold text-emerald-700">
                        {stats.revenue} SAR
                    </p>
                </Card>
            </section>

            {/* ---------- CREATE SERVICE ---------- */}
            <Card className="p-6">
                <h3 className="font-semibold mb-4">Create Service</h3>

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
                        className="md:col-span-2"
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="pt-4">
                    <Button onClick={createService}>Publish</Button>
                </div>
            </Card>

            {/* ---------- SERVICES TABLE ---------- */}
            <Card className="overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                        <tr>
                            <th className="px-6 py-4">Service</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {services.map((s) => (
                            <tr key={s._id}>
                                <td className="px-6 py-4 font-medium">
                                    {s.name}
                                </td>
                                <td className="px-6 py-4">
                                    {s.price} SAR
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <Button
                                        variant="secondary"
                                        className="text-xs"
                                        onClick={() => openEditModal(s)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        className="text-xs"
                                        onClick={() => deleteService(s._id)}
                                    >
                                        Remove
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            {/* ---------- EDIT MODAL ---------- */}
            {editService && (
                <Modal
                    title="Edit Service"
                    onClose={() => setEditService(null)}
                >
                    <div className="space-y-4">
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

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                variant="ghost"
                                onClick={() => setEditService(null)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={saveEdit}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
