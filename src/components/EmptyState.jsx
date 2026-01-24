export default function EmptyState({ title, description }) {
    return (
        <div className="text-center py-12 text-gray-500">
            <p className="font-medium mb-1">{title}</p>
            <p className="text-sm">{description}</p>
        </div>
    );
}
