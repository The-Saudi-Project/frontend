import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { Card, Badge } from "../components/Ui.jsx";
import AdminNav from "../components/AdminNav";

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(null);

    const loadData = async () => {
        const [bookingsRes, providersRes] = await Promise.all([
            apiRequest("/bookings"),
            apiRequest("/users/providers"),
        ]);

        setBookings(bookingsRes);
        setProviders(providersRes);
    };

    useEffect(() => {
        loadData().finally(() => setLoading(false));
    }, []);

    const assignProvider = async (bookingId, providerId) => {
        try {
            setAssigning(bookingId);
            await apiRequest(`/bookings/${bookingId}/assign`, "PATCH", {
                providerId,
            });
            await loadData();
        } finally {
            setAssigning(null);
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-slate-500">
                Loading bookings…
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
            <AdminNav />
            <h1 className="text-2xl font-bold">All Bookings</h1>
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

                                <td className="px-6 py-4">
                                    {b.customerName}
                                </td>

                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {new Date(b.scheduledAt).toLocaleString()}
                                </td>

                                <td className="px-6 py-4">
                                    <Badge status={b.status} />
                                </td>

                                <td className="px-6 py-4">
                                    {b.provider ? (
                                        b.provider.name
                                    ) : b.status === "CREATED" ? (
                                        <select
                                            className="border rounded px-2 py-1 text-sm"
                                            defaultValue=""
                                            disabled={assigning === b._id}
                                            onChange={(e) =>
                                                assignProvider(b._id, e.target.value)
                                            }
                                        >
                                            <option value="" disabled>
                                                Assign provider
                                            </option>
                                            {providers.map((p) => (
                                                <option key={p._id} value={p._id}>
                                                    {p.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span className="text-slate-400 text-sm">
                                            —
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
