import type { ISegmentInfo } from "../../client-creation-wizard.types";

export interface SegmentationStepProps {
	data: ISegmentInfo;
	onUpdate: (data: ISegmentInfo) => void;
	stepIndex: number;
}

export type FormSegmentInfo = ISegmentInfo;
