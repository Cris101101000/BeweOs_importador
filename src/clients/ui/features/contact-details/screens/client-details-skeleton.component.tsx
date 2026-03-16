/**
 * ClientDetailsSkeleton
 *
 * Loading skeleton for the contact details screen.
 */

import { Skeleton } from "@beweco/aurora-ui";

export const ClientDetailsSkeleton = () => {
	return (
		<div className="flex flex-col gap-6 p-4">
			{/* Client info card skeleton */}
			<div className="rounded-lg border border-default-200 p-6">
				<div className="flex items-start gap-4">
					<Skeleton className="h-16 w-16 rounded-full" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-4 w-64" />
					</div>
				</div>
			</div>

			{/* Content grid skeleton */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-4">
					<Skeleton className="h-8 w-32" />
					<div className="space-y-3">
						<Skeleton className="h-24 w-full rounded-lg" />
						<Skeleton className="h-24 w-full rounded-lg" />
						<Skeleton className="h-24 w-full rounded-lg" />
					</div>
				</div>

				<div className="lg:col-span-1 space-y-4">
					<Skeleton className="h-8 w-24" />
					<div className="space-y-2">
						<Skeleton className="h-8 w-full rounded-lg" />
						<Skeleton className="h-8 w-full rounded-lg" />
						<Skeleton className="h-8 w-3/4 rounded-lg" />
					</div>
				</div>
			</div>
		</div>
	);
};
