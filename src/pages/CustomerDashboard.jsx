import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { Button, Card, Badge } from "../components/Ui.jsx";
import BookingModal from "../components/BookingModal";
import PaymentModal from "../components/PaymentModal";
import RescheduleModal from "../components/RescheduleModal";

export default function CustomerDashboard() {
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);

    const [selectedService, setSelectedService] = useState(null);
    const [payBooking, setPayBooking] = useState(null);
    const [rescheduleBooking, setRescheduleBooking] = useState(null);

    const [activeTab, setActiveTab] = useState("browse");

    const loadData = async () => {
        const servicesRes = await apiRequest("/services/public");
        const bookingsRes = await apiRequest("/bookings/customer");

        setServices(servicesRes || []);
        setBookings(bookingsRes || []);
    };

    useEffect(() => {
        loadData().finally(() => setLoading(false));
    }, []);

    const cancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        try {
            setCancellingId(bookingId);

            await apiRequest(`/bookings/${bookingId}/cancel`, {
                method: "PATCH",
            });

            await loadData(); // refresh bookings
        } catch (err) {
            alert(err.message || "Failed to cancel booking");
        } finally {
            setCancellingId(null);
        }
    };

    if (loading) {
        return <div className="p-6 text-slate-500">Loading…</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-24">
            <main className="max-w-7xl mx-auto px-4 py-8">

                <header className="mb-10">
                    <h1 className="text-2xl md:text-3xl font-semibold">
                        Welcome 👋
                    </h1>
                    <p className="text-slate-500">
                        Book trusted professionals at your convenience
                    </p>
                </header>

                {/* TABS */}
                <div className="flex gap-8 mb-8 border-b">
                    {["browse", "bookings"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-medium ${activeTab === tab
                                ? "text-emerald-600 border-b-2 border-emerald-600"
                                : "text-slate-400"
                                }`}
                        >
                            {tab === "browse" ? "Services" : "My Bookings"}
                        </button>
                    ))}
                </div>

                {/* ================= SERVICES ================= */}
                {activeTab === "browse" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map(s => (
                            <Card
                                key={s._id}
                                className="overflow-hidden hover:shadow-xl transition-all"
                            >
                                {/* 🔲 IMAGE PLACEHOLDER (RESTORED) */}
                                <div className="aspect-[16/10] bg-slate-100 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-slate-300 text-sm">
                                            Service Image
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            (Coming soon)
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-lg text-slate-900">
                                            {s.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                                            {s.description || "Professional service"}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                        <span className="font-bold text-slate-900">
                                            {s.price} SAR
                                        </span>

                                        <Button onClick={() => setSelectedService(s)}>
                                            Book
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* ================= BOOKINGS ================= */}
                {activeTab === "bookings" && (
                    <div className="space-y-4">
                        {bookings.map((b) => (
                            <Card key={b._id} className="p-5 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        {/* ✅ SERVICE SNAPSHOT */}
                                        <p className="font-semibold text-slate-900">
                                            {b.serviceName || b.service?.name || "Service"}
                                        </p>

                                        <p className="text-sm text-slate-600">
                                            {(b.servicePrice ?? b.service?.price ?? 0)} SAR
                                        </p>

                                        <p className="text-xs text-slate-400 mt-1">
                                            {new Date(b.scheduledAt).toLocaleString()}
                                        </p>
                                    </div>

                                    <Badge status={b.status} />
                                </div>

                                {/* ACTIONS */}
                                <div className="flex gap-2 pt-3 border-t">
                                    {/* PAY */}
                                    {b.status === "PENDING_PAY" && (
                                        <Button
                                            size="sm"
                                            onClick={() => setPayBooking(b)}
                                        >
                                            Pay Now
                                        </Button>
                                    )}

                                    {/* RESCHEDULE */}
                                    {["PENDING_PAY", "PAYMENT_UPLOADED", "CONFIRMED", "ASSIGNED"].includes(
                                        b.status
                                    ) && (
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => setRescheduleBooking(b)}
                                            >
                                                Reschedule
                                            </Button>
                                        )}
                                    {/* CANCEL */}
                                    {["PENDING_PAY", "PAYMENT_UPLOADED", "CONFIRMED", "ASSIGNED"].includes(b.status) && (
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            disabled={cancellingId === b._id}
                                            onClick={() => cancelBooking(b._id)}
                                        >
                                            {cancellingId === b._id ? "Cancelling…" : "Cancel"}
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

            </main>

            {/* CREATE BOOKING */}
            {selectedService && (
                <BookingModal
                    service={selectedService}
                    onClose={() => setSelectedService(null)}
                    onCreated={async () => {
                        setSelectedService(null);
                        await loadData();
                        setActiveTab("bookings");
                    }}
                />
            )}

            {/* PAYMENT */}
            {payBooking && (
                <PaymentModal
                    booking={payBooking}
                    onClose={() => setPayBooking(null)}
                    onDone={async () => {
                        setPayBooking(null);
                        await loadData();
                    }}
                />
            )}

            {/* RESCHEDULE */}
            {rescheduleBooking && (
                <RescheduleModal
                    booking={rescheduleBooking}
                    onClose={() => setRescheduleBooking(null)}
                    onDone={async () => {
                        setRescheduleBooking(null);
                        await loadData();
                    }}
                />
            )}
        </div>
    );
}
