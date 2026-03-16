/**
 * Error Handler Utility for Content Generation API
 * Maps backend error codes to user-friendly messages
 */

interface ApiError {
	code?: string;
	message?: string;
}

/**
 * Map backend error codes to user-friendly error messages
 */
export function mapContentGenerationError(error: unknown): string {
	// Handle Error instances
	if (error instanceof Error) {
		// Check for cancellation errors
		if (error.name === "AbortError" || error.message.includes("cancel")) {
			return "La solicitud fue cancelada. Por favor, intenta nuevamente.";
		}

		// Check for network errors
		if (
			error.message.includes("Network") ||
			error.message.includes("Failed to fetch")
		) {
			return "Error de conexión. Por favor, verifica tu conexión a internet.";
		}

		// Check for timeout errors
		if (error.message.includes("timeout")) {
			return "La solicitud tardó demasiado tiempo. Por favor, intenta nuevamente.";
		}

		return error.message;
	}

	// Handle API error responses with error codes
	if (typeof error === "object" && error !== null) {
		const apiError = error as { error?: ApiError; message?: string };

		const errorCode = apiError.error?.code;
		const errorMessage = apiError.error?.message || apiError.message;

		// Map specific error codes to friendly messages
		switch (errorCode) {
			case "CONTENT_NOT_FOUND":
				return "El contenido solicitado no existe o fue eliminado";

			case "INVALID_STATUS":
				return "El estado proporcionado no es válido";

			case "UNAUTHORIZED":
				return "No tienes permisos para realizar esta acción";

			case "FORBIDDEN":
				return "Acceso denegado a este contenido";

			case "NETWORK_ERROR":
				return "Error de conexión. Por favor, verifica tu conexión a internet";

			case "TIMEOUT":
				return "La solicitud tardó demasiado tiempo. Intenta nuevamente";

			case "SERVER_ERROR":
			case "INTERNAL_SERVER_ERROR":
				return "Error en el servidor. Por favor, intenta más tarde";

			case "VALIDATION_ERROR":
				return errorMessage || "Los datos proporcionados no son válidos";

			case "CONTENT_ALREADY_PUBLISHED":
				return "Este contenido ya ha sido publicado";

			case "CONTENT_ALREADY_DELETED":
				return "Este contenido ya ha sido eliminado";

			case "RATE_LIMIT_EXCEEDED":
				return "Has excedido el límite de solicitudes. Espera un momento e intenta nuevamente";

			default:
				// If there's a message from the backend, use it
				if (errorMessage) {
					return errorMessage;
				}

				// Generic fallback
				return "Ocurrió un error inesperado. Por favor, intenta nuevamente";
		}
	}

	// Fallback for unknown error types
	return "Ocurrió un error inesperado. Por favor, intenta nuevamente";
}

/**
 * Enhanced error class for Content Generation operations
 */
export class ContentGenerationError extends Error {
	code?: string;
	statusCode?: number;

	constructor(message: string, code?: string, statusCode?: number) {
		super(message);
		this.name = "ContentGenerationError";
		this.code = code;
		this.statusCode = statusCode;
	}
}
