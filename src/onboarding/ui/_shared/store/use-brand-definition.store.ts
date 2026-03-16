import type { BrandDefinitionData } from "src/onboarding/domain/brand-definition/interfaces/brand-definition-data.interface";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BrandDefinitionStore {
	data: BrandDefinitionData;
	setData: (data: Partial<BrandDefinitionData>) => void;
	resetData: () => void;
}

const initialData: BrandDefinitionData = {
	businessName: "",
	businessDescription: "",
	primaryColor: "#4F46E5",
	secondaryColor: "#EC4899",
	logoUrl: null,
	logoFile: null,
};

export const useBrandDefinitionStore = create<BrandDefinitionStore>()(
	persist(
		(set) => ({
			data: initialData,
			setData: (data) =>
				set((state) => ({
					data: {
						...state.data,
						...data,
					},
				})),
			resetData: () => set({ data: initialData }),
		}),
		{
			name: "onboarding-brand-definition-store",
			storage: createJSONStorage(() => sessionStorage),
			partialize: (state) => ({
				data: {
					businessName: state.data.businessName,
					businessDescription: state.data.businessDescription,
					primaryColor: state.data.primaryColor,
					secondaryColor: state.data.secondaryColor,
					logoUrl: state.data.logoUrl,
					logoFile: null,
				},
			}),
		}
	)
);
