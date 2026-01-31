import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { Card, Badge } from "../components/Ui.jsx";
import AdminNav from "../components/AdminNav";

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [availableProviders, setAvailableProviders] = useState({});
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(null);

    /* ---------------- LOAD BOOKINGS ---------------- */

    const loadBookings = async () => {
        const res = await apiRequest("/bookings");
        setBookings(res);
    };

    useEffect(() => {
        loadBookings().finally(() => setLoading(false));
    }, []);

    /* ---------------- LOAD PROVIDERS (PER BOOKING) ---------------- */

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

    /* ---------------- ASSIGN PROVIDER ---------------- */

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
        return (
            <div className="p-8 text-slate-500 text-sm">
                Loading bookings…
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            <AdminNav />

            <header className="space-y-1">
                <h1 className="text-2xl font-semibold text-slate-900">
                    All Bookings
                </h1>
                <p className="text-sm text-slate-500">
                    Assign providers and monitor service progress
                </p>
            </header>

            {/* ======================================================
               DESKTOP TABLE
            ====================================================== */}
            <div className="hidden md:block">
                <Card className="overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400">
                            <tr>
                                <th className="px-6 py-4">Service</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Scheduled</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Provider</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {bookings.map((b) => (
                                <tr
                                    key={b._id}
                                    className="hover:bg-slate-50/50 transition"
                                >
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {b.service?.name}
                                    </td>

                                    <td className="px-6 py-4 text-slate-700">
                                        {b.customerName}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(b.scheduledAt).toLocaleString()}
                                    </td>

                                    <td className="px-6 py-4">
                                        <Badge status={b.status} />
                                    </td>

                                    <td className="px-6 py-4">
                                        {["COMPLETED", "CANCELLED"].includes(b.status) ? (
                                            <span className="text-sm text-slate-400">
                                                {b.provider?.name || "—"}
                                            </span>
                                        ) : (
                                            <select
                                                className="
                                                    w-full max-w-[220px]
                                                    px-3 py-2
                                                    text-sm
                                                    rounded-xl
                                                    border border-slate-200
                                                    bg-white
                                                    focus:outline-none
                                                    focus:ring-2 focus:ring-emerald-500/20
                                                "
                                                value={b.provider?._id || ""}
                                                disabled={assigning === b._id}
                                                onFocus={() =>
                                                    loadProviders(
                                                        b._id,
                                                        b.scheduledAt
                                                    )
                                                }
                                                onChange={(e) =>
                                                    assignProvider(
                                                        b._id,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="" disabled>
                                                    Assign provider
                                                </option>

                                                {availableProviders[b._id]?.map(
                                                    (p) => (
                                                        <option
                                                            key={p._id}
                                                            value={p._id}
                                                        >
                                                            {p.name}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>

            {/* ======================================================
               MOBILE CARDS
            ====================================================== */}
            <div className="md:hidden space-y-4">
                {bookings.map((b) => (
                    <Card key={b._id} className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-slate-900">
                                {b.service?.name}
                            </h3>
                            <Badge status={b.status} />
                        </div>

                        <div className="text-sm text-slate-500 space-y-1">
                            <p>
                                <span className="font-medium">Customer:</span>{" "}
                                {b.customerName}
                            </p>
                            <p>
                                <span className="font-medium">Time:</span>{" "}
                                {new Date(b.scheduledAt).toLocaleString()}
                            </p>
                        </div>

                        {!["COMPLETED", "CANCELLED"].includes(b.status) && (
                            <select
                                className="
                                    w-full
                                    px-3 py-2
                                    text-sm
                                    rounded-xl
                                    border border-slate-200
                                    bg-white
                                    focus:outline-none
                                    focus:ring-2 focus:ring-emerald-500/20
                                "
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
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
