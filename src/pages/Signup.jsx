import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";

export default function Signup({ onSignup, error, onSwitch }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer");
    const [localError, setLocalError] = useState("");
    const navigate = useNavigate();


    const isValidEmail = (email) =>
        /^\S+@\S+\.\S+$/.test(email);

    const isValidPassword = (password) =>
        password.length >= 8 &&
        /[A-Za-z]/.test(password) &&
        /\d/.test(password);

    const canSubmit =
        firstName.trim().length >= 2 &&
        lastName.trim().length >= 2 &&
        isValidEmail(email) &&
        isValidPassword(password);

    const handleSubmit = () => {
        setLocalError("");

        if (!canSubmit) {
            setLocalError(
                "Please fill all fields correctly before continuing."
            );
            return;
        }

        onSignup({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            password,
            role,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <Card>
                <div className="w-96">
                    <h2 className="text-2xl font-semibold mb-2">
                        Create account
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Join Saudi Services
                    </p>

                    {(error || localError) && (
                        <p className="text-sm text-red-600 mb-4">
                            {error || localError}
                        </p>
                    )}

                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <input
                            className="rounded-lg border px-3 py-2 text-sm"
                            placeholder="First name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <input
                            className="rounded-lg border px-3 py-2 text-sm"
                            placeholder="Last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <input
                        className="w-full mb-3 rounded-lg border px-3 py-2 text-sm"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        className="w-full mb-2 rounded-lg border px-3 py-2 text-sm"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <p className="text-xs text-gray-500 mb-4">
                        Password must be at least 8 characters and include a
                        letter and a number.
                    </p>

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
                        onClick={handleSubmit}
                        disabled={!canSubmit}
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
                    </p>s
                </div>
            </Card>
        </div>
    );
}
