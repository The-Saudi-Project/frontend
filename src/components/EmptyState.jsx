export default function EmptyState({
    title,
    description,
    icon = "∅",
    action,
}) {
    return (
        <div className="py-16 px-6 flex flex-col items-center text-center">
            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                <span className="text-2xl text-slate-300">{icon}</span>
            </div>

            {/* Text */}
            <p className="text-slate-900 font-medium">
                {title}
            </p>
            {description && (
                <p className="text-sm text-slate-500 mt-1 max-w-sm">
                    {description}
                </p>
            )}

            {/* Optional Action (future-ready) */}
            {action && (
                <div className="mt-6">
                    {action}
                </div>
            )}
        </div>
    );
}
