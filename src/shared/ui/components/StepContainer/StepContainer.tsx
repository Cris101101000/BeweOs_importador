import type { StepContainerProps } from "./StepContainer.types";

/**
 * StepContainer - Componente genérico para estructurar los steps de un wizard
 *
 * Proporciona una estructura consistente con header, body y footer para cada step.
 *
 * @example
 * ```tsx
 * <StepContainer
 *   header={
 *     <div className="text-center">
 *       <H3>Título del Step</H3>
 *       <p>Descripción opcional</p>
 *     </div>
 *   }
 *   footer={
 *     <div className="flex justify-between gap-3">
 *       <Button onPress={handleBack}>Atrás</Button>
 *       <Button onPress={handleNext} color="primary">Siguiente</Button>
 *     </div>
 *   }
 * >
 *   <div>Contenido del step...</div>
 * </StepContainer>
 * ```
 */
export const StepContainer: React.FC<StepContainerProps> = ({
	header,
	children,
	footer,
	className = "",
	headerClassName = "",
	bodyClassName = "",
	footerClassName = "",
}) => {
	return (
		<div
			className={`flex flex-col min-h-[500px] max-w-3xl mx-auto w-full ${className}`}
		>
			{/* Header */}
			{header && <div className={`mb-6 ${headerClassName}`}>{header}</div>}

			{/* Body */}
			<div className={`flex-1 space-y-6 ${bodyClassName}`}>{children}</div>

			{/* Footer */}
			{footer && (
				<div
					className={`flex justify-between items-center gap-3 pt-6 pb-4 border-t border-divider mt-6 ${footerClassName}`}
				>
					{footer}
				</div>
			)}
		</div>
	);
};
