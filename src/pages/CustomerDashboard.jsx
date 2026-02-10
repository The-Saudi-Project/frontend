import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { Button, Card, Badge } from "../components/Ui.jsx";
import BookingModal from "../components/BookingModal";
import PaymentModal from "../components/PaymentModal";

export default function CustomerDashboard() {
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedService, setSelectedService] = useState(null);
    const [payBooking, setPayBooking] = useState(null);
    const [activeTab, setActiveTab] = useState("browse");

    const loadData = async () => {
        try {
            const servicesRes = await apiRequest("/services/public");
            setServices(servicesRes);

            try {
                const bookingsRes = await apiRequest("/bookings/customer");
                setBookings(bookingsRes);
            } catch {
                setBookings([]);
            }
        } catch (err) {
            console.error("Failed to load dashboard data:", err);
            setServices([]);
            setBookings([]);
        }
    };

    useEffect(() => {
        loadData().finally(() => setLoading(false));
    }, []);

    const handleBooked = async () => {
        const updated = await apiRequest("/bookings/customer");
        setBookings(updated);
        setActiveTab("bookings");
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

                {/* SERVICES */}
                {activeTab === "browse" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map(s => (
                            <Card
                                key={s._id}
                                className="overflow-hidden hover:shadow-xl transition-all"
                            >
                                {/* 🔲 IMAGE PLACEHOLDER */}
                                <div className="aspect-[16/10] bg-slate-100 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-slate-300 text-sm">Service Image</div>
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

                {/* BOOKINGS */}
                {activeTab === "bookings" && (
                    <div className="space-y-4">
                        {bookings.map(b => (
                            <Card key={b._id} className="p-5 flex justify-between">
                                <div>
                                    <p className="font-medium">{b.service?.name}</p>
                                    <p className="text-xs text-slate-500">
                                        {new Date(b.scheduledAt).toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex gap-3 items-center">
                                    <Badge status={b.status} />

                                    {b.status === "PENDING_PAY" && (
                                        <Button
                                            size="sm"
                                            onClick={() => setPayBooking(b)}
                                        >
                                            Pay Now
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
                    onCreated={(booking) => {
                        setSelectedService(null);   // 🔑 CRITICAL
                        setPayBooking(booking);
                        handleBooked();
                    }}
                />
            )}

            {/* PAYMENT */}
            {payBooking && (
                <PaymentModal
                    booking={payBooking}
                    onClose={() => setPayBooking(null)}
                    onDone={() => {
                        setPayBooking(null);
                        loadData();
                    }}
                />
            )}
        </div>
    );
}
