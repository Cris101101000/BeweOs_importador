import { useCallback, useMemo, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { RetriveUrl } from "../DependencyInjection";
import { useIngestionStore } from "../store";
import type { ISubUrl, IUrlGroup } from "../store";

/**
 * Normalize URL by adding https:// if missing
 */
const normalizeUrl = (url: string): string => {
	const trimmedUrl = url.trim();
	if (!trimmedUrl.match(/^https?:\/\//i)) {
		return `https://${trimmedUrl}`;
	}
	return trimmedUrl;
};

/**
 * Validate if a string is a valid URL
 */
const isValidUrl = (url: string): boolean => {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
};

/**
 * Hook for managing URL exploration logic
 */
export const useUrlExploration = () => {
	// Ref to track if exploration should stop (for cleanup)
	const shouldStopRef = useRef(false);

	// Select state with shallow comparison to avoid unnecessary re-renders
	const exploration = useIngestionStore(
		useShallow((state) => state.exploration)
	);

	// Select actions (these are stable references)
	const actions = useIngestionStore(
		useShallow((state) => ({
			startExploration: state.startExploration,
			updateExplorationProgress: state.updateExplorationProgress,
			completeExploration: state.completeExploration,
			failExploration: state.failExploration,
			closeExploration: state.closeExploration,
			addLoadedUrl: state.addLoadedUrl,
			toggleSubUrlSelection: state.toggleSubUrlSelection,
		}))
	);

	// Memoize selected sub-URLs to avoid creating new array on every render
	const selectedSubUrls = useMemo(
		() => exploration.discoveredSubUrls.filter((url) => url.selected),
		[exploration.discoveredSubUrls]
	);

	/**
	 * Simulate progress animation while waiting for API response
	 * Progress goes from 0 to maxProgress over duration
	 */
	const simulateProgressAnimation = useCallback(
		async (maxProgress = 80, duration = 1500): Promise<void> => {
			const steps = 8;
			const stepDuration = duration / steps;
			const progressPerStep = maxProgress / steps;

			for (let i = 1; i <= steps; i++) {
				if (shouldStopRef.current) break;
				await new Promise((resolve) => setTimeout(resolve, stepDuration));
				if (shouldStopRef.current) break;
				actions.updateExplorationProgress(Math.round(progressPerStep * i));
			}
		},
		[actions]
	);

	/**
	 * Start exploring a URL using the real API
	 */
	const exploreUrl = useCallback(
		async (urlInput: string): Promise<{ success: boolean; error?: string }> => {
			if (!urlInput.trim()) {
				return { success: false, error: "Por favor ingresa una URL válida" };
			}

			const normalizedUrl = normalizeUrl(urlInput);

			if (!isValidUrl(normalizedUrl)) {
				return {
					success: false,
					error:
						"Por favor ingresa una URL válida (ejemplo: www.mi-negocio.com o https://mi-negocio.com)",
				};
			}

			// Reset stop flag
			shouldStopRef.current = false;

			// Start exploration - opens modal with exploring state
			actions.startExploration(normalizedUrl);

			// Run progress animation and API call in parallel
			const [, result] = await Promise.all([
				simulateProgressAnimation(80, 1500),
				RetriveUrl(normalizedUrl),
			]);

			// Check if exploration was cancelled
			if (shouldStopRef.current) {
				return { success: false, error: "Exploración cancelada" };
			}

			if (!result.isSuccess) {
				shouldStopRef.current = true;
				actions.failExploration();
				return {
					success: false,
					error: "Error al explorar la URL. Verifica que la URL sea accesible.",
				};
			}

			// Complete exploration with real data from API
			actions.completeExploration(result.value || []);
			return { success: true };
		},
		[actions, simulateProgressAnimation]
	);

	/**
	 * Confirm URL selection and add to loaded URLs
	 */
	const confirmSelection = useCallback((): {
		success: boolean;
		error?: string;
	} => {
		if (selectedSubUrls.length === 0) {
			return { success: false, error: "Debes seleccionar al menos una URL" };
		}

		const newLoadedUrl: IUrlGroup = {
			id: Date.now().toString(),
			url: exploration.mainUrl,
			subUrls: selectedSubUrls.map((url) => url.url),
			loadedAt: new Date(),
			source: "local",
		};

		actions.addLoadedUrl(newLoadedUrl);
		actions.closeExploration();

		return { success: true };
	}, [selectedSubUrls, exploration.mainUrl, actions]);

	/**
	 * Cancel exploration and close modal
	 */
	const cancelExploration = useCallback(() => {
		shouldStopRef.current = true;
		actions.closeExploration();
	}, [actions]);

	/**
	 * Filter URLs by search query
	 */
	const filterUrlsBySearch = useCallback(
		(searchQuery: string): ISubUrl[] => {
			if (!searchQuery.trim()) {
				return exploration.discoveredSubUrls;
			}

			const query = searchQuery.toLowerCase();
			return exploration.discoveredSubUrls.filter(
				(url) =>
					url.url.toLowerCase().includes(query) ||
					url.title.toLowerCase().includes(query)
			);
		},
		[exploration.discoveredSubUrls]
	);

	return {
		// State
		exploration,
		selectedCount: selectedSubUrls.length,

		// Actions
		exploreUrl,
		confirmSelection,
		cancelExploration,
		toggleSubUrlSelection: actions.toggleSubUrlSelection,

		// Search & Filter
		filterUrlsBySearch,
	};
};
