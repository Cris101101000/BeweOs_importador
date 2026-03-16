/**
 * Custom React hook to fetch and initialize essential application data.
 *
 * This hook is responsible for:
 * - Fetching the current user, agency, and menu data from the backend.
 * - Storing the fetched user and agency data in the session context.
 * - Extracting and storing the list of module IDs from the menu data.
 * - Setting the application theme based on the agency's primary color and the user's theme preference.
 * - Managing and exposing a loading state while the data is being fetched.
 *
 * Usage:
 *   const { isLoading, menuData } = useInitialData();
 *
 * Returns:
 *   - isLoading: boolean - Indicates if the initial data is still being loaded.
 *   - menuData: IMenu | null - The fetched menu data, or null if not yet loaded.
 *
 * Side Effects:
 *   - Updates session context with user, agency, and module IDs.
 *   - Updates theme context with the computed theme color.
 *
 * Error Handling:
 *   - Logs errors to the console if fetching fails.
 *   - (TODO) Proper error handling and user feedback should be implemented.
 */

import {
	type ThemeColor,
	type ThemeMode,
	useThemeContext,
} from "@beweco/aurora-ui";
import { GetClientManifestPkUseCase } from "@layout/application/get-client-manifest-pk.usecase";
import { useEffect, useState } from "react";
import { tolgee } from "../../../../i18n";
import { useSession } from "../../../shared/ui/contexts/session-context/session-context";
import { GetAgencyUseCase } from "../../application/get-agency.usecase";
import { GetMenuDataUseCase } from "../../application/get-menu-data.usecase";
import { GetUserUseCase } from "../../application/get-user.usecase";
import type { IMenu } from "../../domain/interfaces/modulo.interface";
import { InitialDataAdapter } from "../../infrastructure/adapters/initial-data.adapter";
import { mapMenuToModuleIds } from "../components/layout/mappers/map-menu-to-modules-id.mapper";
import { STEPS_WITHOUT_BRAND } from "src/onboarding/domain/onboarding-orchestrator/constants/onboarding-steps.constants";
import { OnboardingStep } from "src/onboarding/domain";

// Declaración global para el objeto USER_SESSION en window
declare global {
	interface Window {
		USER_SESSION:
			| {
					name: string;
					email: string;
					theme: string;
					language: string;
					pk: string;
			  }
			| undefined;
	}
}

/**
 * useInitialData
 *
 * Fetches and initializes user, agency, and menu data for the application.
 * Also sets up the theme and module IDs in the appropriate contexts.
 *
 * @returns {Object} - { isLoading, menuData }
 */
export const useInitialData = () => {
	// Session context setters for user, agency, and module IDs
	const { setUser, setAgency, setModulesId } = useSession();

	// Theme context setter
	const { setColor, setMode } = useThemeContext();

	// State to hold menu data
	const [menuData, setMenuData] = useState<IMenu | null>(null);

	// State to indicate loading status
	const [isLoading, setIsLoading] = useState(true);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		/**
		 * Fetches user, agency, and menu data in parallel,
		 * then updates contexts and theme accordingly.
		 */
		const getInitialData = async () => {
			try {
				// Create a single adapter instance for all use cases
				const initialDataAdapter = new InitialDataAdapter();

				// Instantiate use cases with the adapter
				const getUserUseCase = new GetUserUseCase(initialDataAdapter);
				const getAgencyUseCase = new GetAgencyUseCase(initialDataAdapter);
				const getMenuDataUseCase = new GetMenuDataUseCase(initialDataAdapter);
				const getClientManifestPkUseCase = new GetClientManifestPkUseCase(
					initialDataAdapter
				);

				// Fetch all required data in parallel
				const [userData, agencyData, menu, clientManifestPk] =
					await Promise.all([
						getUserUseCase.execute(),
						getAgencyUseCase.execute(),
						getMenuDataUseCase.execute(),
						getClientManifestPkUseCase.execute(),
					]);

				// Asignar objeto global en window con datos del usuario
				window.USER_SESSION = {
					name: userData?.firstname || "",
					email: userData?.email || "",
					theme: userData?.theme || "",
					language: userData?.language || "",
					pk: clientManifestPk || "",
				};

				// Store user and agency data in session context
				setUser(userData);
				setAgency(agencyData);

				// Store menu data in local state
				setMenuData(menu);

				// Extract and store module IDs from menu data
				if (menu) {
					setModulesId(mapMenuToModuleIds(menu));
				}

				// Set the theme based on agency's primary color and user's theme
				if (agencyData && userData) {
					const isOnboarding = window.location.pathname === "/onboarding";
					const stepParam = new URLSearchParams(window.location.search).get("step");

					const shouldApplyBrandColor = !isOnboarding || STEPS_WITHOUT_BRAND.includes(stepParam as OnboardingStep);

					if(shouldApplyBrandColor) {
						const colorTheme = `${agencyData.configurations.primaryColor}`;
						setColor(colorTheme as ThemeColor);
					}

					const theme = `${userData.theme}`;
					setMode(theme as ThemeMode);
				}

				// Set application language from user profile
				if (userData?.language) {
					try {
						await tolgee.changeLanguage(userData.language);
					} catch (e) {
						console.error("Failed to set language from user profile", e);
					}
				}
			} catch (error) {
				console.error("Failed to fetch initial data:", error);
				// TODO: Implement proper error handling and user feedback
			} finally {
				setIsLoading(false);
			}
		};

		// Trigger the initial data fetch on mount
		getInitialData();
	}, [setAgency, setUser, setModulesId]);

	// Expose loading state and menu data
	return { isLoading, menuData };
};
