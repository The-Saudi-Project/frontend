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
                expectedRole // role intent enforced
            );
        } catch (e) {
            setError(e.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row text-slate-900">

            {/* ================= LEFT BRAND PANEL (DESKTOP) ================= */}
            <div className="hidden lg:flex lg:w-1/2 bg-emerald-900 relative overflow-hidden">
                <div className="flex flex-col justify-between p-16 w-full">
                    <div>
                        {/* LOGO */}
                        <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-10">
                            <span className="text-white font-bold text-2xl">
                                S
                            </span>
                        </div>

                        <h1 className="text-4xl font-serif text-white leading-tight max-w-md">
                            Premium services,
                            <br />
                            <span className="italic text-emerald-300">
                                effortlessly managed.
                            </span>
                        </h1>

                        <p className="text-emerald-100/80 mt-6 text-lg max-w-sm">
                            Access your dashboard to manage bookings, services,
                            and assignments on Saudi Services.
                        </p>
                    </div>

                    <p className="text-emerald-200/60 text-sm">
                        © 2026 Saudi Services Marketplace
                    </p>
                </div>
            </div>

            {/* ================= RIGHT FORM PANEL ================= */}
            <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-6 lg:px-12">
                <div className="w-full max-w-md">

                    {/* HEADER */}
                    <div className="mb-10">
                        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                            {title}
                        </h2>
                        <p className="text-slate-500 mt-2">
                            {subtitle}
                        </p>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div className="mb-5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    {/* FORM */}
                    <form
                        className="space-y-6"
                        onSubmit={handleSubmit}
                    >
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                Email address
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                className="
                                    w-full px-4 py-3 rounded-xl
                                    border border-slate-200
                                    bg-slate-50/50
                                    focus:outline-none
                                    focus:ring-2 focus:ring-emerald-500/20
                                    focus:border-emerald-500
                                    transition
                                "
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                className="
                                    w-full px-4 py-3 rounded-xl
                                    border border-slate-200
                                    bg-slate-50/50
                                    focus:outline-none
                                    focus:ring-2 focus:ring-emerald-500/20
                                    focus:border-emerald-500
                                    transition
                                "
                            />
                        </div>

                        {/* FUTURE: Remember me / OTP / SSO */}
                        {/*
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" />
                                Remember me
                            </label>
                            <button className="text-emerald-600">
                                Forgot password?
                            </button>
                        </div>
                        */}

                        <button
                            type="submit"
                            disabled={!canSubmit || loading}
                            className="
                                w-full py-4 rounded-xl font-semibold
                                bg-emerald-600 text-white
                                hover:bg-emerald-700
                                active:scale-[0.98]
                                shadow-lg shadow-emerald-200
                                transition-all
                                disabled:opacity-50
                                disabled:shadow-none
                            "
                        >
                            {loading ? "Signing in…" : "Sign in"}
                        </button>

                        {/* FOOTER */}
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
