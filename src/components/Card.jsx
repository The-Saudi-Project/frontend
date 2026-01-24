export default function Card({ children }) {
    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            {children}
        </div>
    );
}
