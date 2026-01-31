export default function Header({
    role = "customer",
    onLogout,
}) {
    return (
        <header className="
      sticky top-0 z-40
      bg-white/80 backdrop-blur-md
      border-b border-slate-100
    ">
            <div className="
        max-w-7xl mx-auto
        px-4 sm:px-6
        h-16
        flex items-center justify-between
      ">
                {/* LEFT — Brand */}
                <div className="flex items-center gap-3">
                    <div className="
            w-9 h-9 rounded-xl
            bg-emerald-600
            flex items-center justify-center
            text-white font-bold text-sm
          ">
                        S
                    </div>

                    <div className="leading-tight">
                        <h1 className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight">
                            Saudi Services
                        </h1>
                        <p className="text-[10px] sm:text-xs text-slate-400 capitalize tracking-widest font-medium">
                            {role} portal
                        </p>
                    </div>
                </div>

                {/* RIGHT — Actions */}
                <div className="flex items-center gap-3">
                    {/* 🔔 Placeholder for notifications */}
                    {/* <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
            🔔
          </button> */}

                    {/* Profile / Logout */}
                    <button
                        onClick={onLogout}
                        className="
              text-xs sm:text-sm font-medium
              text-slate-500 hover:text-slate-900
              transition
            "
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}
