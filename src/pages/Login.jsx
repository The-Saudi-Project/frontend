import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";

export default function Login({
    onLogin,
    error,
    expectedRole,
    title,
    subtitle,
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [localError, setLocalError] = useState("");
    const [loading, setLoading] = useState(false);

    const isValidEmail = (email) =>
        /^\S+@\S+\.\S+$/.test(email);

    const canSubmit = isValidEmail(email) && password.length > 0;

    const handleSubmit = async () => {
        setLocalError("");

        if (!canSubmit) {
            setLocalError("Please enter a valid email and password.");
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
            setLocalError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <Card>
                <div className="w-80">
                    <h2 className="text-2xl font-semibold mb-2">{title}</h2>
                    <p className="text-sm text-gray-500 mb-6">{subtitle}</p>

                    {(error || localError) && (
                        <p className="text-sm text-red-600 mb-4">
                            {error || localError}
                        </p>
                    )}

                    <input
                        className="w-full mb-3 rounded-lg border px-3 py-2 text-sm"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        className="w-full mb-4 rounded-lg border px-3 py-2 text-sm"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        onClick={handleSubmit}
                        disabled={!canSubmit || loading}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
