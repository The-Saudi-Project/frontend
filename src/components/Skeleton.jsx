/**
 * Base Skeleton Block
 * Usage:
 * <Skeleton className="h-10 w-full" />
 */
export const Skeleton = ({ className = "" }) => (
    <div
        className={`
            animate-pulse
            rounded-xl
            bg-gradient-to-r
            from-slate-100
            via-slate-200/70
            to-slate-100
            ${className}
        `}
    />
);

/**
 * Skeleton Text Line
 * Usage:
 * <SkeletonText />
 * <SkeletonText width="w-1/2" />
 */
export const SkeletonText = ({
    width = "w-full",
    height = "h-4",
}) => (
    <div
        className={`
            ${height}
            ${width}
            rounded-md
            animate-pulse
            bg-gradient-to-r
            from-slate-100
            via-slate-200/70
            to-slate-100
        `}
    />
);

/**
 * Skeleton Card (OPTIONAL helper)
 * Safe to keep even if unused now
 */
export const SkeletonCard = () => (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 space-y-4">
        <Skeleton className="h-40 w-full rounded-xl" />
        <SkeletonText width="w-3/4" />
        <SkeletonText width="w-full" />
        <SkeletonText width="w-1/2" />
    </div>
);
