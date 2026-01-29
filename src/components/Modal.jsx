export default function Modal({ title, children, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white w-full max-w-lg max-h-[85vh] rounded-2xl shadow-xl flex flex-col overflow-hidden">

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-slate-900">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-700 text-xl leading-none"
                    >
                        ×
                    </button>
                </div>

                {/* BODY (SCROLLABLE) */}
                <div className="px-6 py-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
