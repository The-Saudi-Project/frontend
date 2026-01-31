import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { Card, Button, Badge } from "../components/Ui.jsx";
import AdminNav from "../components/AdminNav";
import Modal from "../components/Modal";

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    const [showAssignModal, setShowAssignModal] = useState(false);
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState("");
    const [assigning, setAssigning] = useState(false);
    const [openActionsId, setOpenActionsId] = useState(null);

    /* ---------------- LOAD BOOKINGS ---------------- */

    const loadBookings = async () => {
        const res = await apiRequest("/bookings");
        setBookings(res);
    };

    useEffect(() => {
        loadBookings().finally(() => setLoading(false));
    }, []);

    /* ---------------- VIEW DETAILS ---------------- */

    const openDetails = (booking) => {
        setSelectedBooking(booking);
        setShowDetails(true);
    };

    /* ---------------- ASSIGN / EDIT PROVIDER ---------------- */

    const openAssignProvider = async (booking) => {
        setSelectedBooking(booking);
        setSelectedProvider(booking.provider?._id || "");

        const res = await apiRequest(
            `/users/providers/availability?scheduledAt=${booking.scheduledAt}`
        );
        setProviders(res);

        setShowAssignModal(true);
    };

    const assignProvider = async () => {
        if (!selectedProvider) return;

        try {
            setAssigning(true);
            await apiRequest(
                `/bookings/${selectedBooking._id}/assign`,
                "PATCH",
                { providerId: selectedProvider }
            );

            setShowAssignModal(false);
            await loadBookings();
        } finally {
            setAssigning(false);
        }
    };

    /* ---------------- DELETE BOOKING ---------------- */

    const deleteBooking = async (bookingId) => {
        const ok = window.confirm(
            "Are you sure you want to delete this booking?"
        );
        if (!ok) return;

        await apiRequest(`/bookings/${bookingId}`, "DELETE");
        await loadBookings();
    };

    /* ---------------- STATUS RULES ---------------- */

    const canEditProvider = (status) =>
        status === "CREATED" || status === "ASSIGNED";

    if (loading) {
        return <div className="p-6 text-slate-500">Loading bookings…</div>;
    }

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
            <AdminNav />

            <h1 className="text-2xl font-bold">All Bookings</h1>

            {/* ================= DESKTOP TABLE ================= */}
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
                                <th className="px-6 py-4">Actions</th>
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
                                        {b.provider?.name || "—"}
                                    </td>

                                    <td className="px-6 py-4 relative">
                                        <Button
                                            variant="secondary"
                                            onClick={() =>
                                                setOpenActionsId(
                                                    openActionsId === b._id ? null : b._id
                                                )
                                            }
                                        >
                                            Actions
                                        </Button>

                                        {openActionsId === b._id && (
                                            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg z-20">
                                                <button
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50"
                                                    onClick={() => {
                                                        openDetails(b);
                                                        setOpenActionsId(null);
                                                    }}
                                                >
                                                    View details
                                                </button>

                                                {canEditProvider(b.status) && (
                                                    <button
                                                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50"
                                                        onClick={() => {
                                                            openAssignProvider(b);
                                                            setOpenActionsId(null);
                                                        }}
                                                    >
                                                        {b.provider ? "Edit Provider" : "Assign Provider"}
                                                    </button>
                                                )}

                                                <button
                                                    className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                                                    onClick={() => {
                                                        setOpenActionsId(null);
                                                        deleteBooking(b._id);
                                                    }}
                                                >
                                                    Delete booking
                                                </button>
                                            </div>
                                        )}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>

            {/* ================= MOBILE CARDS ================= */}
            <div className="md:hidden space-y-4">
                {bookings.map((b) => (
                    <Card key={b._id} className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-slate-900">
                                    {b.service?.name}
                                </p>
                                <p className="text-sm text-slate-500">
                                    {b.customerName}
                                </p>
                            </div>
                            <Badge status={b.status} />
                        </div>

                        <div className="text-sm text-slate-500 space-y-1">
                            <p>
                                <strong>Scheduled:</strong>{" "}
                                {new Date(b.scheduledAt).toLocaleString()}
                            </p>
                            <p>
                                <strong>Provider:</strong>{" "}
                                {b.provider?.name || "—"}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                            <Button
                                variant="ghost"
                                onClick={() => openDetails(b)}
                            >
                                View details
                            </Button>

                            {canEditProvider(b.status) && (
                                <Button
                                    variant="secondary"
                                    onClick={() => openAssignProvider(b)}
                                >
                                    {b.provider
                                        ? "Edit Provider"
                                        : "Assign Provider"}
                                </Button>
                            )}

                            <Button
                                variant="danger"
                                onClick={() => deleteBooking(b._id)}
                            >
                                Delete Booking
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* ================= VIEW DETAILS MODAL ================= */}
            {showDetails && selectedBooking && (
                <Modal
                    title="Booking Details"
                    onClose={() => setShowDetails(false)}
                >
                    <div className="space-y-2 text-sm">
                        <p><strong>Service:</strong> {selectedBooking.service?.name}</p>
                        <p><strong>Customer:</strong> {selectedBooking.customerName}</p>
                        <p><strong>Phone:</strong> {selectedBooking.customerPhone}</p>
                        <p><strong>Address:</strong> {selectedBooking.customerAddress}</p>
                        <p><strong>Notes:</strong> {selectedBooking.notes || "—"}</p>
                        <p><strong>Scheduled:</strong> {new Date(selectedBooking.scheduledAt).toLocaleString()}</p>
                        <p><strong>Status:</strong> {selectedBooking.status}</p>
                    </div>
                </Modal>
            )}

            {/* ================= ASSIGN PROVIDER MODAL ================= */}
            {showAssignModal && selectedBooking && (
                <Modal
                    title="Assign Provider"
                    onClose={() => setShowAssignModal(false)}
                >
                    <div className="space-y-4">
                        <select
                            className="w-full border rounded-lg px-3 py-2"
                            value={selectedProvider}
                            onChange={(e) =>
                                setSelectedProvider(e.target.value)
                            }
                        >
                            <option value="">Select provider</option>
                            {providers.map((p) => (
                                <option key={p._id} value={p._id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => setShowAssignModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={assignProvider}
                                disabled={assigning}
                            >
                                {assigning ? "Assigning…" : "Confirm"}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
