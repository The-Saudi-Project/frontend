import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { Card, Button, Badge } from "../components/Ui.jsx";
import AdminNav from "../components/AdminNav";

export default function AdminProviders() {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const loadProviders = async () => {
        const res = await apiRequest("/users/providers");
        setProviders(res);
    };

    useEffect(() => {
        loadProviders().finally(() => setLoading(false));
    }, []);

    /* ---------------- ACTIONS ---------------- */

    const resetPassword = async (providerId) => {
        const ok = window.confirm(
            "Reset password for this provider?\nThey will be forced to set a new password on next login."
        );
        if (!ok) return;

        try {
            setActionLoading(providerId);
            await apiRequest(
                `/users/${providerId}/reset-password`,
                "POST"
            );
            alert("Password reset successfully.");
        } finally {
            setActionLoading(null);
        }
    };

    const toggleStatus = async (provider) => {
        const ok = window.confirm(
            provider.active
                ? "Suspend this provider?"
                : "Activate this provider?"
        );
        if (!ok) return;

        try {
            setActionLoading(provider._id);
            await apiRequest(
                `/users/${provider._id}/status`,
                "PATCH",
                { active: !provider.active }
            );
            await loadProviders();
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-slate-500">
                Loading providers…
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <AdminNav />

            <h1 className="text-2xl font-bold">
                Service Providers
            </h1>

            {providers.length === 0 ? (
                <Card className="p-8 text-center text-slate-500">
                    No providers found
                </Card>
            ) : (
                <div className="space-y-4">
                    {providers.map((p) => (
                        <Card
                            key={p._id}
                            className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                        >
                            {/* INFO */}
                            <div className="space-y-1">
                                <p className="font-semibold text-slate-900">
                                    {p.name}
                                </p>
                                <p className="text-sm text-slate-500">
                                    {p.email}
                                </p>

                                <div className="flex gap-2 mt-2">
                                    <Badge
                                        status={
                                            p.active
                                                ? "Active"
                                                : "Suspended"
                                        }
                                    />
                                </div>
                            </div>

                            {/* ACTIONS */}
                            <div className="flex gap-2">
                                {/* EDIT (NEXT STEP) */}
                                <Button
                                    variant="secondary"
                                    disabled
                                >
                                    Edit
                                </Button>

                                {/* RESET PASSWORD */}
                                <Button
                                    variant="ghost"
                                    disabled={actionLoading === p._id}
                                    onClick={() =>
                                        resetPassword(p._id)
                                    }
                                >
                                    Reset Password
                                </Button>

                                {/* ACTIVATE / SUSPEND */}
                                <Button
                                    variant={
                                        p.active
                                            ? "danger"
                                            : "primary"
                                    }
                                    disabled={actionLoading === p._id}
                                    onClick={() =>
                                        toggleStatus(p)
                                    }
                                >
                                    {p.active
                                        ? "Suspend"
                                        : "Activate"}
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
