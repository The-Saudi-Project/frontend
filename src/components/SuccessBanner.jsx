/**
 * SuccessBanner
 *
 * - Elegant, non-intrusive success feedback
 * - Mobile friendly
 * - Supports future icons / actions
 * - Safe to reuse across app (booking, auth, admin)
 */
export default function SuccessBanner({ message, className = "" }) {
    if (!message) return null;

    return (
        <div
            className={`
                mb-4
                flex items-start gap-3
                rounded-xl
                bg-emerald-50
                border border-emerald-100
                px-4 py-3
                text-sm text-emerald-700
                animate-in fade-in slide-in-from-top-1 duration-300
                ${className}
            `}
        >
            {/* Icon (placeholder for future) */}
            <span className="mt-0.5 text-emerald-600">
                ✓
            </span>

            <div className="flex-1 leading-relaxed">
                {message}
            </div>
        </div>
    );
}
