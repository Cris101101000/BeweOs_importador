import { Spinner } from "@beweco/aurora-ui";
import { ErrorBoundary } from "@shared/ui/components";
import { Suspense, lazy } from "react";

// Carga dinámica del componente remoto de lindaBussiness
const ConversationsComponent = lazy(() =>
	import("lindaBusiness/Conversations").catch((error) => {
		console.error("Error al cargar el micro frontend:", error);
		// Re-lanzar el error para que lo capture el Error Boundary
		throw error;
	})
);

const Conversations = ({ showChannelBanner }: { showChannelBanner: boolean }) => {
	return (
		<div
			className={
				showChannelBanner
					? "h-[calc(100vh-338px)] w-full"
					: "h-[calc(100vh-245px)] w-full"
			}
		>
			<ErrorBoundary
				errorMessage="No se pudo cargar las conversaciones"
				retryLabel="Reintentar"
			>
				<Suspense
					fallback={
						<div className="flex items-center justify-center h-full">
							<Spinner size="lg" color="primary" />
						</div>
					}
				>
					<ConversationsComponent />
				</Suspense>
			</ErrorBoundary>
		</div>
	);
};

export default Conversations;
