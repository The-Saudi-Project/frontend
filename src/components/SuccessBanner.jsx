export default function SuccessBanner({ message }) {
    if (!message) return null;

    return (
        <div className="mb-4 rounded-lg bg-green-50 text-green-700 px-4 py-2 text-sm">
            {message}
        </div>
    );
}
