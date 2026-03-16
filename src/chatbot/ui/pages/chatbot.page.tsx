import { Spinner } from "@beweco/aurora-ui";
import { ErrorBoundary } from "@shared/ui/components";
import { Suspense, lazy } from "react";

// Carga dinámica del componente remoto de lindaBussiness
const LindaChatbot = lazy(() =>
	import("lindaBusiness/Conversations").catch((error) => {
		console.error("Error al cargar el micro frontend:", error);
		// Re-lanzar el error para que lo capture el Error Boundary
		throw error;
	})
);

const ChatbotPage = () => {
	return (
		<div className="h-full w-full">
			<ErrorBoundary
				errorMessage="No se pudo cargar el chatbot"
				retryLabel="Reintentar"
			>
				<Suspense
					fallback={
						<div className="flex items-center justify-center h-full">
							<Spinner size="lg" color="primary" />
						</div>
					}
				>
					<LindaChatbot />
				</Suspense>
			</ErrorBoundary>
		</div>
	);
};

export default ChatbotPage;
