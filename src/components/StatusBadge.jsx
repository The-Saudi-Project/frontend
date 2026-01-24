import { STATUS_CONFIG } from "../utils/status";

export default function StatusBadge({ status }) {
    const config = STATUS_CONFIG[status];

    if (!config) return null;

    return (
        <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${config.className}`}
        >
            {config.label}
        </span>
    );
}
