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
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
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
            onBooked();
            onClose();
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal title={`Book ${service.name}`} onClose={onClose}>
            <div className="space-y-6">

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
                        {error}
                    </div>
                )}

                {/* CUSTOMER DETAILS */}
                <div className="space-y-4">
                    <Input label="Full Name *" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                    <Input label="Phone Number *" placeholder="+966 5X XXX XXXX" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                    <Input label="Address *" placeholder="House / Apartment, Area" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />
                    <Input label="Notes (optional)" placeholder="Any special instructions" value={notes} onChange={(e) => setNotes(e.target.value)} />
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

                {/* TIME */}
                <div className="relative">
                    <p className="text-sm font-semibold mb-2">Select Time *</p>

                    {/* Trigger */}
                    <button
                        type="button"
                        onClick={() => setShowTimePicker((v) => !v)}
                        className="w-full flex justify-between items-center border rounded-xl px-4 py-3 text-left"
                    >
                        <span className={time ? "text-slate-900" : "text-slate-400"}>
                            {time || "Select a time"}
                        </span>
                        <span className="text-slate-400">▾</span>
                    </button>

                    {/* Dropdown */}
                    {showTimePicker && (
                        <div
                            className="
      absolute z-20 mt-2 w-full
      bg-white border rounded-xl shadow-lg
      max-h-40 overflow-y-auto
    "                        >
                            {TIME_SLOTS.map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => {
                                        setTime(t);
                                        setShowTimePicker(false);
                                    }}
                                    className={`
          w-full text-left px-4 py-2 text-sm
          transition rounded-lg
          ${time === t
                                            ? "bg-emerald-600 text-white"
                                            : "hover:bg-slate-100"
                                        }
        `}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
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
        </Modal>
    );
}
