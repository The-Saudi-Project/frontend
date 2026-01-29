import { useNavigate } from "react-router-dom";
import { Button, Card } from "../components/Ui";

export default function RoleSelect() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center p-6">
            <Card className="max-w-md w-full p-10 text-center">
                <div className="mb-8">
                    <div className="w-16 h-16 bg-emerald-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-emerald-200">
                        <span className="text-white text-2xl font-bold">S</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Welcome to Saudi Services
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Premium home services at your doorstep
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <Button onClick={() => navigate("/login/customer")}>
                        Login as Customer
                    </Button>
                    <Button variant="secondary" onClick={() => navigate("/login/provider")}>
                        Login as Provider
                    </Button>
                    <Button variant="ghost" onClick={() => navigate("/login/admin")}>
                        Admin Login
                    </Button>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                    <p className="text-sm text-slate-500">
                        New to the platform?{" "}
                        <button
                            className="text-emerald-600 font-semibold hover:underline"
                            onClick={() => navigate("/signup")}
                        >
                            Create an account
                        </button>
                    </p>
                </div>
            </Card>
        </div>
    );
}
