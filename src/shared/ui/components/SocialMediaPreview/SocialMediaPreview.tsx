/**
 * SocialMediaPreview Component - BeweOS Wrapper
 *
 * Wrapper del componente SocialMediaPreview de @beweco/aurora-ui integrado con el sistema
 * de traducciones de BeweOS (@tolgee/react).
 */

import type {
	SocialMediaPreviewProps as AuraSocialMediaPreviewProps,
	PostAspectRatio,
	PreviewVariant,
	SocialMediaPreviewTranslations,
	SocialPlatform,
} from "@beweco/aurora-ui";
import { SocialMediaPreview as AuraSocialMediaPreview } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type React from "react";

export interface SocialMediaPreviewProps
	extends Omit<AuraSocialMediaPreviewProps, "translations"> {
	/** Sobrescribir traducciones específicas (opcional) */
	translations?: Partial<SocialMediaPreviewTranslations>;
	/** Mostrar botón de edición de imagen */
	showEditButton?: boolean;
	/** Callback cuando se hace clic en el botón de edición */
	onEditClick?: () => void;
}

// Re-exportar tipos para uso externo
export type {
	SocialMediaPreviewTranslations,
	SocialPlatform,
	PreviewVariant,
	PostAspectRatio,
};

/**
 * Keys de traducción para el componente SocialMediaPreview
 * Estas claves se mapean al sistema de i18n de @tolgee/react
 */
const translationKeys = {
	username: "social_preview_username",
	sendMessage: "social_preview_send_message",
	viewMore: "social_preview_view_more",
	viewLess: "social_preview_view_less",
	timeAgo: "social_preview_time_ago",
	imageAlt: "social_preview_image_alt",
};

/**
 * Traducciones fallback en español cuando no están disponibles en el sistema i18n
 */
const fallbackTranslations: Required<SocialMediaPreviewTranslations> = {
	username: "tu_negocio",
	sendMessage: "Enviar mensaje",
	viewMore: "ver más",
	viewLess: "ver menos",
	timeAgo: "hace unos momentos",
	imageAlt: "Vista previa de red social",
};

/**
 * Componente de vista previa de redes sociales integrado con el sistema de traducciones de BeweOS
 *
 * Este wrapper proporciona:
 * - ✅ Integración automática con @tolgee/react para traducciones
 * - ✅ Traducciones por defecto en español desde archivos de locales
 * - ✅ Soporte para 4 plataformas: Instagram, Facebook, TikTok, Twitter
 * - ✅ Tres variantes: compact, full, story
 * - ✅ Múltiples relaciones de aspecto para posts de Instagram: square (1:1), portrait (4:5), landscape (1.91:1)
 * - ✅ Dark mode soportado
 * - ✅ Totalmente accesible (ARIA, navegación por teclado)
 *
 * @example
 * // Vista previa de Instagram post (cuadrado - por defecto)
 * <SocialMediaPreviewComponent
 *   platform="instagram"
 *   imageUrl="/product.jpg"
 *   caption="¡Nuevo producto disponible! 🎉"
 *   variant="full"
 *   postAspectRatio="square"
 *   showHeader={true}
 * />
 *
 * @example
 * // Vista previa de Instagram post vertical (recomendado)
 * <SocialMediaPreviewComponent
 *   platform="instagram"
 *   imageUrl="/tall-product.jpg"
 *   caption="Formato vertical perfecto para productos 📱"
 *   variant="full"
 *   postAspectRatio="portrait"
 * />
 *
 * @example
 * // Vista previa de Instagram post horizontal
 * <SocialMediaPreviewComponent
 *   platform="instagram"
 *   imageUrl="/landscape.jpg"
 *   caption="Formato horizontal para panorámicas 🌄"
 *   variant="full"
 *   postAspectRatio="landscape"
 * />
 *
 * @example
 * // Vista previa de Instagram story (9:16 por defecto)
 * <SocialMediaPreviewComponent
 *   platform="instagram"
 *   imageUrl="/story.jpg"
 *   caption="¡Ofertas especiales hoy!"
 *   variant="story"
 * />
 *
 * @example
 * // Vista previa de Facebook
 * <SocialMediaPreviewComponent
 *   platform="facebook"
 *   imageUrl="/announcement.jpg"
 *   caption="Grandes noticias para nuestros clientes"
 *   variant="full"
 * />
 *
 * @example
 * // Vista previa de TikTok
 * <SocialMediaPreviewComponent
 *   platform="tiktok"
 *   imageUrl="/video-thumbnail.jpg"
 *   caption="Tutorial rápido #howto"
 *   variant="full"
 * />
 *
 * @example
 * // Vista previa de Twitter
 * <SocialMediaPreviewComponent
 *   platform="twitter"
 *   imageUrl="/news.jpg"
 *   caption="Lanzamos nueva característica 🚀"
 *   variant="full"
 * />
 */
export const SocialMediaPreviewComponent: React.FC<SocialMediaPreviewProps> = ({
	translations: customTranslations = {},
	...props
}) => {
	const { t } = useTranslate();

	// Crear traducciones usando el sistema i18n con fallbacks
	const systemTranslations: SocialMediaPreviewTranslations = {
		username: t(translationKeys.username, fallbackTranslations.username),
		sendMessage: t(
			translationKeys.sendMessage,
			fallbackTranslations.sendMessage
		),
		viewMore: t(translationKeys.viewMore, fallbackTranslations.viewMore),
		viewLess: t(translationKeys.viewLess, fallbackTranslations.viewLess),
		timeAgo: t(translationKeys.timeAgo, fallbackTranslations.timeAgo),
		imageAlt: t(translationKeys.imageAlt, fallbackTranslations.imageAlt),
	};

	// Combinar traducciones del sistema con las personalizadas
	const finalTranslations = { ...systemTranslations, ...customTranslations };

	// Usar el componente publicado de @beweco/aurora-ui
	return <AuraSocialMediaPreview {...props} translations={finalTranslations} />;
};
