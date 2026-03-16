import { filestackService } from "@shared/infrastructure/services/filestack.service";
import { useSession } from "@shared/ui/contexts/session-context/session-context";
import { useCallback, useState } from "react";

interface UsePostImageUploadReturn {
	uploadImageFromFile: (file: File) => Promise<string>;
	uploadImageFromUrl: (imageUrl: string, filename?: string) => Promise<string>;
	isUploading: boolean;
	error: string | null;
	clearError: () => void;
	validateImageUrl: (imageUrl: string) => Promise<boolean>;
}

/**
 * Hook para manejar la subida de imágenes para posts de redes sociales
 *
 * Casos de uso:
 * 1. Contenido propuesto por Linda AI: Copiar imagen desde URL y subir a Filestack
 * 2. Contenido del usuario: Subir archivo directamente a Filestack
 */
export const usePostImageUpload = (): UsePostImageUploadReturn => {
	const { agency } = useSession();
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	/**
	 * Valida si una URL de imagen es accesible
	 */
	const validateImageUrl = useCallback(
		async (imageUrl: string): Promise<boolean> => {
			if (!imageUrl) return false;

			try {
				const response = await fetch(imageUrl, { method: "HEAD" });
				const contentType = response.headers.get("content-type");
				const isValid =
					response.ok && (contentType?.startsWith("image/") ?? false);
				return isValid;
			} catch (error) {
				console.error("Error validating image URL:", error);
				return false;
			}
		},
		[]
	);

	/**
	 * Convierte una URL de imagen a un objeto File
	 */
	const urlToFile = useCallback(
		async (imageUrl: string, filename: string): Promise<File> => {
			try {
				const response = await fetch(imageUrl);

				if (!response.ok) {
					throw new Error(`Failed to fetch image: ${response.statusText}`);
				}

				const blob = await response.blob();

				// Extraer extensión del content-type o usar la URL
				const contentType =
					response.headers.get("content-type") || "image/jpeg";
				const extension = contentType.split("/")[1] || "jpg";

				// Crear nombre de archivo único
				const timestamp = Date.now();
				const finalFilename = `${filename}_${timestamp}.${extension}`;

				return new File([blob], finalFilename, { type: contentType });
			} catch (error) {
				console.error("Error converting URL to File:", error);
				throw new Error("No se pudo descargar la imagen desde la URL");
			}
		},
		[]
	);

	/**
	 * Sube una imagen desde un archivo File
	 */
	const uploadImageFromFile = useCallback(
		async (file: File): Promise<string> => {
			if (!agency?.id) {
				throw new Error("Agency ID is required for file upload");
			}

			if (!filestackService.isConfigured()) {
				throw new Error("Filestack no está configurado correctamente");
			}

			try {
				setIsUploading(true);
				setError(null);

				console.log("🔄 Subiendo imagen desde archivo a Filestack...");

				const results = await filestackService.uploadFilesWithMetadata([file], {
					agencyId: agency.id,
					path: "social-media/posts/",
				});

				if (!results || results.length === 0) {
					throw new Error("No se recibió respuesta de Filestack");
				}

				const imageUrl = results[0].url;
				console.log("✅ Imagen subida exitosamente:", imageUrl);

				return imageUrl;
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Error al subir la imagen";

				setError(errorMessage);
				console.error("❌ Error uploading image from file:", err);
				throw new Error(errorMessage);
			} finally {
				setIsUploading(false);
			}
		},
		[agency]
	);

	/**
	 * Sube una imagen desde una URL (para contenido de Linda AI)
	 * 1. Descarga la imagen desde la URL
	 * 2. Convierte a File
	 * 3. Sube a Filestack
	 */
	const uploadImageFromUrl = useCallback(
		async (imageUrl: string, filename = "linda_content"): Promise<string> => {
			if (!agency?.id) {
				throw new Error("Agency ID is required for file upload");
			}

			if (!filestackService.isConfigured()) {
				throw new Error("Filestack no está configurado correctamente");
			}

			try {
				setIsUploading(true);
				setError(null);

				console.log("🔄 Validando accesibilidad de imagen:", imageUrl);

				// Validar que la imagen sea accesible
				const isValid = await validateImageUrl(imageUrl);
				if (!isValid) {
					throw new Error(
						"La imagen no es accesible o no es una imagen válida"
					);
				}

				console.log("✅ Imagen válida, descargando...");

				// Convertir URL a File
				const file = await urlToFile(imageUrl, filename);

				console.log("🔄 Subiendo a Filestack...", {
					filename: file.name,
					size: file.size,
					type: file.type,
				});

				// Subir a Filestack
				const results = await filestackService.uploadFilesWithMetadata([file], {
					agencyId: agency.id,
					path: "social-media/posts/",
				});

				if (!results || results.length === 0) {
					throw new Error("No se recibió respuesta de Filestack");
				}

				const filestackUrl = results[0].url;
				console.log(
					"✅ Imagen copiada y subida exitosamente a Filestack:",
					filestackUrl
				);

				return filestackUrl;
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Error al procesar la imagen";

				setError(errorMessage);
				console.error("❌ Error uploading image from URL:", err);
				throw new Error(errorMessage);
			} finally {
				setIsUploading(false);
			}
		},
		[agency, validateImageUrl, urlToFile]
	);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	return {
		uploadImageFromFile,
		uploadImageFromUrl,
		isUploading,
		error,
		clearError,
		validateImageUrl,
	};
};
