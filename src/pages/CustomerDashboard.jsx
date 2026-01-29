import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { Button, Card, Badge } from "../components/Ui.jsx";
import BookingModal from "../components/BookingModal";

const statusLabel = {
    CREATED: "Requested",
    ASSIGNED: "Provider Assigned",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
};

export default function CustomerDashboard() {
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState(null);
    const [success, setSuccess] = useState("");

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

    const onBooked = async () => {
        await loadData();
        setSelectedService(null);
        setSuccess("Booking request sent successfully!");
        setTimeout(() => setSuccess(""), 3000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="bg-white p-6 rounded-2xl border border-slate-100 animate-pulse"
                        >
                            <div className="h-40 bg-slate-200 rounded-xl mb-4" />
                            <div className="h-5 w-3/4 bg-slate-200 rounded mb-2" />
                            <div className="h-4 w-full bg-slate-200 rounded" />
                            <div className="h-10 w-full bg-slate-200 rounded-xl mt-6" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <main className="max-w-6xl mx-auto p-6">
                {/* HEADER */}
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Book a Service
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Trusted professionals at your doorstep
                    </p>
                </header>

                {/* SUCCESS */}
                {success && (
                    <div className="mb-8 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl">
                        {success}
                    </div>
                )}

                {/* SERVICES */}
                <section>
                    <h2 className="text-xl font-bold mb-6">
                        Available Services
                    </h2>

                    {services.length === 0 ? (
                        <Card className="p-8 text-center text-slate-500">
                            No services available
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((s) => (
                                <Card
                                    key={s._id}
                                    className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
                                >
                                    <div>
                                        <div className="h-40 bg-slate-100 rounded-xl mb-4 flex items-center justify-center text-slate-400">
                                            Service Image
                                        </div>

                                        <h3 className="font-bold text-lg text-slate-900">
                                            {s.name}
                                        </h3>

                                        <p className="text-slate-500 text-sm mt-1">
                                            {s.description || "Professional service"}
                                        </p>

                                        <p className="text-emerald-600 font-bold mt-4 text-xl">
                                            {s.price} SAR
                                        </p>
                                    </div>

                                    <Button
                                        className="mt-6 w-full"
                                        onClick={() => setSelectedService(s)}
                                    >
                                        Book Now
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>

                {/* BOOKINGS */}
                <section className="mt-16">
                    <h2 className="text-xl font-bold mb-6">
                        Your Bookings
                    </h2>

                    {bookings.length === 0 ? (
                        <Card className="p-8 text-center text-slate-500">
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
                                        <p className="font-semibold text-slate-900">
                                            {b.service.name}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {new Date(b.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                    <Badge
                                        status={statusLabel[b.status] || b.status}
                                    />
                                </Card>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* BOOKING MODAL */}
            {selectedService && (
                <BookingModal
                    service={selectedService}
                    onClose={() => setSelectedService(null)}
                    onBooked={onBooked}
                />
            )}
        </div>
    );
}
