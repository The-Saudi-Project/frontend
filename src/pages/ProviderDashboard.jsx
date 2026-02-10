import { useEffect, useState, useMemo } from "react";
import { apiRequest } from "../api/client";
import JobCard from "../components/JobCard";
import { Card, Badge } from "../components/Ui.jsx";

export default function ProviderDashboard() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [tab, setTab] = useState("active"); // active | history

    const loadJobs = async () => {
        const res = await apiRequest("/bookings/provider");
        setJobs(res || []);
    };

    useEffect(() => {
        loadJobs().finally(() => setLoading(false));
    }, []);

    /* ================= ACTIONS ================= */

    const startJob = async (id) => {
        try {
            setActionLoading(id);
            await apiRequest(`/bookings/${id}/start`, { method: "PATCH" });
            await loadJobs();
        } finally {
            setActionLoading(null);
        }
    };

    const completeJob = async (id) => {
        try {
            setActionLoading(id);
            await apiRequest(`/bookings/${id}/complete`, { method: "PATCH" });
            await loadJobs();
        } finally {
            setActionLoading(null);
        }
    };

    /* ================= DERIVED DATA ================= */

    const activeJobs = jobs.filter(
        (j) => j.status !== "COMPLETED" && j.status !== "CANCELLED"
    );

    const completedJobs = jobs.filter(
        (j) => j.status === "COMPLETED"
    );

    const totalEarnings = useMemo(() => {
        return completedJobs.reduce(
            (sum, j) => sum + (j.service?.price || 0),
            0
        );
    }, [completedJobs]);

    if (loading) {
        return <div className="p-6 text-slate-500">Loading jobs…</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50/50 px-4 py-10 pb-24">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* HEADER */}
                <header>
                    <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                        Provider Dashboard
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Manage your active jobs and earnings
                    </p>
                </header>

                {/* STATS */}
                <section className="grid grid-cols-2 gap-4">
                    <Card className="p-5">
                        <p className="text-xs uppercase text-slate-400 font-semibold">
                            Completed Jobs
                        </p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">
                            {completedJobs.length}
                        </p>
                    </Card>

                    <Card className="p-5">
                        <p className="text-xs uppercase text-slate-400 font-semibold">
                            Total Earnings
                        </p>
                        <p className="text-2xl font-bold text-emerald-600 mt-1">
                            {totalEarnings} SAR
                        </p>
                    </Card>
                </section>

                {/* TABS */}
                <div className="flex gap-6 border-b">
                    <button
                        onClick={() => setTab("active")}
                        className={`pb-3 text-sm font-medium ${tab === "active"
                                ? "text-emerald-600 border-b-2 border-emerald-600"
                                : "text-slate-400"
                            }`}
                    >
                        Active Jobs
                    </button>

                    <button
                        onClick={() => setTab("history")}
                        className={`pb-3 text-sm font-medium ${tab === "history"
                                ? "text-emerald-600 border-b-2 border-emerald-600"
                                : "text-slate-400"
                            }`}
                    >
                        Job History
                    </button>
                </div>

                {/* ACTIVE JOBS */}
                {tab === "active" && (
                    <>
                        {activeJobs.length === 0 ? (
                            <Card className="p-8 text-center text-slate-500">
                                No active jobs right now
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {activeJobs.map((job) => (
                                    <JobCard
                                        key={job._id}
                                        booking={job}
                                        loading={actionLoading === job._id}
                                        onStart={startJob}
                                        onComplete={completeJob}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* HISTORY */}
                {tab === "history" && (
                    <>
                        {completedJobs.length === 0 ? (
                            <Card className="p-8 text-center text-slate-500">
                                No completed jobs yet
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {completedJobs.map((job) => (
                                    <Card key={job._id} className="p-5">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {job.service?.name}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {new Date(job.scheduledAt).toLocaleString()}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    {job.customerAddress}
                                                </p>
                                                <p className="text-xs font-semibold text-emerald-600 mt-2">
                                                    Earned: {job.service?.price} SAR
                                                </p>
                                            </div>

                                            <Badge status="COMPLETED" />
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
