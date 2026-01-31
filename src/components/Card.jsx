export default function Card({ children, className = "", hover = false }) {
    return (
        <div
            className={`
        bg-white rounded-2xl border border-slate-100
        p-5 sm:p-6
        shadow-sm
        ${hover ? "transition-all hover:shadow-lg hover:shadow-slate-200/50" : ""}
        ${className}
      `}
        >
            {children}
        </div>
    );
}
