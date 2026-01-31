import React from "react";

/* =========================================================
   BUTTON
========================================================= */

export const Button = ({
    variant = "primary",
    children,
    className = "",
    disabled = false,
    ...props
}) => {
    const baseStyles = `
        inline-flex items-center justify-center gap-2
        px-6 py-3
        rounded-xl
        text-sm font-semibold
        transition-all duration-200
        active:scale-[0.98]
        disabled:opacity-50
        disabled:cursor-not-allowed
    `;

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
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

/* =========================================================
   CARD
========================================================= */

export const Card = ({ children, className = "" }) => (
    <div
        className={`
            bg-white
            border border-slate-100
            rounded-2xl
            shadow-sm
            transition
            hover:shadow-md
            hover:border-slate-200
            ${className}
        `}
    >
        {children}
    </div>
);

/* =========================================================
   BADGE (Booking Status)
========================================================= */

/* ---------------- BADGE ---------------- */

export const Badge = ({ status }) => {
    const config = {
        CREATED: {
            label: "Requested",
            className: "bg-slate-100 text-slate-600",
        },
        ASSIGNED: {
            label: "Assigned",
            className:
                "bg-amber-50 text-amber-700 border border-amber-100",
        },
        IN_PROGRESS: {
            label: "In Progress",
            className:
                "bg-blue-50 text-blue-700 border border-blue-100",
        },
        COMPLETED: {
            label: "Completed",
            className:
                "bg-emerald-50 text-emerald-700 border border-emerald-100",
        },
        CANCELLED: {
            label: "Cancelled",
            className:
                "bg-rose-50 text-rose-700 border border-rose-100",
        },
    };

    const item = config[status] || config.CREATED;

    return (
        <span
            className={`
                inline-flex items-center
                px-3 py-1
                rounded-full
                text-xs font-semibold
                uppercase tracking-wide
                ${item.className}
            `}
        >
            {item.label}
        </span>
    );
};

/* =========================================================
   INPUT
========================================================= */

export const Input = ({
    label,
    error,
    className = "",
    ...props
}) => (
    <div className="flex flex-col gap-1.5 w-full">
        {label && (
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
                {label}
            </label>
        )}

        <input
            className={`
                px-4 py-3
                rounded-xl
                border
                bg-slate-50/50
                text-sm
                transition-all
                focus:outline-none
                focus:ring-2 focus:ring-emerald-500/20
                focus:border-emerald-500
                ${error ? "border-rose-500" : "border-slate-200"}
                ${className}
            `}
            {...props}
        />

        {error && (
            <p className="text-xs text-rose-600 ml-1">
                {error}
            </p>
        )}
    </div>
);
