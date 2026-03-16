import type { FC } from "react";

interface SkeletonCellProps {
	columnKey: string;
}

interface SkeletonProps {
	className?: string;
}

/**
 * Simple Skeleton component using Tailwind CSS
 * Provides a consistent loading animation across the application
 */
export const Skeleton: FC<SkeletonProps> = ({ className = "" }) => (
	<div className={`animate-pulse bg-default-200 rounded ${className}`} />
);

/**
 * Skeleton cell component for different column types
 * Used to show loading states in table cells
 */
export const SkeletonCell: FC<SkeletonCellProps> = ({ columnKey }) => {
	switch (columnKey) {
		case "contact":
			return (
				<div className="flex items-center gap-3">
					<Skeleton className="w-8 h-8 rounded-full" />
					<div className="flex flex-col gap-1">
						<Skeleton className="w-32 h-4 rounded" />
						<Skeleton className="w-24 h-3 rounded" />
					</div>
				</div>
			);
		case "email":
			return <Skeleton className="w-40 h-4 rounded" />;
		case "phone":
			return <Skeleton className="w-32 h-4 rounded" />;
		case "status":
			return <Skeleton className="w-20 h-6 rounded-full" />;
		case "category":
			return <Skeleton className="w-24 h-4 rounded" />;
		case "createdAt":
			return (
				<div className="flex items-center gap-1">
					<Skeleton className="w-4 h-4 rounded" />
					<Skeleton className="w-20 h-4 rounded" />
				</div>
			);
		case "actions":
			return (
				<div className="flex items-center justify-end gap-1">
					<Skeleton className="w-8 h-8 rounded" />
					<Skeleton className="w-8 h-8 rounded" />
					<Skeleton className="w-8 h-8 rounded" />
					<Skeleton className="w-8 h-8 rounded" />
				</div>
			);
		default:
			return <Skeleton className="w-20 h-4 rounded" />;
	}
};
