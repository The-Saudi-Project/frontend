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

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="max-w-5xl mx-auto space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="bg-white p-6 rounded-2xl border border-slate-100 animate-pulse"
                        >
                            <div className="flex justify-between">
                                <div className="space-y-2">
                                    <div className="h-5 w-40 bg-slate-200 rounded" />
                                    <div className="h-4 w-32 bg-slate-200 rounded" />
                                    <div className="h-3 w-24 bg-slate-200 rounded" />
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-9 w-24 bg-slate-200 rounded-xl" />
                                    <div className="h-9 w-24 bg-slate-200 rounded-xl" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 pb-24">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* HEADER */}
                <header>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Your Jobs
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Manage assigned service requests
                    </p>
                </header>

                {/* JOB LIST */}
                {jobs.length === 0 ? (
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 text-slate-500">
                        No jobs assigned yet
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
            </div>
        </div>
    );
}
