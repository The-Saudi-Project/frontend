import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { Card, Badge } from "../components/Ui.jsx";
import AdminNav from "../components/AdminNav";

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [availableProviders, setAvailableProviders] = useState({});
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(null);

    const loadBookings = async () => {
        const res = await apiRequest("/bookings");
        setBookings(res);
    };

    useEffect(() => {
        loadBookings().finally(() => setLoading(false));
    }, []);

    const loadProviders = async (bookingId, scheduledAt) => {
        if (availableProviders[bookingId]) return;

        const res = await apiRequest(
            `/users/providers/availability?scheduledAt=${scheduledAt}`
        );

        setAvailableProviders((prev) => ({
            ...prev,
            [bookingId]: res,
        }));
    };

    const assignProvider = async (bookingId, providerId) => {
        try {
            setAssigning(bookingId);
            await apiRequest(`/bookings/${bookingId}/assign`, "PATCH", {
                providerId,
            });
            await loadBookings();
        } finally {
            setAssigning(null);
        }
    };

    if (loading) {
        return <div className="p-8 text-slate-500">Loading bookings…</div>;
    }

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <AdminNav />
            <h1 className="text-2xl font-bold">All Bookings</h1>

            {/* ---------------- DESKTOP TABLE ---------------- */}
            <div className="hidden md:block">
                <Card className="overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="px-6 py-4">Service</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Scheduled</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Provider</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {bookings.map((b) => (
                                <tr key={b._id}>
                                    <td className="px-6 py-4 font-medium">
                                        {b.service?.name}
                                    </td>
                                    <td className="px-6 py-4">{b.customerName}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(b.scheduledAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge status={b.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            className="border rounded px-3 py-1.5 text-sm w-full max-w-[200px]"
                                            value={b.provider?._id || ""}
                                            disabled={assigning === b._id}
                                            onFocus={() =>
                                                loadProviders(b._id, b.scheduledAt)
                                            }
                                            onChange={(e) =>
                                                assignProvider(b._id, e.target.value)
                                            }
                                        >
                                            <option value="" disabled>
                                                Assign provider
                                            </option>
                                            {availableProviders[b._id]?.map((p) => (
                                                <option key={p._id} value={p._id}>
                                                    {p.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>

            {/* ---------------- MOBILE CARDS ---------------- */}
            <div className="md:hidden space-y-4">
                {bookings.map((b) => (
                    <Card key={b._id} className="p-4 space-y-3">
                        <div className="flex justify-between">
                            <p className="font-semibold">{b.service?.name}</p>
                            <Badge status={b.status} />
                        </div>

                        <div className="text-sm text-slate-500">
                            <p><strong>Customer:</strong> {b.customerName}</p>
                            <p>
                                <strong>Time:</strong>{" "}
                                {new Date(b.scheduledAt).toLocaleString()}
                            </p>
                        </div>

                        <select
                            className="border rounded px-3 py-2 text-sm w-full"
                            value={b.provider?._id || ""}
                            disabled={assigning === b._id}
                            onFocus={() =>
                                loadProviders(b._id, b.scheduledAt)
                            }
                            onChange={(e) =>
                                assignProvider(b._id, e.target.value)
                            }
                        >
                            <option value="" disabled>
                                Assign provider
                            </option>
                            {availableProviders[b._id]?.map((p) => (
                                <option key={p._id} value={p._id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </Card>
                ))}
            </div>
        </div>
    );
}
