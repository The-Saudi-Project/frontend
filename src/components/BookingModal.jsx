import { useState } from "react";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Button from "../components/Button";

const TIME_SLOTS = [
    "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00",
    "15:00", "16:00", "17:00",
];

export default function BookingModal({ service, onClose, onCreated }) {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
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

        try {
            setLoading(true);

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/bookings`,
                {
                    method: "POST",
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

            onCreated(data);   // 🔥 pass booking up
            onClose();         // 🔥 close THIS modal

        } catch (e) {
            setError(e.message || "Booking failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen onClose={onClose} title="Book Service">
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
                    {loading ? "Booking…" : "Confirm Booking"}
                </Button>
            </div>
        </Modal>
    );
}
