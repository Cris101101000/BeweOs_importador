import type { IClientCreationFormData } from "@shared/ui/components/client-creation-wizard/client-creation-wizard.types";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
import { ClientCreationWizard } from "../../components/client-creation-wizard/client-creation-wizard.component";
import { ClientCreationWizardContext } from "../../contexts/client-creation-wizard-context/client-creation-wizard.context";

export const ClientCreationWizardProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [onSuccessCallback, setOnSuccessCallback] = useState<
		((client: IClientCreationFormData) => void) | null
	>(null);

	const openWizard = useCallback(
		(onSuccess?: (client: IClientCreationFormData) => void) => {
			setOnSuccessCallback(() => onSuccess);
			setIsOpen(true);
		},
		[]
	);

	const closeWizard = useCallback(() => {
		setIsOpen(false);
		setOnSuccessCallback(null);
	}, []);

	const handleSuccess = useCallback(
		(client: IClientCreationFormData) => {
			if (onSuccessCallback) {
				onSuccessCallback(client);
			}
			closeWizard();
		},
		[onSuccessCallback, closeWizard]
	);

	const value = useMemo(
		() => ({
			isOpen,
			openWizard,
			closeWizard,
		}),
		[isOpen, openWizard, closeWizard]
	);

	return (
		<ClientCreationWizardContext.Provider value={value}>
			{children}
			<ClientCreationWizard
				isOpen={isOpen}
				onClose={closeWizard}
				onSuccess={handleSuccess}
			/>
		</ClientCreationWizardContext.Provider>
	);
};
