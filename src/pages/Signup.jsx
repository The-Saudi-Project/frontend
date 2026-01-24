import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";

export default function Signup({ onSignup, error, onSwitch }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer");
    const navigate = useNavigate();


    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <Card>
                <div className="w-80">
                    <h2 className="text-2xl font-semibold mb-2">Create account</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Join Saudi Services
                    </p>

                    {error && (
                        <p className="text-sm text-red-600 mb-4">{error}</p>
                    )}

                    <input
                        className="w-full mb-3 rounded-lg border px-3 py-2 text-sm"
                        placeholder="Full name"
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        className="w-full mb-3 rounded-lg border px-3 py-2 text-sm"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        className="w-full mb-4 rounded-lg border px-3 py-2 text-sm"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            I am a
                        </label>
                        <select
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="customer">Customer</option>
                            <option value="provider">Service Provider</option>
                        </select>
                    </div>

                    <Button
                        onClick={() =>
                            onSignup({ name, email, password, role })
                        }
                    >
                        Create account
                    </Button>

                    <p className="text-sm text-gray-500 mt-4 text-center">
                        Already have an account?{" "}
                        <button
                            className="text-black underline"
                            onClick={() => navigate("/login")}
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </Card>
        </div>
    );
}
