import { Button, Badge, Card } from "./Ui.jsx";

const statusMap = {
    CREATED: { label: "New Request", tone: "warning" },
    ASSIGNED: { label: "Assigned", tone: "info" },
    IN_PROGRESS: { label: "In Progress", tone: "info" },
    COMPLETED: { label: "Completed", tone: "success" },
    CANCELLED: { label: "Cancelled", tone: "default" },
};

export default function JobCard({
    booking,
    onAccept,
    onComplete,
    loading,
}) {
    const {
        _id,
        service,
        customer,
        status,
        scheduledAt,
        createdAt,
    } = booking;

    const meta = statusMap[status] || {
        label: status,
        tone: "default",
    };

    return (
        <Card className="p-5 sm:p-6 space-y-4">
            {/* TOP ROW */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-slate-900">
                            {service?.name || "Service"}
                        </h3>
                        <Badge status={meta.tone}>
                            {meta.label}
                        </Badge>
                    </div>

                    <p className="text-sm text-slate-500">
                        Customer:{" "}
                        <span className="font-medium text-slate-700">
                            {customer?.name || "Customer"}
                        </span>
                    </p>

                    {/* FUTURE PLACEHOLDER */}
                    {scheduledAt && (
                        <p className="text-xs text-slate-400">
                            Scheduled for{" "}
                            {new Date(scheduledAt).toLocaleString()}
                        </p>
                    )}

                    <p className="text-xs text-slate-400">
                        Requested on{" "}
                        {new Date(createdAt).toLocaleString()}
                    </p>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    {status === "CREATED" && (
                        <Button
                            variant="secondary"
                            disabled={loading}
                            onClick={() => onAccept(_id)}
                            className="w-full sm:w-auto"
                        >
                            {loading ? "Accepting…" : "Accept Job"}
                        </Button>
                    )}

                    {status === "ASSIGNED" || status === "IN_PROGRESS" ? (
                        <Button
                            variant="primary"
                            disabled={loading}
                            onClick={() => onComplete(_id)}
                            className="w-full sm:w-auto"
                        >
                            {loading ? "Completing…" : "Mark Complete"}
                        </Button>
                    ) : null}
                </div>
            </div>

            {/* FUTURE EXTENSION SLOT */}
            {/*
        <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs text-slate-500">
          <div>Address: —</div>
          <div>Earnings: —</div>
        </div>
      */}
        </Card>
    );
}
