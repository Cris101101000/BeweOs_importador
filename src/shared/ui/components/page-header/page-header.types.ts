import type { ChipColor } from "@beweco/aurora-ui";
import type { ReactNode } from "react";

export interface PageHeaderMetadataItem {
	/** Identificador único del metadata */
	key: string;
	/** Texto a mostrar en el chip */
	label: string;
	/** Color del chip */
	color?: ChipColor;
	/** Variante del chip */
	variant?: "flat" | "solid" | "bordered" | "light" | "faded" | "shadow" | "dot";
}

export interface PageHeaderProps {
	/** Callback al pulsar "Volver" */
	onBack?: () => void;
	/** Título principal del encabezado */
	title: string;
	/** Metadata chips para mostrar junto al título (ej. estado, etiquetas) */
	metadata?: PageHeaderMetadataItem[];
	/** Action buttons or elements rendered on the right side of the header */
	actions?: ReactNode;
}
