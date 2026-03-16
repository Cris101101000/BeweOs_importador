import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { PainPointId } from "src/onboarding/domain/pain-points";

interface PainPointsStore {
	selectedPainPoints: PainPointId[];
	setSelectedPainPoints: (painPoints: PainPointId[]) => void;
	reset: () => void;
}

const initialSelectedPainPoints: PainPointId[] = [];

export const usePainPointsStore = create<PainPointsStore>()(
	persist(
		(set) => ({
			selectedPainPoints: initialSelectedPainPoints,
			setSelectedPainPoints: (painPoints) => set({ selectedPainPoints: painPoints }),
			reset: () => set({ selectedPainPoints: initialSelectedPainPoints }),
		}),
		{
			name: "onboarding-pain-points-store",
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);
