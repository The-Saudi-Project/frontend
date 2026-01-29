import { useNavigate } from "react-router-dom";
import { Card, Button } from "../components/Ui.jsx";

export default function RoleSelection() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center p-6">
            <Card className="w-full max-w-md p-10 text-center">
                {/* Logo */}
                <div className="w-16 h-16 bg-emerald-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-emerald-200">
                    <span className="text-white text-2xl font-bold">S</span>
                </div>

                {/* Heading */}
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Welcome to Saudi Services
                </h1>
                <p className="text-slate-500 mt-2 mb-8">
                    Premium home services at your doorstep
                </p>

                {/* Role Buttons */}
                <div className="space-y-4">
                    <Button
                        className="w-full py-4"
                        onClick={() => navigate("/login/customer")}
                    >
                        Login as Customer
                    </Button>

                    <Button
                        variant="secondary"
                        className="w-full py-4"
                        onClick={() => navigate("/login/provider")}
                    >
                        Login as Provider
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full text-sm"
                        onClick={() => navigate("/login/admin")}
                    >
                        Admin Login
                    </Button>
                </div>

                {/* Signup */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                    <p className="text-sm text-slate-500">
                        New here?{" "}
                        <button
                            onClick={() => navigate("/signup")}
                            className="text-emerald-600 font-semibold hover:underline"
                        >
                            Create an account
                        </button>
                    </p>
                </div>
            </Card>
        </div>
    );
}
