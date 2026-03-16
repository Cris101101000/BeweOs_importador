import {
	IconComponent,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
} from "@beweco/aurora-ui";

export interface GeneratingContentModalProps {
	isOpen: boolean;
	onClose: () => void;
}

/**
 * Modal que se muestra mientras se genera contenido a partir de una idea aprobada.
 * Informa al usuario que el contenido aparecerá en el carrusel de contenido propuesto.
 */
export function GeneratingContentModal({
	isOpen,
}: GeneratingContentModalProps) {
	return (
		<Modal isOpen={isOpen} size="md" backdrop="blur" hideCloseButton={true}>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<IconComponent
							icon="solar:star-fall-minimalistic-2-bold"
							className="w-6 h-6 text-violet-600 dark:text-violet-400"
						/>
						<span>Generando contenido</span>
					</div>
				</ModalHeader>
				<ModalBody>
					<div className="flex flex-col items-center gap-4 py-4">
						<IconComponent
							icon="solar:refresh-circle-bold-duotone"
							className="w-16 h-16 text-violet-600 dark:text-violet-400 animate-spin"
						/>
						<div className="text-center">
							<p className="text-base font-medium text-foreground mb-2">
								¡La ideea se esta generando!
							</p>
							<p className="text-sm text-default-600">
								Estamos generando el contenido basado en tu idea. Lo verás en
								el carrusel de
								<span className="font-semibold text-violet-600 dark:text-violet-400">
									{" "}
									contenido propuesto por Linda{" "}
								</span>
								en breve.
							</p>
						</div>
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
