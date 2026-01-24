export default function Header({ role, onLogout }) {
    return (
        <header className="bg-white border-b">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-lg font-semibold">Saudi Services</h1>
                    <p className="text-xs text-gray-500 capitalize">{role} dashboard</p>
                </div>

                <button
                    onClick={onLogout}
                    className="text-sm text-gray-500 hover:text-black"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}
