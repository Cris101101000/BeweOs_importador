import type { FC } from "react";
import { SkeletonCell } from "../../skeleton-cell/skeleton-cell.component";

interface ClientsTableSkeletonProps {
	rowCount?: number;
}

const SKELETON_COLUMNS = [
	"contact",
	"email",
	"phone",
	"status",
	"category",
	"createdAt",
	"actions",
];

/**
 * Skeleton loading state for the clients table
 * Displays placeholder rows while data is being fetched
 */
export const ClientsTableSkeleton: FC<ClientsTableSkeletonProps> = ({
	rowCount = 10,
}) => {
	const rows = Array.from({ length: rowCount }, (_, i) => i);

	return (
		<div className="w-full">
			{rows.map((rowIndex) => (
				<div
					key={`skeleton-row-${rowIndex}`}
					className="flex items-center gap-4 py-3 px-4 border-b border-default-100"
				>
					{SKELETON_COLUMNS.map((columnKey) => (
						<div
							key={`skeleton-cell-${rowIndex}-${columnKey}`}
							className="flex-1"
						>
							<SkeletonCell columnKey={columnKey} />
						</div>
					))}
				</div>
			))}
		</div>
	);
};
