/**
 * Error personalizado para operaciones de Brand Guide
 */
export class BrandGuideError extends Error {
	constructor(
		message: string,
		public readonly code?: string
	) {
		super(message);
		this.name = 'BrandGuideError';
	}
}

/**
 * Mapea errores de la API a mensajes amigables
 */
export function mapBrandGuideError(error: unknown): string {
	// Si es un error de respuesta HTTP
	if (
		error &&
		typeof error === 'object' &&
		'error' in error &&
		(error as { error?: { message?: string } }).error?.message
	) {
		return (error as { error: { message: string } }).error.message;
	}

	// Si es un error con mensaje
	if (error instanceof Error) {
		// Si es un error de red
		if (error.message.includes('Network')) {
			return 'Error de conexión. Por favor, verifica tu conexión a internet.';
		}

		// Si es un timeout
		if (error.message.includes('timeout')) {
			return 'La solicitud tardó demasiado tiempo. Por favor, intenta nuevamente.';
		}
	}

	// Error genérico
	return 'Ocurrió un error al cargar la guía de marca. Por favor, intenta nuevamente.';
}
