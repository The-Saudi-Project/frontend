export default function Input({ label, ...props }) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
                {label}
            </label>
            <input
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                {...props}
            />
        </div>
    );
}
