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
            onBooked();

            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal title={`Book ${service.name}`} onClose={onClose}>
            {/* SUCCESS STATE */}
            {success ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6 animate-bounce">
                        <svg
                            className="w-8 h-8 text-emerald-600"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                        Booking Confirmed
                    </h3>
                    <p className="text-slate-500 mt-2">
                        We’ll notify you once a provider is assigned.
                    </p>
                </div>
            ) : (
                <div className="space-y-6 overflow-y-auto max-h-[65vh] pr-1">

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
                            {error}
                        </div>
                    )}

                    {/* CUSTOMER DETAILS */}
                    <div className="space-y-4">
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
                    </div>

                    {/* DATE */}
                    <div>
                        <p className="text-sm font-semibold mb-2">Select Date *</p>
                        <input
                            type="date"
                            className="w-full border rounded-xl px-4 py-3"
                            min={new Date().toISOString().split("T")[0]}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    {/* TIME — GRID (FIXED UX) */}
                    <div>
                        <p className="text-sm font-semibold mb-3">Select Time *</p>

                        <div className="grid grid-cols-3 gap-2">
                            {TIME_SLOTS.map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setTime(t)}
                                    className={`
                                        py-2 rounded-lg text-sm font-medium
                                        border transition
                                        ${time === t
                                            ? "bg-emerald-600 text-white border-emerald-600"
                                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                        }
                                    `}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        {!time && (
                            <p className="text-xs text-slate-400 mt-2">
                                Please select a preferred time slot
                            </p>
                        )}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={submit} disabled={loading}>
                            {loading ? "Booking..." : "Confirm Booking"}
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
}
