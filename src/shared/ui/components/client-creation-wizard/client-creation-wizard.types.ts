import type { DateValue } from "@beweco/aurora-ui";
import type { EnumClientStatus } from "@clients/domain/enums/client-status.enum";
import type { IAiTag } from "@clients/domain/interfaces/ai-tag.interface";
import type { EnumGender } from "@shared/domain/enums";
import type { EnumCreationChannel } from "@shared/domain/enums/enum-creation-channel.enum";
import type { IPhone } from "@shared/domain/interfaces/phone.interface";

export interface ClientCreationWizardProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: (client: IClientCreationFormData) => void;
}

export interface IClientCreationFormData {
	basicInfo: IBasicInfo;
	segment: ISegmentInfo;
	status: EnumClientStatus;
}

export interface IBasicInfo {
	firstName: string;
	lastName: string;
	email: string;
	phone: IPhone;
}

export type ISegmentInfo = {
	tagsIA?: IAiTag[];
	creationChannel?: EnumCreationChannel;
	birthdate?: DateValue | null;
	gender?: EnumGender;
};
