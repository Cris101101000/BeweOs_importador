import {
	Button,
	Card,
	CardBody,
	IconComponent,
	Image,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Tooltip,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import { useState } from "react";
import type { FC } from "react";
import { EditContentModal } from "./edit-content-modal.component";
import type { ProposedContentItem } from "./proposed-content-cards.component";

export interface ProposedContentCardItemProps {
	item: ProposedContentItem;
	onApprove: (item: ProposedContentItem) => void;
	onDiscard: (item: ProposedContentItem) => void;
	onPreview: () => void;
	isLoading?: boolean;
}

const getContentTypeIcon = (
	contentType: ProposedContentItem["contentType"]
) => {
	switch (contentType) {
		case "instagram-post":
			return (
				<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
				</svg>
			);
		case "instagram-story":
			return (
				<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
					<circle
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="2"
						fill="none"
					/>
					<circle cx="12" cy="12" r="3" fill="currentColor" />
				</svg>
			);
		case "tiktok-video":
			return (
				<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
					<path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
				</svg>
			);
		default:
			return (
				<svg
					className="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
			);
	}
};

const getChannelInfo = (contentType: ProposedContentItem["contentType"]) => {
	switch (contentType) {
		case "instagram-post":
			return {
				label: "Instagram Post",
				color: "bg-gradient-to-r from-purple-500 to-pink-500",
				textColor: "text-white",
			};
		case "instagram-story":
			return {
				label: "Instagram Story",
				color: "bg-gradient-to-r from-purple-600 to-blue-500",
				textColor: "text-white",
			};
		case "tiktok-video":
			return {
				label: "TikTok Video",
				color: "bg-black",
				textColor: "text-white",
			};
		default:
			return {
				label: "Contenido",
				color: "bg-gray-500",
				textColor: "text-white",
			};
	}
};

export const ProposedContentCardItem: FC<ProposedContentCardItemProps> = ({
	item,
	onApprove,
	onDiscard,
	onPreview,
	isLoading = false,
}) => {
	const { t } = useTranslate();
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);

	// Truncate text to show preview
	const maxLength = 80;
	const displayText =
		item.text.length > maxLength
			? item.text.substring(0, maxLength) + "..."
			: item.text;

	const channelInfo = getChannelInfo(item.contentType);

	return (
		<Card className="w-full shadow-sm border hover:shadow-md transition-shadow group relative">
			<CardBody className="p-3">
				{/* Channel Label */}
				<div className="mb-2">
					<span
						className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${channelInfo.color} ${channelInfo.textColor}`}
					>
						<span className="mr-1">{getContentTypeIcon(item.contentType)}</span>
						{channelInfo.label}
					</span>
				</div>

				<div className="flex gap-3 h-full">
					{/* Left side: Image */}
					<div className="flex-shrink-0">
						<Image
							src={item.imageUrl}
							alt="Contenido propuesto"
							className="w-16 h-16 object-cover rounded-lg"
							loading="lazy"
						/>
					</div>

					{/* Center: Content */}
					<div className="flex-1 min-w-0 flex flex-col justify-center">
						{/* Proposed Text Content */}
						<div>
							<h4 className="text-xs font-medium text-gray-700 mb-1">
								{t("proposed_content_caption", "Texto del post:")}
							</h4>
							<div className="space-y-1">
								<p className="text-sm text-gray-800 leading-snug whitespace-pre-wrap">
									{displayText}
								</p>
							</div>

							{/* Action Button */}
							<div className="mt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<Button
									size="sm"
									color="primary"
									variant="flat"
									onPress={() => setShowEditModal(true)}
									isDisabled={isLoading}
									startContent={
										<IconComponent
											icon="solar:document-add-bold"
											className="w-3.5 h-3.5"
										/>
									}
								>
									{t("proposed_content_use", "Utilizar contenido")}
								</Button>
							</div>
						</div>
					</div>

					{/* Management Icons - Right side with consistent Linda behavior style */}
					<div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
						{/* View/Preview Button */}
						<Tooltip content={t("proposed_content_view", "Ver contenido")}>
							<Button
								isIconOnly
								size="sm"
								variant="light"
								color="default"
								className="!min-w-0"
								onPress={onPreview}
								isDisabled={isLoading}
							>
								<IconComponent
									icon="solar:eye-outline"
									className="w-4 h-4 text-default-500"
								/>
							</Button>
						</Tooltip>

						{/* Delete Button */}
						<Tooltip
							content={t("proposed_content_discard", "Eliminar contenido")}
						>
							<Button
								isIconOnly
								size="sm"
								variant="light"
								color="danger"
								className="!min-w-0"
								onPress={() => setShowDeleteModal(true)}
								isDisabled={isLoading}
							>
								<IconComponent
									icon="solar:trash-bin-minimalistic-outline"
									className="w-4 h-4 text-danger-500"
								/>
							</Button>
						</Tooltip>
					</div>
				</div>
			</CardBody>

			{/* Edit Content Modal */}
			<EditContentModal
				isOpen={showEditModal}
				onClose={() => setShowEditModal(false)}
				content={item}
				onSave={(updatedContent, channels) => {
					console.log("Contenido actualizado:", updatedContent);
					console.log("Canales seleccionados:", channels);
					onApprove(item);
					// TODO: Implement actual save logic with updated content and channels
				}}
			/>

			{/* Delete Confirmation Modal */}
			<Modal
				isOpen={showDeleteModal}
				onOpenChange={setShowDeleteModal}
				size="sm"
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>
								<h3 className="text-lg font-semibold text-gray-900">
									{t("proposed_content_delete_title", "Confirmar eliminación")}
								</h3>
							</ModalHeader>
							<ModalBody>
								<div className="space-y-4">
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
											<IconComponent
												icon="solar:trash-bin-minimalistic-bold"
												size="md"
												className="text-red-600"
											/>
										</div>
										<div className="flex-1">
											<p className="text-sm text-gray-900">
												{t(
													"proposed_content_delete_message",
													"¿Estás seguro de que quieres eliminar esta sugerencia de contenido?"
												)}
											</p>
										</div>
									</div>
									<div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
										<div className="flex items-start gap-2">
											<IconComponent
												icon="solar:info-circle-bold"
												size="sm"
												className="text-amber-600 mt-0.5"
											/>
											<div>
												<p className="text-xs text-amber-800">
													{t(
														"proposed_content_delete_warning",
														"Esta acción no se puede deshacer. Perderás esta sugerencia de contenido permanentemente."
													)}
												</p>
											</div>
										</div>
									</div>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button variant="light" onPress={onClose}>
									{t("button_cancel")}
								</Button>
								<Button
									color="danger"
									onPress={() => {
										onDiscard(item);
										onClose();
									}}
								>
									{t("button_delete")}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</Card>
	);
};
