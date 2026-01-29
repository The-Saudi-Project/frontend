import { useState } from "react";
import { Card, Button, Input } from "../components/ui";

export default function Login({
    onLogin,
    expectedRole,
    title,
    subtitle,
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const isValidEmail = (email) =>
        /^\S+@\S+\.\S+$/.test(email);

    const canSubmit = isValidEmail(email) && password.length > 0;

    const handleSubmit = async () => {
        setError("");

        if (!canSubmit) {
            setError("Please enter a valid email and password.");
            return;
        }

        try {
            setLoading(true);
            const user = await onLogin(
                email.trim().toLowerCase(),
                password
            );

            if (user.role !== expectedRole) {
                throw new Error(
                    `This account is not a ${expectedRole} account`
                );
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center p-6">
            <Card className="w-full max-w-md p-10">
                {/* Logo / Icon */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-emerald-600 rounded-2xl mx-auto mb-5 flex items-center justify-center shadow-lg shadow-emerald-200">
                        <span className="text-white text-2xl font-bold">S</span>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        {title}
                    </h1>
                    <p className="text-slate-500 mt-2">
                        {subtitle}
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
                        {error}
                    </div>
                )}

                {/* Form */}
                <div className="space-y-5">
                    <Input
                        label="Email address"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        className="w-full py-4"
                        disabled={!canSubmit || loading}
                        onClick={handleSubmit}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
