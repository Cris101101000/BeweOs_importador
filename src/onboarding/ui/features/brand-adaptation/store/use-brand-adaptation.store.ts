import type { BrandAdaptationState } from "src/onboarding/domain/brand-adaptation/interfaces/brand-adaptation-state.interface";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BrandAdaptationStore {
	state: BrandAdaptationState;
	setAdaptationConfirmed: (isAdaptationConfirmed: boolean) => void;
	resetState: () => void;
}

const initialState: BrandAdaptationState = {
	isAdaptationConfirmed: false,
};

export const useBrandAdaptationStore = create<BrandAdaptationStore>()(
	persist(
		(set) => ({
			state: initialState,
			setAdaptationConfirmed: (isAdaptationConfirmed) =>
				set({
					state: {
						isAdaptationConfirmed,
					},
				}),
			resetState: () => set({ state: initialState }),
		}),
		{
			name: "onboarding-brand-adaptation-store",
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);
