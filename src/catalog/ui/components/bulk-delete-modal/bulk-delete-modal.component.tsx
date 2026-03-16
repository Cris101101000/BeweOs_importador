import {
	Button,
	H2,
	H4,
	IconComponent,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	P,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { EnumCatalogType } from "../../../domain/enums/catalog-type.enum";
import type { ICatalogItem } from "../../../domain/interfaces/catalog.interface";

interface BulkDeleteModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	selectedItems: ICatalogItem[];
	isDeleting?: boolean;
	type: EnumCatalogType;
}

const BulkDeleteModal: FC<BulkDeleteModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	selectedItems,
	isDeleting = false,
	type,
}) => {
	const { t } = useTranslate();

	const itemCount = selectedItems.length;
	const isProduct = type === EnumCatalogType.Product;
	const itemType = isProduct ? "producto" : "servicio";
	const itemTypePlural = isProduct ? "productos" : "servicios";

	const getTitle = () => {
		if (itemCount === 1) {
			return t("bulk_delete_single_title", `Eliminar ${itemType}`);
		}
		return t(
			"bulk_delete_multiple_title",
			`Eliminar ${itemCount} ${itemTypePlural}`
		);
	};

	const getDescription = () => {
		if (itemCount === 1) {
			const itemName = selectedItems[0]?.name || "";
			return t(
				"bulk_delete_single_description",
				`¿Estás seguro de que deseas eliminar el ${itemType} "${itemName}"? Esta acción no se puede deshacer.`
			);
		}
		return t(
			"bulk_delete_multiple_description",
			`¿Estás seguro de que deseas eliminar los ${itemCount} ${itemTypePlural} seleccionados? Esta acción no se puede deshacer.`
		);
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("es-CO", {
			style: "currency",
			currency: "COP",
			minimumFractionDigits: 0,
		}).format(price);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="lg"
			placement="center"
			isDismissable={!isDeleting}
			hideCloseButton
			scrollBehavior="inside"
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex flex-col p-6 pb-0">
							<H2 className="text-xl font-semibold text-danger-600">
								{getTitle()}
							</H2>
							<P className="text-small text-default-500 font-normal mt-1">
								{t("bulk_delete_warning", "Esta acción es permanente")}
							</P>
						</ModalHeader>

						<ModalBody className="p-6 pt-4">
							<P className="text-sm text-default-700 mb-4 leading-relaxed">
								{getDescription()}
							</P>

							{/* Lista de items a eliminar */}
							<div className="bg-default-50 rounded-lg p-4 mb-4">
								<H4 className="text-sm font-medium text-default-700 mb-3">
									{t("bulk_delete_items_list", `${itemTypePlural} a eliminar:`)}
								</H4>
								<div
									className={
										itemCount > 2
											? "space-y-2 max-h-32 overflow-y-auto pr-2"
											: "space-y-2"
									}
									style={itemCount > 2 ? { scrollbarWidth: "thin" } : undefined}
								>
									{selectedItems.map((item) => (
										<div
											key={item.id}
											className="flex items-center justify-between py-2 px-3 bg-white rounded border border-default-200"
										>
											<div className="flex-1 min-w-0 pr-3">
												<P className="text-sm font-medium text-default-900 truncate">
													{item.name}
												</P>
											</div>
											<div className="text-xs font-medium text-default-700 flex-shrink-0">
												{formatPrice(item.price)}
											</div>
										</div>
									))}
								</div>
							</div>

							<div className="bg-warning-50 border border-warning-200 rounded-lg p-3">
								<div className="flex items-start gap-2">
									<IconComponent
										icon="solar:danger-triangle-linear"
										className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5"
										size="sm"
									/>
									<div>
										<P className="text-sm font-medium text-warning-800">
											{t("bulk_delete_final_warning", "¡Atención!")}
										</P>
										<P className="text-sm text-warning-700 leading-relaxed">
											{t(
												"bulk_delete_irreversible",
												"Esta acción eliminará permanentemente los elementos seleccionados y no se puede deshacer."
											)}
										</P>
									</div>
								</div>
							</div>
						</ModalBody>
						<ModalFooter className="flex p-6 pt-0 gap-3">
							<Button
								color="default"
								variant="flat"
								onPress={onClose}
								className="flex-1"
								isDisabled={isDeleting}
							>
								{t("button_cancel", "Cancelar")}
							</Button>
							<Button
								color="danger"
								onPress={onConfirm}
								className="flex-1"
								isLoading={isDeleting}
								startContent={
									!isDeleting && (
										<IconComponent
											icon="solar:trash-bin-minimalistic-linear"
											className="w-4 h-4"
											size="sm"
										/>
									)
								}
							>
								{isDeleting
									? t("bulk_delete_deleting", "Eliminando...")
									: t(
											"bulk_delete_confirm",
											`Eliminar ${itemCount === 1 ? itemType : itemTypePlural}`
										)}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default BulkDeleteModal;
