import type { IBasicInfo } from "../../client-creation-wizard.types";

export interface BasicInfoStepProps {
	data: IBasicInfo;
	onUpdate: (data: IBasicInfo) => void;
	stepIndex: number;
}

export type FormBasicInfo = IBasicInfo;
