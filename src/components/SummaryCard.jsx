
export default function SummaryCard({
    label,
    value,
    hint,
    icon,
    className = "",
}) {
    return (
        <div
            className={`
                rounded-2xl
                border border-slate-100
                bg-white
                p-5
                shadow-sm
                transition
                hover:shadow-md
                hover:border-slate-200
                ${className}
            `}
        >
            {/* Top row */}
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    {label}
                </p>

                {/* Optional icon placeholder */}
                {icon && (
                    <div className="text-slate-300">
                        {icon}
                    </div>
                )}
            </div>

            {/* Main value */}
            <p className="mt-2 text-2xl md:text-3xl font-bold text-slate-900">
                {value}
            </p>

            {/* Optional hint / delta */}
            {hint && (
                <p className="mt-1 text-xs text-slate-500">
                    {hint}
                </p>
            )}
        </div>
    );
}
