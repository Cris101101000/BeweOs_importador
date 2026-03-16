import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ContactRangeId } from "src/onboarding/domain/contact-volume";

interface ContactVolumeStore {
	selectedRange: ContactRangeId | null;
	setSelectedRange: (range: ContactRangeId) => void;
	reset: () => void;
}

export const useContactVolumeStore = create<ContactVolumeStore>()(
	persist(
		(set) => ({
			selectedRange: null,
			setSelectedRange: (range) => set({ selectedRange: range }),
			reset: () => set({ selectedRange: null }),
		}),
		{
			name: "onboarding-contact-volume-store",
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);
