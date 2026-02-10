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

    const [showProofModal, setShowProofModal] = useState(false);

    const [tab, setTab] = useState("active"); // active | completed

    /* ---------------- LOAD BOOKINGS ---------------- */

    const loadBookings = async () => {
        setLoading(true);
        try {
            const res = await apiRequest("/bookings");
            setBookings(res || []);
        } catch (err) {
            console.error("Failed to load bookings:", err);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    /* ---------------- DERIVED DATA ---------------- */

    const activeBookings = bookings.filter(
        (b) => b.status !== "COMPLETED" && b.status !== "CANCELLED"
    );

    const completedBookings = bookings.filter(
        (b) => b.status === "COMPLETED"
    );

    const paidBookings = bookings.filter((b) =>
        ["CONFIRMED", "ASSIGNED", "IN_PROGRESS", "COMPLETED"].includes(b.status)
    );

    const totalRevenue = paidBookings.reduce(
        (sum, b) => sum + (b.service?.price || 0),
        0
    );

    /* ---------------- VIEW DETAILS ---------------- */

    const openDetails = (booking) => {
        setSelectedBooking(booking);
        setShowDetails(true);
    };

    /* ---------------- ASSIGN PROVIDER ---------------- */

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
        if (!selectedProvider || !selectedBooking) return;

        try {
            setAssigning(true);

            await apiRequest(`/bookings/${selectedBooking._id}/assign`, {
                method: "PATCH",
                body: { providerId: selectedProvider },
            });

            setShowAssignModal(false);
            setSelectedBooking(null);
            setSelectedProvider("");
            await loadBookings();
        } catch (err) {
            alert(err.message || "Failed to assign provider");
        } finally {
            setAssigning(false);
        }
    };

    /* ---------------- CONFIRM PAYMENT ---------------- */

    const confirmPayment = async () => {
        if (!selectedBooking) return;

        await apiRequest(
            `/bookings/${selectedBooking._id}/confirm-payment`,
            { method: "PATCH" }
        );

        setShowDetails(false);
        setSelectedBooking(null);
        await loadBookings();
    };

    const canAssignProvider = (status) =>
        status === "CONFIRMED" || status === "ASSIGNED";

    if (loading) {
        return <div className="p-6 text-slate-500">Loading bookings…</div>;
    }

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
            <AdminNav />

            {/* HEADER */}
            <div className="flex justify-between items-end">
                <h1 className="text-2xl font-bold">Bookings</h1>
                <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase">
                        Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-emerald-600">
                        {totalRevenue} SAR
                    </p>
                </div>
            </div>

            {/* TABS */}
            <div className="flex gap-6 border-b">
                <button
                    onClick={() => setTab("active")}
                    className={`pb-3 text-sm font-medium ${tab === "active"
                            ? "text-emerald-600 border-b-2 border-emerald-600"
                            : "text-slate-400"
                        }`}
                >
                    Active Bookings
                </button>

                <button
                    onClick={() => setTab("completed")}
                    className={`pb-3 text-sm font-medium ${tab === "completed"
                            ? "text-emerald-600 border-b-2 border-emerald-600"
                            : "text-slate-400"
                        }`}
                >
                    Completed
                </button>
            </div>

            {/* TABLE */}
            <Card className="overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                        <tr>
                            <th className="px-6 py-4">Service</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Scheduled</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Provider</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {(tab === "active" ? activeBookings : completedBookings).map(
                            (b) => (
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
                                    <td className="px-6 py-4 font-mono">
                                        {b.service?.price || 0} SAR
                                    </td>
                                    <td className="px-6 py-4">
                                        {b.provider?.name || "—"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Button
                                            variant="secondary"
                                            onClick={() => openDetails(b)}
                                        >
                                            View
                                        </Button>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </Card>

            {/* DETAILS MODAL */}
            {showDetails && selectedBooking && (
                <Modal
                    title="Booking Details"
                    onClose={() => setShowDetails(false)}
                >
                    <div className="space-y-3 text-sm">
                        <p><strong>Service:</strong> {selectedBooking.service?.name}</p>
                        <p><strong>Amount:</strong> {selectedBooking.service?.price} SAR</p>
                        <p><strong>Customer:</strong> {selectedBooking.customerName}</p>
                        <p><strong>Phone:</strong> {selectedBooking.customerPhone}</p>
                        <p><strong>Address:</strong> {selectedBooking.customerAddress}</p>
                        <p><strong>Status:</strong> {selectedBooking.status}</p>

                        {selectedBooking.paymentProof && (
                            <Button
                                variant="ghost"
                                onClick={() => setShowProofModal(true)}
                            >
                                View payment proof
                            </Button>
                        )}

                        {selectedBooking.status === "PAYMENT_UPLOADED" && (
                            <Button className="mt-4" onClick={confirmPayment}>
                                Confirm Payment
                            </Button>
                        )}

                        {canAssignProvider(selectedBooking.status) && (
                            <Button
                                variant="secondary"
                                onClick={() => openAssignProvider(selectedBooking)}
                            >
                                {selectedBooking.provider
                                    ? "Change Provider"
                                    : "Assign Provider"}
                            </Button>
                        )}
                    </div>
                </Modal>
            )}

            {/* PAYMENT PROOF MODAL */}
            {showProofModal && selectedBooking && (
                <Modal
                    title="Payment Proof"
                    onClose={() => setShowProofModal(false)}
                >
                    <img
                        src={`${import.meta.env.VITE_API_URL.replace(
                            "/api",
                            ""
                        )}/uploads/payments/${selectedBooking.paymentProof}`}
                        className="max-h-[70vh] mx-auto rounded-xl border"
                    />
                </Modal>
            )}

            {/* ASSIGN PROVIDER MODAL */}
            {showAssignModal && selectedBooking && (
                <Modal
                    title="Assign Provider"
                    onClose={() => setShowAssignModal(false)}
                >
                    <select
                        className="w-full border rounded-lg px-3 py-2 mb-4"
                        value={selectedProvider}
                        onChange={(e) => setSelectedProvider(e.target.value)}
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
                        <Button onClick={assignProvider} disabled={assigning}>
                            {assigning ? "Assigning…" : "Confirm"}
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
