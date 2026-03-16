/**
 * SocialMediaCarousel Component - BeweOS Wrapper
 *
 * Wrapper del componente SocialMediaCarousel de @beweco/aurora-ui integrado con el sistema
 * de traducciones de BeweOS (@tolgee/react).
 */

import {
	SocialMediaCarousel as AuraSocialMediaCarousel,
	type SocialMediaCarouselProps as AuraSocialMediaCarouselProps,
	type ContentCarouselTranslations,
	type SocialMediaCarouselItem,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type React from "react";

export interface SocialMediaCarouselProps
	extends Omit<AuraSocialMediaCarouselProps, "translations"> {
	/** Sobrescribir traducciones específicas (opcional) */
	translations?: Partial<ContentCarouselTranslations>;
	/** Callback cuando se presiona el botón de preview */
	onPreview?: (item: SocialMediaCarouselItem) => void;
}

// Re-exportar tipos para uso externo
export type { SocialMediaCarouselItem, ContentCarouselTranslations };

/**
 * Keys de traducción para el componente SocialMediaCarousel
 * Estas claves se mapean al sistema de i18n de @tolgee/react
 */
const translationKeys = {
	emptyStateMessage: "carousel_empty_state_message",
	emptyStateButtonText: "carousel_empty_state_button",
	previousButtonLabel: "carousel_previous_button",
	nextButtonLabel: "carousel_next_button",
	editButtonLabel: "carousel_edit_button",
	deleteButtonLabel: "carousel_delete_button",
	publishButtonLabel: "carousel_publish_button",
	previewButtonLabel: "carousel_preview_button",
	goToItemLabel: "carousel_go_to_item",
};

/**
 * Traducciones fallback en español cuando no están disponibles en el sistema i18n
 */
const fallbackTranslations: Required<ContentCarouselTranslations> = {
	emptyStateMessage: "No hay más contenido propuesto",
	emptyStateButtonText: "Crear contenido nuevo",
	previousButtonLabel: "Anterior",
	nextButtonLabel: "Siguiente",
	editButtonLabel: "Editar",
	deleteButtonLabel: "Eliminar",
	publishButtonLabel: "Publicar",
	previewButtonLabel: "Ver vista previa",
	goToItemLabel: "Ir al item",
};

/**
 * Componente de carousel para contenido de redes sociales integrado con el sistema de traducciones de BeweOS
 *
 * Este wrapper proporciona:
 * - ✅ Integración automática con @tolgee/react para traducciones
 * - ✅ Traducciones por defecto en español desde archivos de locales
 * - ✅ Carousel 3D con navegación fluida y transiciones suaves
 * - ✅ SocialMediaBar integrada como footer
 * - ✅ Información de audiencia con contador, razones y tags
 * - ✅ Soporte para Instagram, TikTok, WhatsApp
 * - ✅ Gestión completa de contenido (editar, eliminar, publicar)
 * - ✅ Dark mode soportado
 * - ✅ Totalmente accesible (ARIA, navegación por teclado)
 *
 * @example
 * // Uso básico con contenido de Instagram
 * <SocialMediaCarouselComponent
 *   items={instagramPosts}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   onPublish={handlePublish}
 * />
 *
 * @example
 * // Con información de audiencia
 * <SocialMediaCarouselComponent
 *   items={[{
 *     id: "post-1",
 *     title: "Promoción Especial",
 *     caption: "¡Descuentos increíbles!",
 *     imageUrl: "/promo.jpg",
 *     gradient: "linear-gradient(45deg, #2D35EB 0%, #904ED4 100%)",
 *     type: "instagram-post",
 *     targetAudienceCount: 1250,
 *     audienceReason: "Clientes activos últimos 30 días",
 *     requiredTags: ["promociones", "descuentos"]
 *   }]}
 *   onPublish={handlePublish}
 * />
 *
 * @example
 * // Campaña de WhatsApp
 * <SocialMediaCarouselComponent
 *   items={whatsappCampaigns}
 *   campaignView={true}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   onPublish={handlePublish}
 * />
 *
 * @example
 * // Sin información de audiencia
 * <SocialMediaCarouselComponent
 *   items={items}
 *   hideAudienceInfo={true}
 *   onPublish={handlePublish}
 * />
 *
 * @example
 * // Sin footer (solo navegación)
 * <SocialMediaCarouselComponent
 *   items={items}
 *   hideFooter={true}
 *   onItemClick={handleItemClick}
 * />
 */
export const SocialMediaCarouselComponent: React.FC<
	SocialMediaCarouselProps
> = ({ translations: customTranslations = {}, ...props }) => {
	const { t } = useTranslate();

	// Crear traducciones usando el sistema i18n con fallbacks
	const systemTranslations: ContentCarouselTranslations = {
		emptyStateMessage: t(
			translationKeys.emptyStateMessage,
			fallbackTranslations.emptyStateMessage
		),
		emptyStateButtonText: t(
			translationKeys.emptyStateButtonText,
			fallbackTranslations.emptyStateButtonText
		),
		previousButtonLabel: t(
			translationKeys.previousButtonLabel,
			fallbackTranslations.previousButtonLabel
		),
		nextButtonLabel: t(
			translationKeys.nextButtonLabel,
			fallbackTranslations.nextButtonLabel
		),
		editButtonLabel: t(
			translationKeys.editButtonLabel,
			fallbackTranslations.editButtonLabel
		),
		deleteButtonLabel: t(
			translationKeys.deleteButtonLabel,
			fallbackTranslations.deleteButtonLabel
		),
		publishButtonLabel: t(
			translationKeys.publishButtonLabel,
			fallbackTranslations.publishButtonLabel
		),
		previewButtonLabel: t(
			translationKeys.previewButtonLabel,
			fallbackTranslations.previewButtonLabel
		),
		goToItemLabel: t(
			translationKeys.goToItemLabel,
			fallbackTranslations.goToItemLabel
		),
	};

	// Combinar traducciones del sistema con las personalizadas
	const finalTranslations = { ...systemTranslations, ...customTranslations };

	// Usar el componente publicado de @beweco/aurora-ui
	return (
		<AuraSocialMediaCarousel {...props} translations={finalTranslations} />
	);
};
