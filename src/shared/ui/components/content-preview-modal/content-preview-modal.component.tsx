import {
	H4,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@beweco/aurora-ui";
import { SocialMediaPreviewComponent } from "@shared/ui/components";
import type { ContentPreviewModalProps } from "./content-preview-modal.types";

/**
 * ContentPreviewModal - Modal compartido para vista previa de contenidos
 *
 * Modal reutilizable que muestra una vista previa de contenidos de redes sociales.
 * Se utiliza en:
 * - Sugerencias de Linda (proposed content)
 * - Historial de contenidos (history table)
 * - Campañas de WhatsApp
 *
 * @example
 * ```tsx
 * // Vista previa con título (por defecto muestra header)
 * <ContentPreviewModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   platform="instagram"
 *   imageUrl={post.imageUrl}
 *   caption={post.description}
 *   title={post.name}
 * />
 *
 * // Vista previa sin header del modal (solo preview)
 * <ContentPreviewModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   platform="instagram"
 *   imageUrl={post.imageUrl}
 *   caption={post.description}
 *   showModalHeader={false}
 * />
 *
 * // Vista previa con acciones en el footer
 * <ContentPreviewModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   platform="instagram"
 *   imageUrl={content.imageUrl}
 *   caption={content.caption}
 *   title={content.title}
 *   footerActions={
 *     <>
 *       <Button color="danger" onPress={handleDelete}>Eliminar</Button>
 *       <Button color="primary" onPress={handleEdit}>Editar</Button>
 *     </>
 *   }
 * />
 * ```
 */
export function ContentPreviewModal({
	isOpen,
	onClose,
	platform,
	imageUrl,
	caption,
	title,
	variant = "full",
	showHeader = true,
	showModalHeader = true,
	footerActions,
	size = "2xl",
}: ContentPreviewModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size={size}
			scrollBehavior="inside"
			classNames={{
				base: "max-h-[90vh]",
			}}
		>
			<ModalContent>
				{showModalHeader && (
					<ModalHeader className="flex flex-col gap-1 border-b border-divider px-6 py-4">
						<H4 className="text-wrap break-words max-w-full">
							{title || "Vista previa del contenido"}
						</H4>
					</ModalHeader>
				)}
				<ModalBody className="flex-1 flex-col gap-3 flex px-6 py-6 overflow-y-auto">
					<div className="flex justify-center w-full">
						<div
							className={`w-full mx-auto ${variant === "story" ? "max-w-[320px]" : "max-w-[400px]"}`}
						>
							<SocialMediaPreviewComponent
								platform={platform}
								imageUrl={imageUrl}
								caption={caption}
								variant={variant}
								showHeader={showHeader}
							/>
						</div>
					</div>
				</ModalBody>
				{footerActions && (
					<ModalFooter className="flex justify-end gap-2 border-t border-divider">
						{footerActions}
					</ModalFooter>
				)}
			</ModalContent>
		</Modal>
	);
}
