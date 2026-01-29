import React from "react";

/* ---------------- BUTTON ---------------- */

export const Button = ({
    variant = "primary",
    children,
    className = "",
    ...props
}) => {
    const baseStyles =
        "px-6 py-3 rounded-xl font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";

    const variants = {
        primary:
            "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-100",
        secondary:
            "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
        ghost:
            "bg-transparent text-slate-500 hover:text-emerald-600 hover:bg-emerald-50",
        danger:
            "bg-rose-50 text-rose-600 hover:bg-rose-100",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

/* ---------------- CARD ---------------- */

export const Card = ({ children, className = "" }) => (
    <div
        className={`bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
    >
        {children}
    </div>
);

/* ---------------- BADGE ---------------- */

export const Badge = ({ status }) => {
    const styles = {
        Booked: "bg-blue-50 text-blue-600",
        Assigned: "bg-amber-50 text-amber-600",
        Completed: "bg-emerald-50 text-emerald-600",
        Pending: "bg-slate-100 text-slate-600",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${styles[status] || styles.Pending
                }`}
        >
            {status}
        </span>
    );
};

/* ---------------- INPUT ---------------- */

export const Input = ({ label, ...props }) => (
    <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-medium text-slate-700 ml-1">
            {label}
        </label>
        <input
            className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50/50"
            {...props}
        />
    </div>
);
