import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@beweco/aurora-ui";

interface InstagramConnectModalProps {
	isOpen: boolean;
	isIntegrating: boolean;
	onOpenChange: () => void;
	onConfirmIntegration: () => void;
	onClose: () => void;
}

export const InstagramConnectModal = ({
	isOpen,
	isIntegrating,
	onOpenChange,
	onConfirmIntegration,
	onClose,
}: InstagramConnectModalProps) => {
	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			placement="center"
			backdrop="opaque"
			disableAnimation={true}
			classNames={{
				backdrop: "bg-black/50",
				base: "z-[9999]",
				wrapper: "z-[9999]",
			}}
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1 text-center pt-6">
					<div className="mx-auto bg-gradient-to-tr from-[#F09433] via-[#DC2743] to-[#BC1888] p-3 rounded-2xl shadow-lg mb-2">
						<span className="text-3xl text-white">📸</span>
					</div>
					<h3 className="text-2xl font-serif italic px-4 font-normal">
						Conecta el Instagram de tu empresa
					</h3>
				</ModalHeader>
				<ModalBody className="text-center px-8 pb-4">
					<p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
						Linda te propondra contenidos para tus clientes y tu decides cuando publicarlos.
					</p>
				</ModalBody>
				<ModalFooter className="flex flex-col gap-1 pb-6 px-8">
					<Button
						className="w-full rounded-full font-bold text-white bg-gradient-to-r from-[#F09433] via-[#DC2743] to-[#BC1888]"
						onPress={onConfirmIntegration}
						isLoading={isIntegrating}
						size="lg"
					>
						Conectar y publicar
					</Button>
					<Button
						variant="light"
						onPress={onClose}
						className="w-full rounded-full text-gray-500 h-8"
					>
						Ahora no
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
