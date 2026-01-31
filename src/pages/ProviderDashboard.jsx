import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import JobCard from "../components/JobCard";

export default function ProviderDashboard() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const loadJobs = async () => {
        const res = await apiRequest("/bookings/provider");
        setJobs(res);
    };

    useEffect(() => {
        loadJobs().finally(() => setLoading(false));
    }, []);

    const acceptJob = async (id) => {
        try {
            setActionLoading(id);
            await apiRequest(`/bookings/${id}/accept`, "PATCH");
            await loadJobs();
        } finally {
            setActionLoading(null);
        }
    };

    const completeJob = async (id) => {
        try {
            setActionLoading(id);
            await apiRequest(`/bookings/${id}/complete`, "PATCH");
            await loadJobs();
        } finally {
            setActionLoading(null);
        }
    };

    /* ================= LOADING STATE ================= */
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-10">
                <div className="max-w-4xl mx-auto space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse"
                        >
                            <div className="flex justify-between items-center">
                                <div className="space-y-3">
                                    <div className="h-5 w-48 bg-slate-200 rounded" />
                                    <div className="h-4 w-32 bg-slate-200 rounded" />
                                </div>
                                <div className="flex gap-3">
                                    <div className="h-10 w-24 bg-slate-200 rounded-xl" />
                                    <div className="h-10 w-24 bg-slate-200 rounded-xl" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 px-4 py-10 pb-24">
            <div className="max-w-4xl mx-auto space-y-10">

                {/* ================= HEADER ================= */}
                <header className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                        Active Jobs
                    </h1>
                    <p className="text-slate-500">
                        Review, accept, and complete your assigned services
                    </p>
                </header>

                {/* ================= SUMMARY (PLACEHOLDER) ================= */}
                {/*
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <SummaryCard label="Today’s Jobs" value="3" />
                    <SummaryCard label="Completed" value="18" />
                    <SummaryCard label="Earnings" value="SAR 1,240" />
                    <SummaryCard label="Rating" value="4.9 ★" />
                </section>
                */}

                {/* ================= JOB LIST ================= */}
                {jobs.length === 0 ? (
                    <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center">
                        <p className="text-slate-500 text-sm">
                            No jobs assigned yet.
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                            New jobs will appear here once assigned by admin.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map((job) => (
                            <JobCard
                                key={job._id}
                                booking={job}
                                loading={actionLoading === job._id}
                                onAccept={acceptJob}
                                onComplete={completeJob}
                            />
                        ))}
                    </div>
                )}

                {/* ================= FUTURE PLACEHOLDERS ================= */}
                {/*
                <section className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center">
                    <p className="text-slate-400 text-sm italic">
                        Upcoming features: route map, availability toggle,
                        earnings breakdown, reviews.
                    </p>
                </section>
                */}
            </div>
        </div>
    );
}
