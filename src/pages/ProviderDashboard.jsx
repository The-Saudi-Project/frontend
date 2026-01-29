import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import JobCard from "../components/JobCard";

export default function ProviderDashboard() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadJobs = async () => {
        const res = await apiRequest("/bookings/provider");
        setJobs(res);
    };

    useEffect(() => {
        loadJobs().finally(() => setLoading(false));
    }, []);

    const acceptJob = async (id) => {
        await apiRequest(`/bookings/${id}/accept`, "PATCH");
        loadJobs();
    };

    const completeJob = async (id) => {
        await apiRequest(`/bookings/${id}/complete`, "PATCH");
        loadJobs();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="max-w-5xl mx-auto space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="bg-white p-5 rounded-2xl border border-slate-100"
                        >
                            <div className="flex justify-between">
                                <div className="space-y-2">
                                    <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
                                    <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                                    <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
                                    <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                <header>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Your Jobs
                    </h2>
                    <p className="text-slate-500">
                        Jobs assigned to you
                    </p>
                </header>

                {jobs.length === 0 ? (
                    <p className="text-slate-500">
                        No jobs assigned yet
                    </p>
                ) : (
                    jobs.map((job) => (
                        <JobCard
                            key={job._id}
                            booking={job}
                            onAccept={acceptJob}
                            onComplete={completeJob}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
