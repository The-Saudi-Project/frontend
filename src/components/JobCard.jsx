import { Button, Badge, Card } from "./Ui.jsx";

export default function JobCard({
    booking,
    onAccept,
    onComplete,
    loading,
}) {
    const { _id, service, customer, status, createdAt } =
        booking;

    return (
        <Card className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* LEFT INFO */}
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg text-slate-900">
                        {service.name}
                    </h3>
                    <Badge status={status} />
                </div>

                <p className="text-sm text-slate-500">
                    Customer: {customer?.name || "Customer"}
                </p>

                <p className="text-xs text-slate-400">
                    Requested on{" "}
                    {new Date(createdAt).toLocaleString()}
                </p>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">
                {status === "pending" && (
                    <Button
                        variant="secondary"
                        disabled={loading}
                        onClick={() => onAccept(_id)}
                    >
                        {loading ? "Accepting..." : "Accept Job"}
                    </Button>
                )}

                {status === "assigned" && (
                    <Button
                        disabled={loading}
                        onClick={() => onComplete(_id)}
                    >
                        {loading ? "Completing..." : "Mark Complete"}
                    </Button>
                )}
            </div>
        </Card>
    );
}
