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

    /* ---------------- DELETE ---------------- */

    const deleteBooking = async (id) => {
        if (!window.confirm("Delete this booking?")) return;
        await apiRequest(`/bookings/${id}`, { method: "DELETE" });
        await loadBookings();
    };

    /* ---------------- STATUS RULES ---------------- */

    const canAssignProvider = (status) => status === "CONFIRMED";

    if (loading) {
        return <div className="p-6 text-slate-500">Loading bookings…</div>;
    }

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
            <AdminNav />
            <h1 className="text-2xl font-bold">All Bookings</h1>

            {/* ================= TABLE ================= */}
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
                                <td className="px-6 py-4">{b.customerName}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {new Date(b.scheduledAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <Badge status={b.status} />
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
                        ))}
                    </tbody>
                </table>
            </Card>

            {/* ================= DETAILS MODAL ================= */}
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
                        <p><strong>Scheduled:</strong> {new Date(selectedBooking.scheduledAt).toLocaleString()}</p>
                        <p><strong>Status:</strong> {selectedBooking.status}</p>

                        {/* PAYMENT PROOF */}
                        {selectedBooking.paymentProof && (
                            <a
                                href={`${import.meta.env.VITE_API_URL.replace("/api", "")}/uploads/payments/${selectedBooking.paymentProof}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-600 underline text-sm block mt-2"
                            >
                                View payment proof
                            </a>
                        )}


                        {/* CONFIRM PAYMENT */}
                        {selectedBooking.status === "PAYMENT_UPLOADED" && (
                            <Button className="mt-4" onClick={confirmPayment}>
                                Confirm Payment
                            </Button>
                        )}

                        {/* ASSIGN PROVIDER */}
                        {canAssignProvider(selectedBooking.status) && (
                            <Button
                                variant="secondary"
                                className="mt-2"
                                onClick={() => openAssignProvider(selectedBooking)}
                            >
                                Assign Provider
                            </Button>
                        )}
                    </div>
                </Modal>
            )}

            {/* ================= ASSIGN MODAL ================= */}
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
