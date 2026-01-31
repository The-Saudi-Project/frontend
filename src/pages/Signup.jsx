import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/client";
import { Button, Input, Card } from "../components/Ui.jsx";

export default function Signup({ onSignup }) {
    const navigate = useNavigate();

    /* ---------- FORM STATE ---------- */
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("customer");

    /* ---------- PROVIDER SERVICES ---------- */
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);

    /* ---------- UI STATE ---------- */
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* ---------- HELPERS ---------- */
    const isStrongPassword = (pwd) =>
        pwd.length >= 8 && /[a-zA-Z]/.test(pwd) && /\d/.test(pwd);

    const toggleService = (serviceId) => {
        setSelectedServices((prev) =>
            prev.includes(serviceId)
                ? prev.filter((id) => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    /* ---------- LOAD SERVICES ---------- */
    useEffect(() => {
        apiRequest("/services/public")
            .then(setServices)
            .catch(() => setError("Failed to load services"));
    }, []);

    /* ---------- SUBMIT ---------- */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (!isStrongPassword(password)) {
            setError(
                "Password must be at least 8 characters and include a number"
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (role === "provider" && selectedServices.length === 0) {
            setError("Please select at least one service");
            return;
        }

        try {
            setLoading(true);
            await onSignup({
                name,
                email,
                password,
                role,
                services: role === "provider" ? selectedServices : [],
            });
        } catch (e) {
            setError(e.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCF9] flex flex-col lg:flex-row">

            {/* ---------------- LEFT BRAND PANEL ---------------- */}
            <div className="hidden lg:flex lg:w-1/2 bg-emerald-900 p-16 flex-col justify-between">
                <div>
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-8">
                        <span className="text-white font-bold text-2xl">S</span>
                    </div>

                    <h1 className="text-4xl font-bold text-white leading-tight max-w-md">
                        Join the future of home services.
                    </h1>

                    <p className="text-emerald-100/80 mt-6 text-lg max-w-sm">
                        Saudi Arabia’s premium marketplace for trusted
                        professionals and modern households.
                    </p>
                </div>

                <p className="text-emerald-200/60 text-sm">
                    © 2026 Saudi Services Marketplace
                </p>
            </div>

            {/* ---------------- RIGHT FORM PANEL ---------------- */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                <Card className="w-full max-w-md p-8 sm:p-10">

                    {/* HEADER */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-semibold text-slate-900">
                            Create an account
                        </h2>
                        <p className="text-slate-500 mt-2">
                            Get started in less than a minute
                        </p>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div className="mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-4 py-2">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* ROLE SWITCH */}
                        <div className="flex p-1 bg-slate-100 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setRole("customer")}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition
                                    ${role === "customer"
                                        ? "bg-white shadow text-emerald-700"
                                        : "text-slate-500"
                                    }`}
                            >
                                Customer
                            </button>

                            <button
                                type="button"
                                onClick={() => setRole("provider")}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition
                                    ${role === "provider"
                                        ? "bg-white shadow text-emerald-700"
                                        : "text-slate-500"
                                    }`}
                            >
                                Provider
                            </button>
                        </div>

                        {/* INPUTS */}
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                        </div>

                        {/* PROVIDER SERVICES */}
                        {role === "provider" && (
                            <div className="border-t pt-6 space-y-4">
                                <p className="text-sm font-semibold text-slate-700">
                                    Services you provide
                                </p>

                                <div className="grid grid-cols-2 gap-2">
                                    {services.map((s) => (
                                        <label
                                            key={s._id}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer text-sm transition
                                                ${selectedServices.includes(s._id)
                                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                                    : "border-slate-200 hover:bg-slate-50"
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="accent-emerald-600"
                                                checked={selectedServices.includes(s._id)}
                                                onChange={() => toggleService(s._id)}
                                            />
                                            {s.name}
                                        </label>
                                    ))}
                                </div>

                                {/* FUTURE PLACEHOLDER */}
                                {/*
                                <div className="text-xs text-slate-400">
                                    Verification documents • Availability • Pricing
                                </div>
                                */}

                                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-3">
                                    Providers are reviewed before receiving job requests.
                                </p>
                            </div>
                        )}

                        {/* CTA */}
                        <Button
                            className="w-full py-4"
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </Button>

                        {/* FOOTER */}
                        <p className="text-sm text-slate-500 text-center">
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="text-emerald-600 font-semibold hover:underline"
                            >
                                Sign in
                            </button>
                        </p>
                    </form>
                </Card>
            </div>
        </div>
    );
}
