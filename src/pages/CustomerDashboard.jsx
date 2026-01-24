import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import Card from "../components/Card";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import SummaryCard from "../components/SummaryCard";
import StatusBadge from "../components/StatusBadge";
import { formatDateTime } from "../utils/date";

export default function CustomerDashboard() {
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [selectedService, setSelectedService] = useState(null);

    const [bookingData, setBookingData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        notes: "",
        scheduledAt: "",
    });

    /* ---------------- LOAD DATA ---------------- */

    const loadServices = async () => {
        const res = await apiRequest("/services");
        setServices(res);
    };

    const loadBookings = async () => {
        const res = await apiRequest("/bookings/my");
        setBookings(res);
    };

    useEffect(() => {
        loadServices();
        loadBookings();
    }, []);

    /* ---------------- BOOKING ---------------- */

    const openBookingModal = (service) => {
        setSelectedService(service);
    };

    const closeBookingModal = () => {
        setSelectedService(null);
        setBookingData({
            name: "",
            phone: "",
            email: "",
            address: "",
            notes: "",
            scheduledAt: "",
        });
    };

    const confirmBooking = async () => {
        if (
            !bookingData.name ||
            !bookingData.phone ||
            !bookingData.address ||
            !bookingData.scheduledAt
        ) {
            alert("Please fill all required fields");
            return;
        }

        await apiRequest("/bookings", "POST", {
            serviceId: selectedService._id,
            ...bookingData,
        });

        closeBookingModal();
        loadBookings();
    };

    /* ---------------- UI ---------------- */

    return (
        <div className="space-y-8">
            {/* SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SummaryCard
                    label="Upcoming bookings"
                    value={bookings.filter((b) =>
                        ["CREATED", "ASSIGNED", "IN_PROGRESS"].includes(b.status)
                    ).length}
                />
                <SummaryCard
                    label="Completed bookings"
                    value={bookings.filter((b) => b.status === "COMPLETED").length}
                />
            </div>

            {/* SERVICES */}
            <Card>
                <h2 className="text-xl font-semibold mb-4">Available services</h2>

                {services.length === 0 ? (
                    <EmptyState title="No services available" />
                ) : (
                    <ul className="space-y-3">
                        {services.map((s) => (
                            <li
                                key={s._id}
                                className="flex justify-between items-center border rounded-xl px-4 py-3"
                            >
                                <div>
                                    <p className="font-medium">{s.name}</p>
                                    <p className="text-sm text-gray-500">SAR {s.price}</p>
                                </div>
                                <Button onClick={() => openBookingModal(s)}>
                                    Book
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>

            {/* BOOKINGS */}
            <Card>
                <h2 className="text-xl font-semibold mb-4">My bookings</h2>

                {bookings.length === 0 ? (
                    <EmptyState title="No bookings yet" />
                ) : (
                    <ul className="space-y-3">
                        {bookings.map((b) => (
                            <li
                                key={b._id}
                                className="flex justify-between items-center border rounded-xl px-4 py-3"
                            >
                                <div>
                                    <p className="font-medium">{b.service?.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {formatDateTime(b.scheduledAt)}
                                    </p>
                                </div>

                                <StatusBadge status={b.status} />
                            </li>
                        ))}
                    </ul>
                )}
            </Card>

            {/* BOOKING MODAL */}
            {selectedService && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Book {selectedService.name}
                        </h2>

                        <div className="space-y-3">
                            <input
                                className="w-full border rounded px-3 py-2"
                                placeholder="Full name"
                                onChange={(e) =>
                                    setBookingData({ ...bookingData, name: e.target.value })
                                }
                            />
                            <input
                                className="w-full border rounded px-3 py-2"
                                placeholder="Phone number"
                                onChange={(e) =>
                                    setBookingData({ ...bookingData, phone: e.target.value })
                                }
                            />
                            <input
                                className="w-full border rounded px-3 py-2"
                                placeholder="Email"
                                onChange={(e) =>
                                    setBookingData({ ...bookingData, email: e.target.value })
                                }
                            />
                            <input
                                className="w-full border rounded px-3 py-2"
                                placeholder="Address"
                                onChange={(e) =>
                                    setBookingData({ ...bookingData, address: e.target.value })
                                }
                            />
                            <input
                                type="datetime-local"
                                className="w-full border rounded px-3 py-2"
                                onChange={(e) =>
                                    setBookingData({
                                        ...bookingData,
                                        scheduledAt: e.target.value,
                                    })
                                }
                            />
                            <textarea
                                className="w-full border rounded px-3 py-2"
                                placeholder="Additional comments (optional)"
                                onChange={(e) =>
                                    setBookingData({ ...bookingData, notes: e.target.value })
                                }
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="secondary" onClick={closeBookingModal}>
                                Cancel
                            </Button>
                            <Button onClick={confirmBooking}>
                                Confirm booking
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
