import type { EnumClientStatus } from "@clients/domain/enums/client-status.enum";

export interface StatusStepProps {
	data: EnumClientStatus;
	onUpdate: (data: EnumClientStatus) => void;
	stepIndex: number;
}

export type FormStatusInfo = {
	status: EnumClientStatus;
};
