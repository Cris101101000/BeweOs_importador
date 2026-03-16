import { Skeleton } from "@beweco/aurora-ui";
import type React from "react";

export type ViewSkeletonVariant =
	| "split"
	| "card"
	| "list"
	| "grid"
	| "form"
	| "table";

export interface ViewSkeletonProps {
	variant?: ViewSkeletonVariant;
	className?: string;
	/**
	 * Height for simple card/form variants.
	 * For complex variants like split, it might affect the main container or be ignored.
	 * Default: 400px
	 */
	height?: string | number;
}

export const ViewSkeleton: React.FC<ViewSkeletonProps> = ({
	variant = "card",
	className = "",
	height = "400px",
}) => {
	// Helper for dynamic height style
	const style =
		typeof height === "number" ? { height: `${height}px` } : { height };

	// Variant: Split (Profile/Settings style: Left Main, Right Side widgets)
	if (variant === "split") {
		return (
			<div
				className={`w-full grid grid-cols-1 lg:grid-cols-2 gap-4 ${className}`}
			>
				{/* Left Column */}
				<div className="flex flex-col gap-4">
					{/* User Info Card */}
					<div className="w-full bg-content1 p-6 rounded-xl flex flex-col gap-4">
						<Skeleton className="w-1/3 h-6 rounded mb-2" /> {/* Title */}
						<Skeleton className="w-2/3 h-4 rounded mb-4" /> {/* Subtitle */}
						{/* Profile Header (Avatar + Info) */}
						<div className="flex items-center gap-4 bg-default-100 p-4 rounded-lg mb-4">
							<Skeleton className="w-16 h-16 rounded-full" />
							<div className="flex flex-col gap-2 flex-1">
								<Skeleton className="w-1/2 h-4 rounded" />
								<Skeleton className="w-1/3 h-3 rounded" />
								<Skeleton className="w-2/3 h-3 rounded" />
							</div>
						</div>
						{/* Inputs */}
						<Skeleton className="w-1/4 h-4 rounded mb-1" /> {/* Label */}
						<Skeleton className="w-full h-10 rounded mb-4" /> {/* Input */}
						<Skeleton className="w-1/4 h-4 rounded mb-1" /> {/* Label */}
						<div className="flex gap-2">
							<Skeleton className="w-24 h-10 rounded" /> {/* Phone Code */}
							<Skeleton className="flex-1 h-10 rounded" /> {/* Phone Number */}
						</div>
						<Skeleton className="w-32 h-10 rounded mt-4" /> {/* Button */}
					</div>

					{/* Appearance Card */}
					<div className="w-full bg-content1 p-6 rounded-xl flex flex-col gap-4">
						<Skeleton className="w-1/3 h-6 rounded mb-2" />
						<Skeleton className="w-2/3 h-4 rounded mb-4" />
						<div className="grid grid-cols-2 gap-4">
							<Skeleton className="w-full h-48 rounded-lg" />
							<Skeleton className="w-full h-48 rounded-lg" />
						</div>
					</div>
				</div>

				{/* Right Column */}
				<div className="flex flex-col gap-4">
					{/* Modules Card */}
					<div className="w-full bg-content1 p-6 rounded-xl flex flex-col gap-4">
						<Skeleton className="w-1/3 h-6 rounded mb-2" />
						<Skeleton className="w-2/3 h-4 rounded mb-4" />
						<div className="flex flex-wrap gap-2">
							{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
								<Skeleton key={i} className="w-32 h-8 rounded-full" />
							))}
						</div>
					</div>

					{/* Language Card */}
					<div className="w-full bg-content1 p-6 rounded-xl flex flex-col gap-4">
						<Skeleton className="w-1/3 h-6 rounded mb-2" />
						<Skeleton className="w-2/3 h-4 rounded mb-4" />
						<Skeleton className="w-1/4 h-4 rounded mb-1" />
						<Skeleton className="w-full h-10 rounded mb-4" />
						<Skeleton className="w-32 h-10 rounded" />
					</div>

					{/* Reset Password Card */}
					<div className="w-full bg-content1 p-6 rounded-xl flex flex-col gap-4">
						<Skeleton className="w-1/3 h-6 rounded mb-2" />
						<Skeleton className="w-2/3 h-4 rounded mb-4" />
						<Skeleton className="w-48 h-10 rounded" />
					</div>
				</div>
			</div>
		);
	}

	// Variant: List (Vertical stack of items)
	if (variant === "list") {
		return (
			<div className={`w-full flex flex-col gap-4 ${className}`}>
				{[1, 2, 3, 4, 5].map((i) => (
					<Skeleton key={i} className="rounded-xl h-16 w-full" />
				))}
			</div>
		);
	}

	// Variant: Grid (Grid of cards)
	if (variant === "grid") {
		return (
			<div
				className={`w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ${className}`}
			>
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<Skeleton key={i} className="rounded-xl h-40 w-full" />
				))}
			</div>
		);
	}

	// Variant: Form (Header + Inputs)
	if (variant === "form") {
		return (
			<div className={`w-full flex flex-col gap-6 ${className}`}>
				<Skeleton className="rounded-xl h-12 w-1/3" />
				<div className="space-y-4">
					<Skeleton className="rounded-lg h-10 w-full" />
					<Skeleton className="rounded-lg h-10 w-full" />
					<div className="grid grid-cols-2 gap-4">
						<Skeleton className="rounded-lg h-10 w-full" />
						<Skeleton className="rounded-lg h-10 w-full" />
					</div>
					<Skeleton className="rounded-lg h-24 w-full" />
				</div>
			</div>
		);
	}

	// Variant: Table (Table style with header and rows)
	if (variant === "table") {
		return (
			<div
				className={`w-full flex flex-col gap-4 bg-content1 p-4 rounded-xl ${className}`}
			>
				{/* Toolbar */}
				<div className="flex justify-between items-center mb-4">
					<Skeleton className="rounded-lg h-10 w-1/3" />
					<div className="flex gap-2">
						<Skeleton className="rounded-lg h-10 w-24" />
						<Skeleton className="rounded-lg h-10 w-24" />
						<Skeleton className="rounded-lg h-10 w-24" />
					</div>
				</div>

				{/* Table Header */}
				<div className="flex gap-4 mb-2 px-4">
					<Skeleton className="rounded h-6 w-6" /> {/* Checkbox */}
					<Skeleton className="rounded h-6 flex-1" />
					<Skeleton className="rounded h-6 flex-1" />
					<Skeleton className="rounded h-6 flex-1" />
					<Skeleton className="rounded h-6 flex-1" />
					<Skeleton className="rounded h-6 w-24" /> {/* Actions */}
				</div>

				{/* Table Rows */}
				<div className="flex flex-col gap-3">
					{[1, 2, 3, 4, 5].map((i) => (
						<div key={i} className="flex items-center gap-4 px-4 py-2">
							<Skeleton className="rounded h-5 w-5" /> {/* Checkbox */}
							<div className="flex items-center gap-3 flex-1">
								<Skeleton className="rounded-full h-8 w-8" /> {/* Avatar */}
								<div className="flex flex-col gap-1 flex-1">
									<Skeleton className="rounded h-4 w-3/4" />
									<Skeleton className="rounded h-3 w-1/2" />
								</div>
							</div>
							<Skeleton className="rounded h-4 flex-1" />
							<Skeleton className="rounded h-4 flex-1" />
							<Skeleton className="rounded h-4 flex-1" />
							<div className="flex gap-2 w-24 justify-end">
								<Skeleton className="rounded h-6 w-6" />
								<Skeleton className="rounded h-6 w-6" />
								<Skeleton className="rounded h-6 w-6" />
							</div>
						</div>
					))}
				</div>

				{/* Pagination */}
				<div className="flex justify-center mt-4">
					<Skeleton className="rounded-lg h-8 w-48" />
				</div>
			</div>
		);
	}

	// Default: Card (Single block)
	return (
		<div className={`w-full ${className}`}>
			<Skeleton className="rounded-xl w-full" style={style} />
		</div>
	);
};
