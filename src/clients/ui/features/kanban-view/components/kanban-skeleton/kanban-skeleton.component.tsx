import { Card, CardBody, CardHeader, Skeleton } from "@beweco/aurora-ui";
import type { FC } from "react";

/**
 * Generate unique keys for skeleton items
 */
const generateSkeletonKey = (prefix: string, index: number): string => {
	return `${prefix}-${Date.now()}-${index}`;
};

/**
 * KanbanCardSkeleton Component
 *
 * Skeleton representation of a single client card in the Kanban view
 */
const KanbanCardSkeleton: FC = () => {
	return (
		<Card shadow="sm" radius="lg" className="w-full px-4 py-3">
			<CardHeader className="p-0 mb-3">
				<div className="flex items-center justify-between w-full gap-3 min-w-0">
					<div className="flex items-center gap-3 max-w-52">
						<Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />

						<div className="flex flex-col justify-start flex-1 min-w-0 overflow-hidden gap-1">
							<Skeleton className="h-4 w-32 rounded" />
							<Skeleton className="h-3 w-24 rounded" />
						</div>
					</div>

					<Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
				</div>
			</CardHeader>

			<CardBody className="p-0">
				<div className="flex flex-wrap gap-1 mb-2">
					<Skeleton className="h-6 w-16 rounded-lg" />
					<Skeleton className="h-6 w-12 rounded-lg" />
				</div>

				<div className="flex flex-col text-xs gap-1">
					<div className="flex items-center gap-2 min-w-0">
						<Skeleton className="h-4 flex-1 rounded" />
						<Skeleton className="w-4 h-4 rounded" />
					</div>
					<div className="flex items-center gap-2 min-w-0">
						<Skeleton className="h-4 flex-1 rounded" />
						<Skeleton className="w-4 h-4 rounded" />
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

/**
 * KanbanColumnSkeleton Component
 *
 * Skeleton representation of a single column in the Kanban view
 */
interface KanbanColumnSkeletonProps {
	cardsCount?: number;
}

const KanbanColumnSkeleton: FC<KanbanColumnSkeletonProps> = ({
	cardsCount = 3,
}) => {
	return (
		<div className="bg-default-50 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
			<div className="p-3 border-b bg-default-100 border-gray-200">
				<div className="flex items-center justify-between">
					<Skeleton className="h-5 w-24 rounded" />
					<div className="flex items-center gap-2">
						<Skeleton className="h-6 w-8 rounded-full" />
					</div>
				</div>
			</div>

			<div className="p-4 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
				{Array.from({ length: cardsCount }).map((_, index) => (
					<KanbanCardSkeleton key={generateSkeletonKey("card", index)} />
				))}
			</div>
		</div>
	);
};

/**
 * KanbanViewSkeleton Component
 *
 * Complete skeleton for the Kanban view with multiple columns
 */
interface KanbanViewSkeletonProps {
	columnsCount?: number;
	cardsPerColumn?: number;
}

export const KanbanViewSkeleton: FC<KanbanViewSkeletonProps> = ({
	columnsCount = 4,
	cardsPerColumn = 3,
}) => {
	return (
		<div
			className="grid gap-6 h-full pb-4 overflow-x-auto min-w-fit"
			style={{
				gridTemplateColumns: `repeat(${columnsCount}, minmax(180px, 1fr))`,
			}}
		>
			{Array.from({ length: columnsCount }).map((_, index) => (
				<KanbanColumnSkeleton
					key={generateSkeletonKey("column", index)}
					cardsCount={cardsPerColumn}
				/>
			))}
		</div>
	);
};

// Export individual components for flexibility
export { KanbanCardSkeleton, KanbanColumnSkeleton };
