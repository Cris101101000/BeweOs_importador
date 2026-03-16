import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { IContentGeneration } from "@shared/features/linda/content-generation";

interface OnboardingContentStore {
	contents: IContentGeneration[];
	isLoaded: boolean;
	error: string | null;
	setContents: (contents: IContentGeneration[]) => void;
	setError: (error: string | null) => void;
	setIsLoaded: (loaded: boolean) => void;
	reset: () => void;
}

export const useOnboardingContentStore = create<OnboardingContentStore>()(
	persist(
		(set) => ({
			contents: [],
			isLoaded: false,
			error: null,
			setContents: (contents) => set({ contents, isLoaded: true, error: null }),
			setError: (error) => set({ error }),
			setIsLoaded: (isLoaded) => set({ isLoaded }),
			reset: () => set({ contents: [], isLoaded: false, error: null }),
		}),
		{
			name: "onboarding-content-store",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
