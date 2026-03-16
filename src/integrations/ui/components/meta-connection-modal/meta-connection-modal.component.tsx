import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	P,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";

interface MetaConnectionModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConnect: () => void | Promise<void>;
	platformName: string;
	isLoading?: boolean;
}

const MetaConnectionModal: FC<MetaConnectionModalProps> = ({
	isOpen,
	onClose,
	onConnect,
	platformName,
	isLoading = false,
}) => {
	const { t } = useTranslate();

	// Wrap async handler to avoid type errors with onPress
	const handleConnect = () => {
		void onConnect();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="2xl"
			placement="center"
			isDismissable={!isLoading}
			hideCloseButton
			classNames={{
				body: "px-6 pt-4 pb-8",
				footer: "pt-0 pb-4 px-6",
			}}
		>
			<ModalContent>
				<ModalHeader className="flex flex-col p-6 pb-0">
					<h2 className="text-xl font-semibold text-default-900">
						{t("integrations_connect_title", "Conectar {platform}", {
							platform: platformName,
						})}
					</h2>
					<P className="text-small text-default-500 font-normal mt-1">
						{t(
							"integrations_connect_description",
							"Sigue los pasos para vincular tu cuenta de {platform} con BeweOS.",
							{ platform: platformName }
						)}
					</P>
				</ModalHeader>

				<ModalBody className="px-6 pt-4 pb-8">
					<div className="flex flex-col gap-4">
						{/* Tutorial Image Placeholder */}
						<div className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-zinc-200 overflow-hidden shadow-sm flex items-center justify-center py-16">
							<div className="text-center space-y-3">
								<div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
									<svg
										className="w-8 h-8 text-blue-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
										/>
									</svg>
								</div>
								<p className="text-sm text-zinc-600 font-medium">
									Tutorial de integración con Meta
								</p>
							</div>
						</div>

						<div className="text-center space-y-2 mt-2">
							<p className="text-sm text-zinc-500 max-w-md mx-auto">
								Serás redirigido al portal seguro de Meta para autorizar la
								conexión.
							</p>
						</div>
					</div>
				</ModalBody>

				<ModalFooter className="flex px-6 pb-4 pt-0 gap-3">
					<Button
						color="default"
						variant="flat"
						onPress={onClose}
						className="flex-1"
						isDisabled={isLoading}
					>
						{t("button_cancel", "Cancelar")}
					</Button>
					<Button
						color="primary"
						onPress={handleConnect}
						className="flex-1"
						isLoading={isLoading}
					>
						{isLoading ? "Iniciando..." : "Empezar la vinculación"}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default MetaConnectionModal;
