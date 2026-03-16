import type { IClientCreationFormData } from "@shared/ui/components/client-creation-wizard/client-creation-wizard.types";
import { createContext, useContext } from "react";

export interface ClientCreationWizardContextType {
	isOpen: boolean;
	openWizard: (onSuccess?: (client: IClientCreationFormData) => void) => void;
	closeWizard: () => void;
}

export const ClientCreationWizardContext =
	createContext<ClientCreationWizardContextType | null>(null);

export const useClientCreationWizard = () => {
	const context = useContext(ClientCreationWizardContext);
	if (!context) {
		throw new Error(
			"useClientCreationWizard must be used within a ClientCreationWizardProvider"
		);
	}
	return context;
};
