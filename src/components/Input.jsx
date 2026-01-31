export default function Input({
    label,
    error,
    hint,
    className = "",
    ...props
}) {
    return (
        <div className="w-full space-y-1.5">
            {/* LABEL */}
            {label && (
                <label className="
          text-xs font-semibold
          uppercase tracking-wider
          text-slate-500
        ">
                    {label}
                </label>
            )}

            {/* INPUT */}
            <input
                className={`
          w-full
          px-4 py-3
          rounded-xl
          bg-slate-50
          border
          text-sm
          text-slate-900
          placeholder:text-slate-400
          transition-all
          focus:outline-none
          focus:ring-2 focus:ring-emerald-500/20
          ${error
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 focus:border-emerald-500"
                    }
          disabled:opacity-50
          disabled:cursor-not-allowed
          ${className}
        `}
                {...props}
            />

            {/* ERROR */}
            {error && (
                <p className="text-xs text-red-600">
                    {error}
                </p>
            )}

            {/* HINT / HELPER */}
            {hint && !error && (
                <p className="text-xs text-slate-400">
                    {hint}
                </p>
            )}
        </div>
    );
}
