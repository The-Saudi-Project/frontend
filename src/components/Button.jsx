export default function Button({ children, variant = "primary", ...props }) {
    const base =
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition";

    const styles = {
        primary: "bg-black text-white hover:bg-gray-800",
        secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    };

    return (
        <button className={`${base} ${styles[variant]}`} {...props}>
            {children}
        </button>
    );
}
