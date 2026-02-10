import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

const TIME_SLOTS = [
    "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00",
    "15:00", "16:00", "17:00",
];

export default function RescheduleModal({ booking, onClose, onDone }) {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const submit = async () => {
        if (!date || !time) {
            setError("Please select date and time");
            return;
        }

        try {
            setLoading(true);

            await fetch(
                `${import.meta.env.VITE_API_URL}/bookings/${booking._id}/reschedule`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        scheduledAt: new Date(`${date}T${time}:00`),
                    }),
                }
            );

            onDone();
            onClose();
        } catch (e) {
            setError("Failed to reschedule booking");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal title="Reschedule Booking" onClose={onClose}>
            <div className="space-y-4">
                {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                )}

                <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full border px-4 py-2 rounded-lg"
                />

                <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map(t => (
                        <button
                            key={t}
                            onClick={() => setTime(t)}
                            className={`py-2 rounded-lg border ${time === t
                                ? "bg-emerald-600 text-white"
                                : ""
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <Button
                    onClick={submit}
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? "Rescheduling…" : "Confirm Reschedule"}
                </Button>
            </div>
        </Modal>
    );
}
