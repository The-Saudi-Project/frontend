import { Button, Card, Badge } from "./Ui.jsx";

export default function JobCard({ booking, onAccept, onComplete }) {
    return (
        <Card className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900">
                        {booking.service.name}
                    </h4>
                    <Badge status={booking.status} />
                </div>

                <p className="text-sm text-slate-500">
                    Customer: {booking.customer.firstName}{" "}
                    {booking.customer.lastName}
                </p>

                <p className="text-xs text-emerald-600 font-medium">
                    {new Date(booking.createdAt).toLocaleString()}
                </p>
            </div>

            <div className="flex gap-2">
                {booking.status === "Booked" && (
                    <Button
                        variant="secondary"
                        className="py-2 text-sm"
                        onClick={() => onAccept(booking._id)}
                    >
                        Accept Job
                    </Button>
                )}

                {booking.status === "Assigned" && (
                    <Button
                        variant="primary"
                        className="py-2 text-sm"
                        onClick={() => onComplete(booking._id)}
                    >
                        Complete
                    </Button>
                )}
            </div>
        </Card>
    );
}
