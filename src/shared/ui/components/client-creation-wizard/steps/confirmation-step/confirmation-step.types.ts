import type { IClientCreationFormData } from "../../client-creation-wizard.types";

export interface ConfirmationStepProps {
	data: IClientCreationFormData;
	stepIndex: number;
}

export type ConfirmationData = IClientCreationFormData;
