import { useState } from "react";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Button from "../components/Button";
import { apiRequest } from "../api/client";

export default function BookingModal({ service, onClose, onBooked }) {
    const [scheduledAt, setScheduledAt] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const submit = async () => {
        if (!scheduledAt) {
            setError("Please select date & time");
            return;
        }

        try {
            setLoading(true);
            await apiRequest("/bookings", "POST", {
                serviceId: service._id,
                scheduledAt,
            });
            onBooked(service._id);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <Modal title={`Book ${service.name}`} onClose={onClose}>
            {error && (
                <p className="text-sm text-red-600 mb-3">{error}</p>
            )}

            <Input
                label="Date & Time"
                type="datetime-local"
                onChange={(e) => setScheduledAt(e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-6">
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={submit} disabled={loading}>
                    {loading ? "Booking..." : "Confirm booking"}
                </Button>
            </div>

        </Modal>
    );
}
