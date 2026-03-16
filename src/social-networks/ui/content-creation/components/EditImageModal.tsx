/**
 * EditImageModal Component
 * Modal para editar imágenes generadas por IA
 */

import { useState } from "react";
import {
	H4,
	P,
	Button,
	Textarea,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";

interface EditImageModalProps {
	isOpen: boolean;
	onClose: () => void;
	onEdit: (prompt: string, imageUrls: string[]) => Promise<void>;
	isLoading?: boolean;
}

export function EditImageModal({
	isOpen,
	onClose,
	onEdit,
	isLoading = false,
}: EditImageModalProps) {
	const { t } = useTranslate();
	const [prompt, setPrompt] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [imageUrls, setImageUrls] = useState<string[]>([]);

	const handleAddImageUrl = () => {
		if (imageUrl.trim() && !imageUrls.includes(imageUrl.trim())) {
			setImageUrls([...imageUrls, imageUrl.trim()]);
			setImageUrl("");
		}
	};

	const handleRemoveImageUrl = (urlToRemove: string) => {
		setImageUrls(imageUrls.filter((url) => url !== urlToRemove));
	};

	const handleSubmit = async () => {
		if (!prompt.trim()) {
			return;
		}

		try {
			await onEdit(prompt.trim(), imageUrls);
			// Reset form after successful edit
			setPrompt("");
			setImageUrl("");
			setImageUrls([]);
		} catch (error) {
			// Si hay error, mantener el formulario para que el usuario pueda corregir
			// El error ya fue manejado en el componente padre
		}
	};

	const handleClose = () => {
		if (!isLoading) {
			setPrompt("");
			setImageUrl("");
			setImageUrls([]);
			onClose();
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size="2xl"
			placement="center"
			isDismissable={!isLoading}
			hideCloseButton={false}
			scrollBehavior="inside"
			classNames={{
				base: "max-h-[80vh]",
			}}
		>
			<ModalContent>
				<ModalHeader className="flex flex-col p-6 pb-0">
					<H4 className="text-xl font-semibold text-default-900">
						{t("edit_image_modal_title", "Editar imagen con IA")}
					</H4>
					<P className="text-small text-default-500 font-normal mt-1">
						{t(
							"edit_image_modal_description",
							"Describe cómo quieres editar la imagen. Puedes agregar URLs de imágenes de referencia para cambiar productos o elementos."
						)}
					</P>
				</ModalHeader>
				<ModalBody className="px-6 pt-4 pb-6">
					<div className="space-y-6">
						{/* Prompt Input */}
						<div>
							<Textarea
								label={t(
									"edit_image_prompt_label",
									"¿Cómo quieres editar la imagen?"
								)}
								placeholder={t(
									"edit_image_prompt_placeholder",
									"Ej: Cambia el color de fondo a azul y reemplaza el producto por el de la imagen de referencia"
								)}
								value={prompt}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setPrompt(e.target.value)
								}
								minRows={4}
								isDisabled={isLoading}
								isRequired
							/>
						</div>

						{/* Image URLs Section */}
						<div>
							<P className="text-sm text-default-600 mb-2">
								{t(
									"edit_image_urls_label",
									"URLs de imágenes de referencia (opcional)"
								)}
							</P>
							<div className="flex gap-2 mb-3">
								<Input
									placeholder={t(
										"edit_image_url_placeholder",
										"https://ejemplo.com/imagen.jpg"
									)}
									value={imageUrl}
									onValueChange={setImageUrl}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											handleAddImageUrl();
										}
									}}
									isDisabled={isLoading}
									className="flex-1"
								/>
								<Button
									onPress={handleAddImageUrl}
									variant="bordered"
									size="md"
									isDisabled={!imageUrl.trim() || isLoading}
								>
									{t("add", "Agregar")}
								</Button>
							</div>

							{/* List of added URLs */}
							{imageUrls.length > 0 && (
								<div className="space-y-2">
									{imageUrls.map((url, index) => (
										<div
											key={index}
											className="flex items-center justify-between p-2 bg-default-50 rounded-md border border-default-200"
										>
											<span className="text-sm text-default-700 truncate flex-1 mr-2">
												{url}
											</span>
											<Button
												isIconOnly
												size="sm"
												variant="light"
												onPress={() => handleRemoveImageUrl(url)}
												isDisabled={isLoading}
												className="flex-shrink-0"
											>
												×
											</Button>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</ModalBody>
				<ModalFooter className="flex justify-end gap-2 border-t border-divider px-6 py-4">
					<Button
						variant="light"
						size="md"
						onPress={handleClose}
						isDisabled={isLoading}
					>
						{t("cancel", "Cancelar")}
					</Button>
					<Button
						color="primary"
						variant="solid"
						size="md"
						onPress={handleSubmit}
						isLoading={isLoading}
						isDisabled={!prompt.trim() || isLoading}
					>
						{t("edit_image_button", "Editar imagen")}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

