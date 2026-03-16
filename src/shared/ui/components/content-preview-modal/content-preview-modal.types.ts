import type { PreviewVariant, SocialPlatform } from "@shared/ui/components";
import type { ReactNode } from "react";

/**
 * Props para el componente ContentPreviewModal
 */
export interface ContentPreviewModalProps {
	/** Indica si el modal está abierto */
	isOpen: boolean;

	/** Callback para cerrar el modal */
	onClose: () => void;

	/** Plataforma de red social */
	platform: SocialPlatform;

	/** URL de la imagen del contenido */
	imageUrl: string;

	/** Texto del caption/descripción */
	caption: string;

	/** Título del contenido (opcional) */
	title?: string;

	/** Variante del preview (opcional, por defecto "full") */
	variant?: PreviewVariant;

	/** Mostrar header del preview de Instagram/red social (opcional, por defecto true) */
	showHeader?: boolean;

	/** Mostrar header del modal con título (opcional, por defecto true) */
	showModalHeader?: boolean;

	/** Contenido adicional para el footer (botones de acción personalizados) */
	footerActions?: ReactNode;

	/** Tamaño del modal (opcional, por defecto "2xl") */
	size?:
		| "xs"
		| "sm"
		| "md"
		| "lg"
		| "xl"
		| "2xl"
		| "3xl"
		| "4xl"
		| "5xl"
		| "full";
}
