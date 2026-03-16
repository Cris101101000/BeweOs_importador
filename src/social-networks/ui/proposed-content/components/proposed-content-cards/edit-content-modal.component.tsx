import {
	Button,
	IconComponent,
	Image,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import { type FC, useEffect, useState } from "react";
import type { ProposedContentItem } from "./proposed-content-cards.component";

export interface EditContentModalProps {
	isOpen: boolean;
	onClose: () => void;
	content: ProposedContentItem | null;
	onSave: (content: ProposedContentItem, channels: string[]) => void;
}

export const EditContentModal: FC<EditContentModalProps> = ({
	isOpen,
	onClose,
	content,
	onSave,
}) => {
	const { t } = useTranslate();
	const [editedText, setEditedText] = useState(content?.text || "");

	// Update when content changes
	useEffect(() => {
		if (content) {
			setEditedText(content.text);
		}
	}, [content]);

	const handleSave = () => {
		if (content) {
			const updatedContent = {
				...content,
				text: editedText,
			};
			// Solo usa el canal original del contenido
			onSave(updatedContent, [content.contentType]);
			onClose();
		}
	};

	const characterCount = editedText.length;
	const isValid = editedText.trim().length > 0;

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onClose}
			size="3xl"
			scrollBehavior="inside"
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							<h3 className="text-xl font-semibold text-gray-900">
								{t("social_networks_edit_modal_title")}
							</h3>
							<p className="text-sm text-gray-500 font-normal">
								{t("social_networks_edit_modal_subtitle")}
							</p>
						</ModalHeader>

						<ModalBody>
							<div className="space-y-6">
								{/* Image Preview */}
								{content?.imageUrl && (
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											{t("social_networks_edit_modal_image_label")}
										</label>
										<div className="relative w-full max-w-sm">
											<Image
												src={content.imageUrl}
												alt={t("social_networks_edit_modal_image_label")}
												className="w-full h-48 object-cover rounded-lg"
											/>
										</div>
									</div>
								)}

								{/* Content Editor */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										{t("social_networks_edit_modal_content_label")}
									</label>
									<textarea
										value={editedText}
										onChange={(e) => setEditedText(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
										rows={8}
										placeholder={t("social_networks_edit_modal_placeholder")}
									/>
									<div className="flex justify-between items-center mt-2">
										<p className="text-xs text-gray-500">
											{t("social_networks_edit_modal_edit_hint")}
										</p>
										<p
											className={`text-xs ${characterCount > 2200 ? "text-danger-500" : "text-gray-500"}`}
										>
											{characterCount} {t("social_networks_edit_modal_characters")}
										</p>
									</div>
								</div>
							</div>
						</ModalBody>

						<ModalFooter>
							<Button variant="light" onPress={onClose}>
								{t("button_cancel")}
							</Button>
							<Button
								color="primary"
								onPress={handleSave}
								isDisabled={!isValid}
								startContent={
									<IconComponent
										icon="solar:check-circle-bold"
										className="w-4 h-4"
									/>
								}
							>
								{t("social_networks_edit_modal_save_publish")}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
