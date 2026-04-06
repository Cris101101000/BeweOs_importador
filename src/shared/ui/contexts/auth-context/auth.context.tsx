import { RefreshSessionUseCase } from "@auth/application/refresh-session.usecase";
import { AuthAdapter } from "@auth/infrastructure/adapters/auth.adapter";
import { TGoToLogin, goToLogin } from "@shared/ui/functions/go-to-login";
import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

interface AuthContextType {
	isCheckingAuth: boolean;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			// En modo mock, skip validación de sesión contra backend
			if (process.env.REACT_APP_USE_MOCK_DATA === "true") {
				setIsCheckingAuth(false);
				setIsAuthenticated(true);
				return;
			}

			try {
				const useCase = new RefreshSessionUseCase(new AuthAdapter());
				const result = await useCase.execute();

				if (result.needsLogin) {
					setIsAuthenticated(false);
					goToLogin(TGoToLogin.Expired);
					return;
				}

				setIsCheckingAuth(false);
				setIsAuthenticated(true);
			} catch (error) {
				console.error("Error checking auth:", error);
				setIsAuthenticated(false);
				goToLogin(TGoToLogin.Expired);
			}
		};

		checkAuth();
	}, []);

	return (
		<AuthContext.Provider value={{ isCheckingAuth, isAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuthContext = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuthContext debe ser usado dentro de un AuthProvider");
	}
	return context;
};
