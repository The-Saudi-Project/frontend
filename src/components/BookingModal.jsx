import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Button from "../components/Button";

const TIME_SLOTS = [
    "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00",
    "15:00", "16:00", "17:00",
];

export default function BookingModal({
    mode = "create",          // "create" | "reschedule"
    service,
    booking = null,           // only for reschedule
    onClose,
    onCreated,
    onRescheduled,
}) {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* ---------- PREFILL FOR RESCHEDULE ---------- */
    useEffect(() => {
        if (mode === "reschedule" && booking) {
            const d = new Date(booking.scheduledAt);
            setDate(d.toISOString().split("T")[0]);
            setTime(d.toTimeString().slice(0, 5));

            setCustomerName(booking.customerName || "");
            setCustomerPhone(booking.customerPhone || "");
            setCustomerAddress(booking.customerAddress || "");
            setNotes(booking.notes || "");
        }
    }, [mode, booking]);

    /* ---------- SUBMIT ---------- */
    const submit = async () => {
        setError("");

        if (!date || !time || !customerName || !customerPhone || !customerAddress) {
            setError("Please fill all required fields");
            return;
        }

        try {
            setLoading(true);

            const endpoint =
                mode === "create"
                    ? "/bookings"
                    : `/bookings/${booking._id}/reschedule`; // backend later

            const method = mode === "create" ? "POST" : "PATCH";

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}${endpoint}`,
                {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        serviceId: service._id,
                        scheduledAt: new Date(`${date}T${time}:00`),
                        customerName,
                        customerPhone,
                        customerAddress,
                        notes,
                    }),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            if (mode === "create") {
                onCreated?.(data);
            } else {
                onRescheduled?.(data);
            }

            onClose();

        } catch (e) {
            setError(e.message || "Action failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen
            onClose={onClose}
            title={mode === "create" ? "Book Service" : "Reschedule Booking"}
        >
            <div className="space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                        {error}
                    </div>
                )}

                <Input label="Full Name *" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                <Input label="Phone *" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                <Input label="Address *" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} />
                <Input label="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />

                <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border"
                />

                <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map(t => (
                        <button
                            key={t}
                            onClick={() => setTime(t)}
                            className={`py-2 rounded-xl border ${time === t ? "bg-emerald-600 text-white" : ""
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <Button onClick={submit} disabled={loading} className="w-full">
                    {loading
                        ? "Please wait…"
                        : mode === "create"
                            ? "Confirm Booking"
                            : "Confirm Reschedule"}
                </Button>
            </div>
        </Modal>
    );
}
