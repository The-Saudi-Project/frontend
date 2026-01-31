import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { Button, Card, Badge } from "../components/Ui.jsx";
import BookingModal from "../components/BookingModal";


export default function CustomerDashboard() {
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState(null);
    const [activeTab, setActiveTab] = useState("browse");

    const loadData = async () => {
        const [servicesRes, bookingsRes] = await Promise.all([
            apiRequest("/services/public"),
            apiRequest("/bookings/customer"),
        ]);

        setServices(servicesRes);
        setBookings(bookingsRes);
    };

    useEffect(() => {
        loadData().finally(() => setLoading(false));
    }, []);

    const handleBooked = async () => {
        const updated = await apiRequest("/bookings/customer");
        setBookings(updated);
        setActiveTab("bookings");
    };

    /* ================= LOADING ================= */

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="bg-white p-6 rounded-2xl border border-slate-100 animate-pulse"
                        >
                            <div className="h-40 bg-slate-200 rounded-xl mb-4" />
                            <div className="h-4 w-3/4 bg-slate-200 rounded mb-2" />
                            <div className="h-4 w-full bg-slate-200 rounded" />
                            <div className="h-10 w-full bg-slate-200 rounded-xl mt-6" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    /* ================= UI ================= */

    return (
        <div className="min-h-screen bg-slate-50/50 pb-24">
            <main className="max-w-7xl mx-auto px-4 py-8">

                {/* HEADER */}
                <header className="mb-10">
                    <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                        Welcome 👋
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Book trusted professionals at your convenience
                    </p>
                </header>

                {/* TABS */}
                <div className="flex gap-8 mb-8 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab("browse")}
                        className={`pb-4 text-sm font-medium relative transition
                            ${activeTab === "browse"
                                ? "text-emerald-600"
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        Services
                        {activeTab === "browse" && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab("bookings")}
                        className={`pb-4 text-sm font-medium relative transition
                            ${activeTab === "bookings"
                                ? "text-emerald-600"
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        My Bookings
                        {activeTab === "bookings" && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
                        )}
                    </button>
                </div>

                {/* ================= SERVICES ================= */}
                {activeTab === "browse" && (
                    <>
                        {services.length === 0 ? (
                            <Card className="p-10 text-center text-slate-500">
                                No services available right now
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {services.map((s) => (
                                    <Card
                                        key={s._id}
                                        className="overflow-hidden hover:shadow-xl transition-all"
                                    >
                                        {/* IMAGE PLACEHOLDER */}
                                        <div className="aspect-[16/10] bg-slate-100 flex items-center justify-center text-slate-300 text-sm">
                                            Service Image
                                            {/* TODO: service.image */}
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

                                                <Button
                                                    onClick={() => setSelectedService(s)}
                                                >
                                                    Book
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* ================= BOOKINGS ================= */}
                {activeTab === "bookings" && (
                    <>
                        {bookings.length === 0 ? (
                            <Card className="p-10 text-center text-slate-500">
                                You haven’t made any bookings yet
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {bookings.map((b) => (
                                    <Card
                                        key={b._id}
                                        className="p-5 flex items-center justify-between"
                                    >
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {b.service?.name}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {new Date(b.scheduledAt).toLocaleString()}
                                            </p>
                                        </div>

                                        <Badge status={b.status} />
                                    </Card>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* ================= BOOKING MODAL ================= */}
            {selectedService && (
                <BookingModal
                    service={selectedService}
                    onClose={() => setSelectedService(null)}
                    onBooked={handleBooked}
                />
            )}
        </div>
    );
}
