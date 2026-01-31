import { useState } from "react";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Button from "../components/Button";
import { apiRequest } from "../api/client";

const TIME_SLOTS = [
    "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00",
    "15:00", "16:00", "17:00",
];

export default function BookingModal({ service, onClose, onBooked }) {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [notes, setNotes] = useState("");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const submit = async () => {
        setError("");

        if (!date || !time || !customerName || !customerPhone || !customerAddress) {
            setError("Please fill all required fields");
            return;
        }

        const scheduledAt = new Date(`${date}T${time}:00`);

        try {
            setLoading(true);

            await apiRequest("/bookings", "POST", {
                serviceId: service._id,
                scheduledAt,
                customerName,
                customerPhone,
                customerAddress,
                notes,
            });

            setSuccess(true);
            onBooked?.();

            setTimeout(() => {
                onClose();
            }, 1400);
        } catch (e) {
            setError(e.message || "Failed to create booking");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen
            onClose={onClose}
            title={`Book ${service.name}`}
            footer={
                !success && (
                    <>
                        <Button variant="secondary" className="flex-1" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button className="flex-1" onClick={submit} disabled={loading}>
                            {loading ? "Booking…" : "Confirm"}
                        </Button>
                    </>
                )
            }
        >
            {/* SUCCESS STATE */}
            {success ? (
                <div className="py-20 text-center">
                    <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-5">
                        <svg
                            className="w-7 h-7 text-emerald-600"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900">
                        Booking confirmed
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        A provider will be assigned shortly.
                    </p>
                </div>
            ) : (
                <div className="space-y-8">

                    {/* ERROR */}
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                            {error}
                        </div>
                    )}

                    {/* CUSTOMER DETAILS */}
                    <section className="space-y-4">
                        <Input
                            label="Full Name *"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                        <Input
                            label="Phone Number *"
                            placeholder="+966 5X XXX XXXX"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                        />
                        <Input
                            label="Address *"
                            placeholder="House / Apartment, Area"
                            value={customerAddress}
                            onChange={(e) => setCustomerAddress(e.target.value)}
                        />
                        <Input
                            label="Notes (optional)"
                            placeholder="Any special instructions"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </section>

                    {/* DATE */}
                    <section className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                            Preferred Date
                        </p>
                        <input
                            type="date"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            min={new Date().toISOString().split("T")[0]}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </section>

                    {/* TIME */}
                    <section className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                            Preferred Time
                        </p>

                        <div className="grid grid-cols-3 gap-2">
                            {TIME_SLOTS.map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setTime(t)}
                                    className={`
                    py-2.5 rounded-xl text-sm font-medium transition
                    border
                    ${time === t
                                            ? "bg-emerald-600 text-white border-emerald-600"
                                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                        }
                  `}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        {!time && (
                            <p className="text-xs text-slate-400">
                                Select a time slot to continue
                            </p>
                        )}
                    </section>

                    {/* FUTURE PLACEHOLDERS */}
                    {/*
            - Pricing breakdown
            - Coupons / offers
            - Map preview
          */}
                </div>
            )}
        </Modal>
    );
}
