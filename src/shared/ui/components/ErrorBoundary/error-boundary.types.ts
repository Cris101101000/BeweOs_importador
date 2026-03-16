import type { ReactNode } from "react";

export interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
	onError?: (error: Error, errorInfo: unknown) => void;
	showRetry?: boolean;
	errorMessage?: string;
	retryLabel?: string;
}
