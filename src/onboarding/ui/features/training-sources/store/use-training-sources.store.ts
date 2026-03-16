import type { TrainingSourcesData } from "src/onboarding/domain/training-sources/interfaces/training-sources-data.interface";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TrainingSourcesStore {
	data: TrainingSourcesData;
	setData: (data: Partial<TrainingSourcesData>) => void;
	resetData: () => void;
}

const initialData: TrainingSourcesData = {
	websiteUrl: null,
	uploadedFiles: [],
	textInput: "",
};

export const useTrainingSourcesStore = create<TrainingSourcesStore>()(
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
			name: "onboarding-training-sources-store",
			storage: createJSONStorage(() => sessionStorage),
			partialize: (state) => ({
				data: {
					websiteUrl: state.data.websiteUrl,
					textInput: state.data.textInput,
					uploadedFiles: [],
				},
			}),
		}
	)
);
