import type { BreadcrumbItemComponentProps } from "@beweco/aurora-ui";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import type { FC, ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface BreadcrumbsContextType {
	breadcrumbs: BreadcrumbItemComponentProps[];
	setBreadcrumbs: (breadcrumbs: BreadcrumbItemComponentProps[]) => void;
	clearBreadcrumbs: () => void;
}

const BreadcrumbsContext = createContext<BreadcrumbsContextType | undefined>(
	undefined
);

interface BreadcrumbsProviderProps {
	children: ReactNode;
}

/**
 * BreadcrumbsProvider Context
 *
 * Provides global breadcrumb state management for the application.
 * Allows pages to set their breadcrumbs which are then displayed in the header.
 *
 * Features:
 * - Set breadcrumbs from any page component
 * - Automatic clearing of breadcrumbs on route change
 * - Type-safe breadcrumb items
 *
 * Usage:
 * - Wrap your app with BreadcrumbsProvider
 * - Use useBreadcrumbs hook in pages to set breadcrumbs
 * - Header automatically displays current breadcrumbs
 */
export const BreadcrumbsProvider: FC<BreadcrumbsProviderProps> = ({
	children,
}) => {
	const [breadcrumbs, setBreadcrumbsState] = useState<
		BreadcrumbItemComponentProps[]
	>([]);
	const location = useLocation();
	const previousPathnameRef = useRef<string>(location.pathname);

	const setBreadcrumbs = useCallback(
		(newBreadcrumbs: BreadcrumbItemComponentProps[]) => {
			setBreadcrumbsState(newBreadcrumbs);
		},
		[]
	);

	const clearBreadcrumbs = useCallback(() => {
		setBreadcrumbsState([]);
	}, []);

	// Track route changes but don't auto-clear breadcrumbs
	// Let each page component manage its own breadcrumbs lifecycle
	useEffect(() => {
		previousPathnameRef.current = location.pathname;
	}, [location.pathname]);

	const contextValue = useMemo(
		() => ({
			breadcrumbs,
			setBreadcrumbs,
			clearBreadcrumbs,
		}),
		[breadcrumbs, setBreadcrumbs, clearBreadcrumbs]
	);

	return (
		<BreadcrumbsContext.Provider value={contextValue}>
			{children}
		</BreadcrumbsContext.Provider>
	);
};

/**
 * useBreadcrumbs Hook
 *
 * Hook to access and manage breadcrumbs from any component.
 *
 * @returns Object with breadcrumbs state and setter functions
 * @throws Error if used outside BreadcrumbsProvider
 */
export const useBreadcrumbs = (): BreadcrumbsContextType => {
	const context = useContext(BreadcrumbsContext);
	if (context === undefined) {
		throw new Error("useBreadcrumbs must be used within a BreadcrumbsProvider");
	}
	return context;
};
