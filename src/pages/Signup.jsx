import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/client";

export default function Signup({ onSignup }) {
    const navigate = useNavigate();

    /* ---------- Form state ---------- */
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("customer");

    /* ---------- Provider services ---------- */
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);

    /* ---------- UI state ---------- */
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* ---------- Helpers ---------- */
    const isStrongPassword = (pwd) =>
        pwd.length >= 8 && /[a-zA-Z]/.test(pwd) && /\d/.test(pwd);

    const toggleService = (serviceId) => {
        setSelectedServices((prev) =>
            prev.includes(serviceId)
                ? prev.filter((id) => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    /* ---------- Load admin-created services ---------- */
    useEffect(() => {
        apiRequest("/services/public")
            .then(setServices)
            .catch(() => setError("Failed to load services"));
    }, []);

    /* ---------- Submit ---------- */
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
        <div className="min-h-screen bg-[#FDFCF9] flex flex-col lg:flex-row text-slate-900">
            {/* LEFT BRAND PANEL */}
            <div className="hidden lg:flex lg:w-1/2 bg-emerald-900 p-16 flex-col justify-between relative overflow-hidden">
                <div>
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-8">
                        <span className="text-white font-bold text-2xl">S</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white leading-tight max-w-md">
                        The standard for home services in the Kingdom.
                    </h1>
                    <p className="text-emerald-100/80 mt-6 text-lg max-w-sm">
                        Join thousands of households and professionals on Saudi
                        Arabia’s most trusted service marketplace.
                    </p>
                </div>

                <p className="text-emerald-200/60 text-sm">
                    © 2026 Saudi Services Marketplace
                </p>
            </div>

            {/* RIGHT FORM PANEL */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold">Create an account</h2>
                    <p className="text-slate-500 mt-2 mb-8">
                        Enter your details to get started
                    </p>

                    {error && (
                        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* ROLE SWITCH */}
                        <div className="flex p-1 bg-slate-100 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setRole("customer")}
                                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg ${role === "customer"
                                        ? "bg-white text-emerald-700 shadow"
                                        : "text-slate-500"
                                    }`}
                            >
                                Customer
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("provider")}
                                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg ${role === "provider"
                                        ? "bg-white text-emerald-700 shadow"
                                        : "text-slate-500"
                                    }`}
                            >
                                Provider
                            </button>
                        </div>

                        {/* INPUTS */}
                        <input
                            className="w-full px-4 py-3 rounded-xl border"
                            placeholder="Full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            className="w-full px-4 py-3 rounded-xl border"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="password"
                                className="w-full px-4 py-3 rounded-xl border"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <input
                                type="password"
                                className="w-full px-4 py-3 rounded-xl border"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                        </div>

                        {/* PROVIDER SERVICES */}
                        {role === "provider" && (
                            <div className="border-t pt-4">
                                <p className="text-sm font-semibold mb-3">
                                    Services you provide
                                </p>

                                <div className="grid grid-cols-2 gap-2">
                                    {services.map((s) => (
                                        <label
                                            key={s._id}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer ${selectedServices.includes(s._id)
                                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                                    : "border-slate-200"
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="accent-emerald-600"
                                                checked={selectedServices.includes(s._id)}
                                                onChange={() => toggleService(s._id)}
                                            />
                                            <span className="text-sm">{s.name}</span>
                                        </label>
                                    ))}
                                </div>

                                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-3 mt-4">
                                    Providers will be reviewed before receiving job requests.
                                </p>
                            </div>
                        )}

                        {/* CTA */}
                        <button
                            disabled={loading}
                            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50"
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </button>

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
                </div>
            </div>
        </div>
    );
}
