import type { BreadcrumbItemComponentProps } from "@beweco/aurora-ui";
import { useEffect } from "react";
import { useBreadcrumbs } from "../contexts/breadcrumbs-context/breadcrumbs.context";

/**
 * usePageBreadcrumbs Hook
 *
 * Convenience hook for setting breadcrumbs in page components.
 * Automatically sets breadcrumbs when the component mounts and clears them when unmounting.
 * Relies on React's memoization of breadcrumb arrays to prevent infinite re-renders.
 *
 * Features:
 * - Automatic setup and cleanup of breadcrumbs
 * - Type-safe breadcrumb items
 * - Integration with breadcrumbs context
 * - Optimized to prevent infinite re-renders when breadcrumbs are memoized
 * - Immediate breadcrumb setting for better UX
 *
 * @param breadcrumbs - Array of breadcrumb items to display (should be memoized)
 *
 * Usage:
 * ```tsx
 * const ClientDetailsPage = () => {
 *   const breadcrumbs = useMemo(() => [
 *     { label: "Clients", href: "/clients" },
 *     { label: "Client Details", isCurrent: true }
 *   ], []);
 *
 *   usePageBreadcrumbs(breadcrumbs);
 *
 *   return <div>...</div>;
 * };
 * ```
 */
export const usePageBreadcrumbs = (
	breadcrumbs: BreadcrumbItemComponentProps[]
): void => {
	const { setBreadcrumbs, clearBreadcrumbs } = useBreadcrumbs();

	// Set breadcrumbs when they change
	useEffect(() => {
		setBreadcrumbs(breadcrumbs);
	}, [breadcrumbs, setBreadcrumbs]);

	// Clear breadcrumbs when component unmounts
	useEffect(() => {
		return () => {
			clearBreadcrumbs();
		};
	}, [clearBreadcrumbs]);
};
