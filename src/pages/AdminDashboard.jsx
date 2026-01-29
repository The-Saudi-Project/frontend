import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { Card, Button, Input } from "../components/Ui.jsx";

export default function AdminDashboard() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingService, setEditingService] = useState(null);
    const [editName, setEditName] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    const loadServices = async () => {
        const res = await apiRequest("/services/admin");
        setServices(res);
    };

    useEffect(() => {
        loadServices().finally(() => setLoading(false));
    }, []);

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
        loadServices();
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
        loadServices();
    };

    const deleteService = async (id) => {
        const ok = window.confirm(
            "Are you sure you want to permanently delete this service?"
        );
        if (!ok) return;

        await apiRequest(`/services/${id}`, "DELETE");
        loadServices();
    };

    if (loading) {
        return (
            <div className="p-8 max-w-5xl mx-auto space-y-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-100">
                    <div className="h-6 w-48 bg-slate-200 rounded animate-pulse mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-12 bg-slate-200 rounded animate-pulse"
                            />
                        ))}
                    </div>
                    <div className="h-10 w-40 bg-slate-200 rounded-xl mt-8 animate-pulse" />
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="flex justify-between p-6 border-b border-slate-100"
                        >
                            <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
                            <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }


    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            {/* CREATE SERVICE */}
            <Card className="p-8">
                <h3 className="text-xl font-bold mb-6">
                    Create New Service
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Service Name"
                        placeholder="e.g. Electrical Repair"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Input
                        label="Base Price (SAR)"
                        type="number"
                        placeholder="200"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />

                    <div className="md:col-span-2">
                        <Input
                            label="Description"
                            placeholder="Enter service details..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                <Button className="mt-8 px-10" onClick={createService}>
                    Publish Service
                </Button>
            </Card>

            {/* SERVICES TABLE */}
            <div className="overflow-hidden border border-slate-100 rounded-2xl bg-white">
                {services.length === 0 ? (
                    <div className="p-6 text-slate-500">
                        No services created yet
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold">
                                    Service Name
                                </th>
                                <th className="px-6 py-4 font-semibold">
                                    Price
                                </th>
                                <th className="px-6 py-4 font-semibold text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {services.map((s) => (
                                <tr
                                    key={s._id}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    {editingService && editingService === s._id ? (
                                        <>
                                            {/* NAME */}
                                            <td className="px-6 py-4">
                                                <input
                                                    className="w-full border rounded-lg px-3 py-2"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                />
                                            </td>

                                            {/* PRICE */}
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    className="w-full border rounded-lg px-3 py-2"
                                                    value={editPrice}
                                                    onChange={(e) => setEditPrice(e.target.value)}
                                                />
                                            </td>

                                            {/* ACTIONS */}
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        className="h-9 px-4 text-sm"
                                                        onClick={saveEdit}
                                                    >
                                                        Save
                                                    </Button>

                                                    <Button
                                                        variant="secondary"
                                                        className="h-9 px-4 text-sm"
                                                        onClick={() => setEditingService(null)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            {/* VIEW MODE */}
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {s.name}
                                            </td>

                                            <td className="px-6 py-4 text-slate-600 font-mono">
                                                {s.price} SAR
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="secondary"
                                                        className="h-9 px-4 text-sm"
                                                        onClick={() => startEdit(s)}
                                                    >
                                                        Edit
                                                    </Button>

                                                    <Button
                                                        variant="danger"
                                                        className="h-9 px-4 text-sm"
                                                        onClick={() => deleteService(s._id)}
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
                )}
            </div>
        </div>
    );
}
