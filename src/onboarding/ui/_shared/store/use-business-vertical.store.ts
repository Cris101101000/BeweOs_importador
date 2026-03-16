import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BusinessVerticalStore {
	selectedVertical: string | null;
	setSelectedVertical: (vertical: string) => void;
	reset: () => void;
}

export const useBusinessVerticalStore = create<BusinessVerticalStore>()(
	persist(
		(set) => ({
			selectedVertical: null,
			setSelectedVertical: (vertical) => set({ selectedVertical: vertical }),
			reset: () => set({ selectedVertical: null }),
		}),
		{
			name: "onboarding-business-vertical-store",
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);
