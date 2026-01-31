import { NavLink } from "react-router-dom";

const navItems = [
    { to: "/admin", label: "Services" },
    { to: "/admin/bookings", label: "Bookings" },
    // 🔒 Future placeholders
    // { to: "/admin/providers", label: "Providers" },
    // { to: "/admin/reviews", label: "Reviews" },
    // { to: "/admin/analytics", label: "Analytics" },
];

export default function AdminNav() {
    return (
        <nav className="w-full mb-8">
            {/* Desktop / Tablet */}
            <div className="hidden sm:flex gap-2 bg-white border border-slate-100 rounded-2xl p-2 shadow-sm">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end
                        className={({ isActive }) =>
                            `
              px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${isActive
                                ? "bg-emerald-600 text-white shadow-sm"
                                : "text-slate-600 hover:bg-slate-50"
                            }
            `
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </div>

            {/* Mobile */}
            <div className="sm:hidden flex overflow-x-auto gap-2 pb-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end
                        className={({ isActive }) =>
                            `
              whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all
              ${isActive
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-100 text-slate-600"
                            }
            `
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
