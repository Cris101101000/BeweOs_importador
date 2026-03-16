import { Button, IconComponent, P } from "@beweco/aurora-ui";
import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
	onError?: (error: Error, errorInfo: unknown) => void;
	showRetry?: boolean;
	errorMessage?: string;
	retryLabel?: string;
}

interface State {
	hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(): State {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: unknown) {
		console.error("Error capturado por ErrorBoundary:", error, errorInfo);
		this.props.onError?.(error, errorInfo);
	}

	handleRetry = () => {
		this.setState({ hasError: false });
		window.location.reload();
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			const {
				errorMessage = "Ha ocurrido un error inesperado",
				retryLabel = "Reintentar",
				showRetry = true,
			} = this.props;

			return (
				<div className="flex flex-col items-center justify-center h-full min-h-[400px] py-12 text-center">
					<IconComponent
						icon="fluent:warning-24-filled"
						className="text-8xl text-danger mb-4"
					/>
					<P className="text-danger mb-4">{errorMessage}</P>
					{showRetry && (
						<Button
							color="danger"
							size="md"
							variant="flat"
							onPress={this.handleRetry}
						>
							{retryLabel}
						</Button>
					)}
				</div>
			);
		}

		return this.props.children;
	}
}
