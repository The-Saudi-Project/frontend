export default function Section({
    title,
    subtitle,
    action,
    children,
}) {
    return (
        <section
            className="
                bg-white
                rounded-2xl
                border border-slate-100
                shadow-sm
                overflow-hidden
            "
        >
            {/* HEADER */}
            {(title || action) && (
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        {title && (
                            <h2 className="text-lg font-semibold text-slate-900">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="text-sm text-slate-500 mt-1">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Optional right-side action (button / link) */}
                    {action && (
                        <div className="shrink-0">
                            {action}
                        </div>
                    )}
                </div>
            )}

            {/* CONTENT */}
            <div className="p-6">
                {children}
            </div>
        </section>
    );
}
