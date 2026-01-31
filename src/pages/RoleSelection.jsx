import { useNavigate } from "react-router-dom";
import { Card, Button } from "../components/Ui.jsx";

export default function RoleSelection() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center px-4">
            <Card className="w-full max-w-md p-10 sm:p-12 text-center">

                {/* BRAND MARK */}
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 mx-auto mb-8 flex items-center justify-center shadow-lg shadow-emerald-200">
                    <span className="text-white text-2xl font-bold tracking-tight">
                        S
                    </span>
                </div>

                {/* HEADING */}
                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                    Saudi Services
                </h1>
                <p className="text-slate-500 mt-2 mb-10 text-sm sm:text-base">
                    Premium home services, curated with care
                </p>

                {/* PRIMARY ACTIONS */}
                <div className="space-y-4">
                    <Button
                        className="w-full py-4 text-base"
                        onClick={() => navigate("/login/customer")}
                    >
                        Continue as Customer
                    </Button>

                    <Button
                        variant="secondary"
                        className="w-full py-4 text-base"
                        onClick={() => navigate("/login/provider")}
                    >
                        Continue as Service Provider
                    </Button>
                </div>

                {/* ADMIN (DE-EMPHASIZED) */}
                <div className="mt-6">
                    <Button
                        variant="ghost"
                        className="w-full text-sm"
                        onClick={() => navigate("/login/admin")}
                    >
                        Administrator Access
                    </Button>
                </div>

                {/* SIGNUP */}
                <div className="mt-10 pt-6 border-t border-slate-100">
                    <p className="text-sm text-slate-500">
                        New to Saudi Services?{" "}
                        <button
                            onClick={() => navigate("/signup")}
                            className="text-emerald-600 font-semibold hover:underline"
                        >
                            Create an account
                        </button>
                    </p>
                </div>

                {/* FUTURE PLACEHOLDER */}
                {/*
                <div className="mt-6 text-xs text-slate-400">
                    Language selection • Region • Accessibility
                </div>
                */}
            </Card>
        </div>
    );
}
