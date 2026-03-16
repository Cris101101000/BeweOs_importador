import {
	AuraToastProvider,
	HeroUIProvider as AuroraProvider,
	NavigationLoadingProvider,
	ThemeProvider,
} from "@beweco/aurora-ui";
import { UserGuidingWrapper } from "@shared/ui/components/user-guiding-wrapper/user-guiding-wrapper.component";
import { useAuthContext } from "@shared/ui/contexts/auth-context/auth.context";
import { ClientCreationWizardProvider } from "@shared/ui/providers/client-creation-wizard-context/client-creation-wizard.provider";
import { TolgeeProvider } from "@tolgee/react";
import { useNavigate } from "react-router-dom";
import { tolgee } from "../i18n";
import Layout from "./layout/ui/components/layout/layout.component";
import { AppRouter } from "./router";
import { BreadcrumbsProvider } from "./shared/ui/contexts/breadcrumbs-context/breadcrumbs.context";
import { SessionProvider } from "./shared/ui/contexts/session-context/session-context";

/**
 * Component that renders the main app content
 * Must be inside SessionProvider to use useSession
 */
const AppContent = () => {
	return (
		<>
			{/* UserGuiding integration for user onboarding and product tours */}
			<UserGuidingWrapper />

			<BreadcrumbsProvider>
				<ClientCreationWizardProvider>
					<Layout>
						<AppRouter />
					</Layout>
				</ClientCreationWizardProvider>
			</BreadcrumbsProvider>
		</>
	);
};

const App = () => {
	const navigate = useNavigate();

	// Verificar si el usuario está autenticado
	const { isCheckingAuth } = useAuthContext();

	const handleNavigate = (path: string) => {
		navigate(path);
	};

	if (isCheckingAuth) return null;

	return (
		<TolgeeProvider tolgee={tolgee} fallback="Cargando traducciones...">
			<AuroraProvider navigate={handleNavigate}>
				<ThemeProvider>
					<NavigationLoadingProvider>
						<AuraToastProvider>
							<SessionProvider>
								<AppContent />
							</SessionProvider>
						</AuraToastProvider>
					</NavigationLoadingProvider>
				</ThemeProvider>
			</AuroraProvider>
		</TolgeeProvider>
	);
};

export default App;
