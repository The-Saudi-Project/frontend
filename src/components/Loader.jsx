export default function Loader({ label = "Loading" }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
            {/* Spinner */}
            <div className="relative w-12 h-12 mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
                <div className="absolute inset-0 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
            </div>

            {/* Text */}
            <p className="text-sm font-medium tracking-wide">
                {label}…
            </p>

            {/* Optional subtle tagline */}
            <p className="text-xs text-slate-400 mt-1">
                Please wait a moment
            </p>
        </div>
    );
}
