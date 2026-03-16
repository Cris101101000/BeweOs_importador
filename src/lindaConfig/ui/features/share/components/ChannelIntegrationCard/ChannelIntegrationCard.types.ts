import type React from "react";

export type ChannelType = "web" | "instagram" | "whatsapp";

export interface Step1Config {
	/** Título cuando el canal está activo */
	activeTitle: string;
	/** Título cuando el canal no está activo */
	inactiveTitle: string;
	/** Tooltip content (opcional) */
	tooltipContent?: React.ReactNode;
	/** Configuración del botón de acción */
	actionButton: {
		label: string;
		activeLabel?: string;
		icon: string;
		activeIcon?: string;
		onPress: () => void;
		/** Si el botón cambia de estilo cuando está activo */
		variant?: "solid" | "flat";
		activeVariant?: "solid" | "flat";
		/** Color del botón */
		color?: "primary" | "success";
		activeColor?: "primary" | "success";
	};
}

export interface ChannelIntegrationCardProps {
	/** Tipo de canal */
	channelType: ChannelType;
	/** Título del card (ej: "Integración Web") */
	title: string;
	/** Si el canal está integrado/activo */
	isChannelActive: boolean;
	/** Configuración del paso 1 */
	step1Config: Step1Config;
	/** Callback para volver atrás */
	onBack: () => void;
	/** Link para compartir (se codifica en el QR) */
	shareLink?: string;
	/** Callback para descargar QR */
	onDownloadQR?: () => void;
	/** Callback para copiar link */
	onCopyLink?: () => void;
}
