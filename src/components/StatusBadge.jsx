import { STATUS_CONFIG } from "../utils/status";

/**
 * StatusBadge
 *
 * - Uses centralized STATUS_CONFIG (no hardcoding)
 * - Mobile friendly
 * - Graceful fallback for unknown statuses
 * - Future-ready for icons / animations
 */
export default function StatusBadge({ status, className = "" }) {
    const config = STATUS_CONFIG?.[status];

    if (!config) {
        // Safe fallback (won’t break UI if backend adds new status)
        return (
            <span
                className="
                    inline-flex items-center
                    rounded-full px-3 py-1
                    text-xs font-medium
                    bg-slate-100 text-slate-600
                "
            >
                {status || "Unknown"}
            </span>
        );
    }

    return (
        <span
            className={`
                inline-flex items-center gap-1.5
                rounded-full px-3 py-1
                text-xs font-medium
                whitespace-nowrap
                transition-colors
                ${config.className}
                ${className}
            `}
        >
            {/* OPTIONAL ICON PLACEHOLDER */}
            {config.icon && (
                <span className="text-[10px] leading-none">
                    {config.icon}
                </span>
            )}

            {config.label}
        </span>
    );
}
