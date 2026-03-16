import type { ReactNode } from "react";

/**
 * Props para el componente StepContainer
 */
export interface StepContainerProps {
	/**
	 * Contenido del header (títulos, descripciones)
	 */
	header?: ReactNode;

	/**
	 * Contenido principal del step
	 */
	children: ReactNode;

	/**
	 * Contenido del footer (botones de acción)
	 */
	footer?: ReactNode;

	/**
	 * Clases adicionales para el contenedor principal
	 */
	className?: string;

	/**
	 * Clases adicionales para el header
	 */
	headerClassName?: string;

	/**
	 * Clases adicionales para el body
	 */
	bodyClassName?: string;

	/**
	 * Clases adicionales para el footer
	 */
	footerClassName?: string;
}
