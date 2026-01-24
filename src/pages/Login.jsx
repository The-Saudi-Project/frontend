import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin, error, onSwitch }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    console.log(import.meta.env.VITE_API_URL);


    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <Card>
                <div className="w-80">
                    <h2 className="text-2xl font-semibold mb-2">Welcome back</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Sign in to manage your services
                    </p>

                    {error && (
                        <p className="text-sm text-red-600 mb-4">{error}</p>
                    )}

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

                    <Button onClick={() => onLogin(email, password)}>
                        Sign in
                    </Button>
                    <p className="text-sm text-gray-500 mt-4 text-center">
                        Don’t have an account?{" "}
                        <button
                            className="text-black underline"
                            onClick={() => navigate("/signup")}
                        >
                            Sign up
                        </button>

                    </p>

                </div>
            </Card>
        </div>
    );
}
