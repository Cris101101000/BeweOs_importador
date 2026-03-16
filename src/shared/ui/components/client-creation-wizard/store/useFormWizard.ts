import { EnumClientStatus } from "@clients/domain/enums/client-status.enum";
import { EnumCreationChannel } from "@shared/domain/enums/enum-creation-channel.enum";
import { create } from "zustand";
import type {
	IBasicInfo,
	IClientCreationFormData,
	ISegmentInfo,
} from "../client-creation-wizard.types";

interface FormWizardState {
	formData: IClientCreationFormData;
}

interface FormWizardActions {
	setFormData: (data: IClientCreationFormData) => void;
	updateBasicInfo: (data: IBasicInfo) => void;
	updateSegment: (data: ISegmentInfo) => void;
	updateStatus: (status: EnumClientStatus) => void;
	reset: () => void;
}

type FormWizardStore = FormWizardState & FormWizardActions;

const getInitialFormData = (): IClientCreationFormData => ({
	basicInfo: {
		firstName: "",
		lastName: "",
		email: "",
		phone: {
			code: "",
			number: "",
			country: "",
		},
	},
	segment: {
		tagsIA: [],
		creationChannel: EnumCreationChannel.Web,
		birthdate: undefined,
	},
	status: EnumClientStatus.LEAD,
});

export const useFormWizard = create<FormWizardStore>((set) => ({
	formData: getInitialFormData(),

	setFormData: (data) => set({ formData: data }),

	updateBasicInfo: (data) =>
		set((state) => ({ formData: { ...state.formData, basicInfo: data } })),

	updateSegment: (data) =>
		set((state) => ({ formData: { ...state.formData, segment: data } })),

	updateStatus: (status) =>
		set((state) => ({ formData: { ...state.formData, status } })),

	reset: () =>
		set({
			formData: getInitialFormData(),
		}),
}));
