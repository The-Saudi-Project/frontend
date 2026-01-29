export const Skeleton = ({ className = "" }) => (
    <div
        className={`animate-pulse bg-slate-200/70 rounded-lg ${className}`}
    />
);

export const SkeletonText = ({ width = "w-full" }) => (
    <div className={`h-4 ${width} animate-pulse bg-slate-200/70 rounded`} />
);
