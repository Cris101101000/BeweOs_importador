/**
 * ImagePreview Component - BeweOS Wrapper
 *
 * Wrapper del componente ImagePreview de @beweco/aurora-ui integrado con el sistema
 * de traducciones de BeweOS (@tolgee/react).
 */

import { ImagePreview as AuraImagePreview } from "@beweco/aurora-ui";
import type {
	ImagePreviewItem,
	ImagePreviewProps,
	ImagePreviewTranslations,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type React from "react";

export interface ImagePreviewComponentProps
	extends Omit<ImagePreviewProps, "translations"> {
	/** Sobrescribir traducciones específicas (opcional) */
	translations?: Partial<ImagePreviewTranslations>;
}

// Re-exportar tipos para uso externo
export type { ImagePreviewItem, ImagePreviewTranslations };

/**
 * Keys de traducción para el componente ImagePreview
 * Estas claves se mapean al sistema de i18n de @tolgee/react
 */
const translationKeys = {
	previewAlt: "image_preview_alt",
	removeButtonAriaLabel: "image_preview_remove_aria_label",
	emptyStateText: "image_preview_empty_state",
	clickableImageAriaLabel: "image_preview_clickable_aria_label",
};

/**
 * Traducciones fallback en español cuando no están disponibles en el sistema i18n
 */
const fallbackTranslations: Required<ImagePreviewTranslations> = {
	previewAlt: "Vista previa de imagen",
	removeButtonAriaLabel: "Eliminar imagen",
	emptyStateText: "No hay imágenes para mostrar",
	clickableImageAriaLabel: "Hacer clic para ampliar imagen",
};

/**
 * Componente de vista previa de imágenes integrado con el sistema de traducciones de BeweOS
 *
 * Este wrapper proporciona:
 * - ✅ Integración automática con @tolgee/react para traducciones
 * - ✅ Traducciones por defecto en español desde archivos de locales
 * - ✅ Soporte para imagen única o múltiples imágenes (del componente base)
 * - ✅ Cuatro tamaños: micro (48x48), small (100x100), medium (150x150), large (200x200)
 * - ✅ Botón de eliminación integrado con callback
 * - ✅ Imágenes clickeables con callback `onImageClick` para abrir modales, editores, etc.
 * - ✅ Dark mode soportado
 * - ✅ Totalmente accesible (ARIA, navegación por teclado)
 *
 * @example
 * // Uso básico - Logo único
 * <ImagePreviewComponent
 *   images={companyLogo}
 *   size="small"
 *   onRemove={() => handleRemoveLogo()}
 * />
 *
 * @example
 * // Galería con modal
 * <ImagePreviewComponent
 *   images={products}
 *   size="medium"
 *   onImageClick={(image) => openModal(image.src)}
 *   onRemove={(id) => deleteProduct(id)}
 * />
 */
export const ImagePreviewComponent: React.FC<ImagePreviewComponentProps> = ({
	translations: customTranslations = {},
	...props
}) => {
	const { t } = useTranslate();

	// Crear traducciones usando el sistema i18n con fallbacks
	const systemTranslations: ImagePreviewTranslations = {
		previewAlt: t(translationKeys.previewAlt, fallbackTranslations.previewAlt),
		removeButtonAriaLabel: t(
			translationKeys.removeButtonAriaLabel,
			fallbackTranslations.removeButtonAriaLabel
		),
		emptyStateText: t(
			translationKeys.emptyStateText,
			fallbackTranslations.emptyStateText
		),
		clickableImageAriaLabel: t(
			translationKeys.clickableImageAriaLabel,
			fallbackTranslations.clickableImageAriaLabel
		),
	};

	// Combinar traducciones del sistema con las personalizadas
	const finalTranslations = { ...systemTranslations, ...customTranslations };

	// Usar el componente publicado de @beweco/aurora-ui
	return <AuraImagePreview {...props} translations={finalTranslations} />;
};
