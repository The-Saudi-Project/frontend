import { NavLink } from "react-router-dom";

export default function AdminNav() {
    const base =
        "px-4 py-2 rounded-lg text-sm font-medium transition";
    const active =
        "bg-emerald-600 text-white";
    const inactive =
        "text-slate-600 hover:bg-slate-100";

    return (
        <div className="flex gap-3 mb-8">
            <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                    `${base} ${isActive ? active : inactive}`
                }
            >
                Services
            </NavLink>

            <NavLink
                to="/admin/bookings"
                className={({ isActive }) =>
                    `${base} ${isActive ? active : inactive}`
                }
            >
                Bookings
            </NavLink>
        </div>
    );
}
