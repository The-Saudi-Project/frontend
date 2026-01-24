import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import Card from "../components/Card";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import ErrorBanner from "../components/ErrorBanner";
import StatusBadge from "../components/StatusBadge";
import { formatDateTime } from "../utils/date";
import SummaryCard from "../components/SummaryCard";
import SuccessBanner from "../components/SuccessBanner";


export default function ProviderDashboard() {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState("");
    const [loadingId, setLoadingId] = useState(null);
    const [success, setSuccess] = useState("");


    const loadJobs = async () => {
        try {
            const res = await apiRequest("/bookings/provider");
            setJobs(res);
        } catch (e) {
            setError(e.message);
        }
    };

    useEffect(() => {
        loadJobs();
    }, []);

    const updateStatus = async (bookingId, status) => {
        try {
            setLoadingId(bookingId);
            await apiRequest("/bookings/status", "POST", { bookingId, status });
            setSuccess(
                status === "IN_PROGRESS"
                    ? "Job started successfully."
                    : "Job marked as completed."
            );

            setTimeout(() => setSuccess(""), 3000);
            setError("");
            loadJobs();
        } catch (e) {
            setError(e.message);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="space-y-8">
            <ErrorBanner message={error} />
            <SuccessBanner message={success} />
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SummaryCard
                    label="Assigned jobs"
                    value={jobs.filter(j => j.status === "ASSIGNED").length}
                />
                <SummaryCard
                    label="In progress"
                    value={jobs.filter(j => j.status === "IN_PROGRESS").length}
                />
            </div>

            <Card>
                <h2 className="text-xl font-semibold mb-4">My jobs</h2>

                {jobs.length === 0 ? (
                    <EmptyState
                        title="No jobs assigned"
                        description="Jobs will appear once admin assigns them."
                    />
                ) : (
                    <ul className="space-y-4">
                        {jobs.map((job) => (
                            <li
                                key={job._id}
                                className="flex justify-between items-center border rounded-xl px-4 py-3"
                            >
                                <div>
                                    <p className="font-medium">{job.service.name}</p>
                                    <p className="text-sm text-gray-500">
                                        Customer: {job.customer.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatDateTime(job.scheduledAt)}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <StatusBadge status={job.status} />

                                    <Button
                                        disabled={
                                            job.status !== "ASSIGNED" ||
                                            loadingId === job._id
                                        }
                                        onClick={() =>
                                            updateStatus(job._id, "IN_PROGRESS")
                                        }
                                    >
                                        {loadingId === job._id
                                            ? "Starting..."
                                            : "Start"}
                                    </Button>

                                    <Button
                                        disabled={
                                            job.status !== "IN_PROGRESS" ||
                                            loadingId === job._id
                                        }
                                        onClick={() =>
                                            updateStatus(job._id, "COMPLETED")
                                        }
                                    >
                                        {loadingId === job._id
                                            ? "Completing..."
                                            : "Complete"}
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
        </div>
    );
}
