import { CreateViewUseCase } from "@clients/application/create-view.usecase";
import { DeleteViewUseCase } from "@clients/application/delete-view.usecase";
import { GetViewByIdUseCase } from "@clients/application/get-view-by-id.usecase";
import { GetViewsUseCase } from "@clients/application/get-views.usecase";
import type {
	ICreateView,
	IView,
} from "@clients/domain/interfaces/view.interface";
import { ViewAdapter } from "@clients/infrastructure/adapters/view.adapter";
import { useSession } from "@shared/ui/contexts/session-context/session-context";
import {
	type FC,
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

interface ViewsContextValue {
	// State
	views: IView[];
	defaultView: IView | null;
	isLoading: boolean;
	error: string | null;

	// Actions
	createView: (viewData: Omit<ICreateView, "companyId">) => Promise<IView>;
	deleteView: (viewId: string) => Promise<void>;
	getViewById: (viewId: string) => Promise<IView>;
	refetch: () => Promise<void>;
}

const ViewsContext = createContext<ViewsContextValue | undefined>(undefined);

interface ViewsProviderProps {
	children: ReactNode;
}

/**
 * ViewsProvider Component
 *
 * Provides a centralized context for managing client views across the application.
 * This eliminates multiple instances of the useViews hook and reduces API calls
 * from 4 to just 2: initial load and after creating a new view.
 *
 * Features:
 * - Single source of truth for views state
 * - Optimistic updates for better UX
 * - Proper error handling and loading states
 * - Automatic session-based user ID management
 */
export const ViewsProvider: FC<ViewsProviderProps> = ({ children }) => {
	const [views, setViews] = useState<IView[]>([]);
	const [defaultView, setDefaultView] = useState<IView | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Get user ID from session context (only needed for delete operations)
	const { user } = useSession();
	const userId = user?.id || "";

	// Initialize adapter and use cases - memoized to prevent recreation on every render
	const {
		getViewsUseCase,
		createViewUseCase,
		getViewByIdUseCase,
		deleteViewUseCase,
	} = useMemo(() => {
		const viewAdapter = new ViewAdapter();
		return {
			getViewsUseCase: new GetViewsUseCase(viewAdapter),
			createViewUseCase: new CreateViewUseCase(viewAdapter),
			getViewByIdUseCase: new GetViewByIdUseCase(viewAdapter),
			deleteViewUseCase: new DeleteViewUseCase(viewAdapter),
		};
	}, []);

	/**
	 * Fetches all views for the current user
	 * This is the primary API call that should only happen twice:
	 * 1. On initial load
	 * 2. After creating a new view
	 */
	const fetchViews = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const fetchedViews = await getViewsUseCase.execute();
			setViews(fetchedViews);

			// Set default view if exists
			const defaultView = fetchedViews.find((view) => view.isDefault) || null;
			setDefaultView(defaultView);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Error fetching views";
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, [getViewsUseCase]);

	/**
	 * Creates a new view with optimistic updates
	 * After successful creation, refetches the views list to ensure consistency
	 */
	const createView = useCallback(
		async (viewData: Omit<ICreateView, "companyId">): Promise<IView> => {
			setIsLoading(true);
			setError(null);

			try {
				const newView = await createViewUseCase.execute(
					viewData as ICreateView
				);

				// Optimistic update: immediately add to local state
				setViews((prev) => [...prev, newView]);

				// Update default view state if this is the new default
				if (newView.isDefault) {
					setDefaultView(newView);
				}

				// Refetch views to ensure consistency (this is the second API call)
				await fetchViews();

				return newView;
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Error creating view";
				setError(errorMessage);
				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[createViewUseCase, fetchViews]
	);

	/**
	 * Deletes a view with optimistic updates and default view handling
	 */
	const deleteView = useCallback(
		async (viewId: string): Promise<void> => {
			setIsLoading(true);
			setError(null);

			try {
				await deleteViewUseCase.execute(viewId, userId);

				// Optimistic update: immediately remove from local state
				setViews((prev) => prev.filter((view) => view.id !== viewId));

				// Handle default view cleanup and refresh
				if (defaultView?.id === viewId) {
					setDefaultView(null);
					// Refetch views to get the new default view
					await fetchViews();
				}
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Error deleting view";
				setError(errorMessage);
				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[deleteViewUseCase, userId, defaultView, fetchViews]
	);

	/**
	 * Retrieves a specific view by its ID
	 */
	const getViewById = useCallback(
		async (viewId: string): Promise<IView> => {
			return await getViewByIdUseCase.execute(viewId);
		},
		[getViewByIdUseCase]
	);

	// Initial load effect
	useEffect(() => {
		fetchViews();
	}, [fetchViews]);

	const contextValue: ViewsContextValue = useMemo(
		() => ({
			// State
			views,
			defaultView,
			isLoading,
			error,

			// Actions
			createView,
			deleteView,
			getViewById,
			refetch: fetchViews,
		}),
		[
			views,
			defaultView,
			isLoading,
			error,
			createView,
			deleteView,
			getViewById,
			fetchViews,
		]
	);

	return (
		<ViewsContext.Provider value={contextValue}>
			{children}
		</ViewsContext.Provider>
	);
};

/**
 * Custom hook to use the Views context
 * Replaces the individual useViews hook instances
 */
export const useViewsContext = (): ViewsContextValue => {
	const context = useContext(ViewsContext);
	if (context === undefined) {
		throw new Error("useViewsContext must be used within a ViewsProvider");
	}
	return context;
};
