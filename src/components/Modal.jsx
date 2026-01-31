export default function Modal({ title, children, onClose, footer }) {
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm px-0 sm:px-4">
            {/* PANEL */}
            <div
                className="
                    w-full sm:max-w-lg
                    bg-white
                    rounded-t-2xl sm:rounded-2xl
                    shadow-2xl
                    flex flex-col
                    max-h-[90vh]
                    animate-in slide-in-from-bottom sm:fade-in
                "
            >
                {/* HEADER */}
                <div className="flex items-center justify-between px-5 py-4 border-b bg-white sticky top-0 z-10">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                        {title}
                    </h3>

                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        className="
                            w-9 h-9
                            flex items-center justify-center
                            rounded-full
                            text-slate-400
                            hover:text-slate-700
                            hover:bg-slate-100
                            transition
                        "
                    >
                        ✕
                    </button>
                </div>

                {/* BODY */}
                <div className="flex-1 overflow-y-auto px-5 py-6 bg-slate-50/30">
                    {children}
                </div>

                {/* FOOTER (optional) */}
                {footer && (
                    <div className="px-5 py-4 border-t bg-white flex gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
