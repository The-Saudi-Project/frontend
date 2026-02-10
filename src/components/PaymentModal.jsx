import { useState } from "react";
import Modal from "../components/Modal";
import Button from "../components/Button";

export default function PaymentModal({ booking, onClose, onDone }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const upload = async () => {
        if (!file) {
            setError("Please upload payment screenshot");
            return;
        }

        const formData = new FormData();
        formData.append("proof", file);

        try {
            setLoading(true);

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/bookings/${booking._id}/payment-proof`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                    body: formData,
                }
            );

            if (!res.ok) throw new Error("Upload failed");

            onDone?.();
            onClose();

        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen onClose={onClose} title="Complete Payment">
            <div className="space-y-6 text-center">
                <img src="/gpay-qr.png" className="mx-auto w-48 rounded-xl border" />

                <input
                    type="file"
                    accept="image/*"
                    onChange={e => setFile(e.target.files[0])}
                />

                {file && (
                    <img
                        src={URL.createObjectURL(file)}
                        className="mx-auto w-40 rounded-xl border"
                    />
                )}

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <Button onClick={upload} disabled={loading} className="w-full">
                    {loading ? "Uploading…" : "Upload Payment Proof"}
                </Button>
            </div>
        </Modal>
    );
}
