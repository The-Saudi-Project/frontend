export default function Button({
    children,
    variant = "primary",
    className = "",
    disabled = false,
    ...props
}) {
    const base =
        "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary:
            "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] focus:ring-emerald-500/30",

        secondary:
            "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:scale-[0.98] focus:ring-slate-300",

        ghost:
            "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-200",

        danger:
            "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/30",
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
