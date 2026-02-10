import { Button, Badge, Card } from "./Ui.jsx";

export default function JobCard({
    booking,
    onStart,
    onComplete,
    loading,
}) {
    const {
        _id,
        service,
        customerName,
        customerPhone,
        customerAddress,
        notes,
        scheduledAt,
        status,
        createdAt,
    } = booking;

    return (
        <Card className="p-6 space-y-5">
            {/* HEADER */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">
                        {service?.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                        Booked on {new Date(createdAt).toLocaleString()}
                    </p>
                </div>

                <Badge status={status} />
            </div>

            {/* CUSTOMER DETAILS */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
                <p>
                    <span className="font-semibold text-slate-700">
                        Customer:
                    </span>{" "}
                    {customerName}
                </p>

                <p>
                    <span className="font-semibold text-slate-700">
                        Phone:
                    </span>{" "}
                    {customerPhone || "Not provided"}
                </p>

                <p>
                    <span className="font-semibold text-slate-700">
                        Address:
                    </span>{" "}
                    {customerAddress || "Not provided"}
                </p>

                {notes && (
                    <p>
                        <span className="font-semibold text-slate-700">
                            Notes:
                        </span>{" "}
                        {notes}
                    </p>
                )}
            </div>

            {/* SCHEDULE + PRICE */}
            <div className="flex justify-between items-center text-sm text-slate-600">
                <div>
                    <span className="font-semibold text-slate-700">
                        Scheduled:
                    </span>{" "}
                    {new Date(scheduledAt).toLocaleString()}
                </div>

                <div className="font-semibold text-emerald-600">
                    {service?.price} SAR
                </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-4 border-t">
                {status === "ASSIGNED" && (
                    <Button
                        variant="secondary"
                        disabled={loading}
                        onClick={() => onStart(_id)}
                    >
                        {loading ? "Starting…" : "Start Job"}
                    </Button>
                )}

                {status === "IN_PROGRESS" && (
                    <Button
                        disabled={loading}
                        onClick={() => onComplete(_id)}
                    >
                        {loading ? "Completing…" : "Mark Complete"}
                    </Button>
                )}
            </div>
        </Card>
    );
}
