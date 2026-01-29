import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { Button, Card, Badge } from "../components/Ui";

export default function CustomerDashboard() {
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            apiRequest("/services"),
            apiRequest("/bookings/customer"),
        ])
            .then(([servicesRes, bookingsRes]) => {
                setServices(servicesRes);
                setBookings(bookingsRes);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
                        <div className="h-4 w-64 bg-slate-200 rounded mt-2 animate-pulse" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="bg-white p-5 rounded-2xl border border-slate-100"
                            >
                                <div className="h-40 bg-slate-200 rounded-xl mb-4 animate-pulse" />
                                <div className="h-5 w-3/4 bg-slate-200 rounded animate-pulse" />
                                <div className="h-4 w-full bg-slate-200 rounded mt-2 animate-pulse" />
                                <div className="h-6 w-24 bg-slate-200 rounded mt-4 animate-pulse" />
                                <div className="h-10 w-full bg-slate-200 rounded-xl mt-6 animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <main className="max-w-6xl mx-auto p-6">
                <header className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Choose a Service</h2>
                    <p className="text-slate-500">Verified professionals</p>
                </header>

                {/* SERVICES */}
                {services.length === 0 ? (
                    <p className="text-slate-500">No services available</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((s) => (
                            <Card key={s._id} className="p-5 flex flex-col justify-between">
                                <div>
                                    <div className="h-40 bg-slate-100 rounded-xl mb-4 flex items-center justify-center text-slate-400">
                                        Service Image
                                    </div>
                                    <h3 className="font-bold text-lg">{s.name}</h3>
                                    <p className="text-slate-500 text-sm">{s.description}</p>
                                    <p className="text-emerald-600 font-bold mt-4 text-xl">
                                        {s.price} SAR
                                    </p>
                                </div>

                                <Button
                                    className="mt-6 w-full"
                                    onClick={() =>
                                        apiRequest("/bookings", "POST", { serviceId: s._id })
                                    }
                                >
                                    Book Now
                                </Button>
                            </Card>
                        ))}
                    </div>
                )}

                {/* BOOKINGS */}
                <div className="mt-12">
                    <h3 className="font-bold text-lg mb-4">Your Recent Bookings</h3>

                    {bookings.map((b) => (
                        <Card key={b._id} className="p-4 flex justify-between">
                            <div>
                                <p className="font-bold">{b.service.name}</p>
                                <p className="text-xs text-slate-500">
                                    {new Date(b.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <Badge status={b.status} />
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
