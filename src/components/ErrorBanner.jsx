export default function ErrorBanner({
    message,
    variant = "error",
    action,
}) {
    if (!message) return null;

    const styles = {
        error:
            "bg-red-50 border-red-100 text-red-700",
        warning:
            "bg-amber-50 border-amber-100 text-amber-700",
        info:
            "bg-blue-50 border-blue-100 text-blue-700",
    };

    return (
        <div
            className={`
        mb-4 w-full rounded-xl border px-4 py-3
        flex items-start gap-3
        ${styles[variant]}
      `}
        >
            {/* Icon */}
            <span className="mt-0.5 text-lg leading-none">
                {variant === "error" && "⚠️"}
                {variant === "warning" && "⚠️"}
                {variant === "info" && "ℹ️"}
            </span>

            {/* Message */}
            <div className="flex-1">
                <p className="text-sm font-medium">
                    {message}
                </p>

                {/* Optional Action (future use) */}
                {action && (
                    <div className="mt-2">
                        {action}
                    </div>
                )}
            </div>
        </div>
    );
}
