import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({
    onLogin,
    expectedRole,
    title,
    subtitle,
}) {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const isValidEmail = (email) =>
        /^\S+@\S+\.\S+$/.test(email);

    const canSubmit = isValidEmail(email) && password.length > 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!canSubmit) {
            setError("Please enter a valid email and password.");
            return;
        }

        try {
            setLoading(true);
            await onLogin(
                email.trim().toLowerCase(),
                password,
                expectedRole // ✅ pass role intent
            );
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-[#FDFCF9] flex flex-col lg:flex-row text-slate-900">
            {/* LEFT BRAND PANEL */}
            <div className="hidden lg:flex lg:w-1/2 bg-emerald-900 p-16 flex-col justify-between relative overflow-hidden">
                <div>
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-8">
                        <span className="text-white font-bold text-2xl">S</span>
                    </div>

                    <h1 className="text-4xl font-bold text-white leading-tight max-w-md">
                        Welcome back to Saudi Services
                    </h1>
                    <p className="text-emerald-100/80 mt-6 text-lg max-w-sm">
                        Sign in to manage bookings, services, and jobs on the
                        Kingdom’s trusted home-services platform.
                    </p>
                </div>

                <p className="text-emerald-200/60 text-sm">
                    © 2026 Saudi Services Marketplace
                </p>
            </div>

            {/* RIGHT FORM PANEL */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold tracking-tight">
                            {title}
                        </h2>
                        <p className="text-slate-500 mt-2">
                            {subtitle}
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">
                                Email address
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <button
                            disabled={!canSubmit || loading}
                            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>

                        {/* Footer */}
                        <p className="text-sm text-slate-500 text-center">
                            Don’t have an account?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/signup")}
                                className="text-emerald-600 font-semibold hover:underline"
                            >
                                Create one
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
