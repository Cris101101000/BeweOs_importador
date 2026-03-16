import { TolgeeProvider } from "@tolgee/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { tolgee } from "../i18n";
import App from "./App";
import "./index.css";
import "@beweco/aurora-ui/styles";
import {
	configureAuthCookies,
	getAccessToken,
	getBaseDomain,
	getRefreshToken,
	removeAccessToken,
	removeRefreshToken,
	setAccessToken,
	setRefreshToken,
} from "@beweco/utils-js";
import { AuthProvider } from "@shared/ui/contexts/auth-context/auth.context";

// Bootstrap: reescribe cookies de auth con el dominio actual
const bootstrapAuthCookies = () => {
	const hostname = window.location.hostname;
	const domain = hostname === "localhost" ? "localhost" : hostname;

	try {
		const at = getAccessToken();
		const rt = getRefreshToken();

		// Configura las cookies de autenticación con el dominio actual
		configureAuthCookies({ domain });

		if (at) {
			removeAccessToken(getBaseDomain(domain));
			setAccessToken(at);
		}
		if (rt) {
			removeRefreshToken(getBaseDomain(domain));
			setRefreshToken(rt);
		}
	} catch {
		// no-op
	}
};

bootstrapAuthCookies();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<AuthProvider>
		<React.StrictMode>
			<BrowserRouter>
				<TolgeeProvider tolgee={tolgee}>
					<App />
				</TolgeeProvider>
			</BrowserRouter>
		</React.StrictMode>
	</AuthProvider>
);
