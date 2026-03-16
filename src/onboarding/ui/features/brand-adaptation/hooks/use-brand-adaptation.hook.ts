import { useBrandAdaptationStore } from "../store";
import { useBrandDefinitionStore } from "src/onboarding/ui/_shared/store";

export const useBrandAdaptation = () => {
	const brandDefinition = useBrandDefinitionStore((state) => state.data);
	const isAdaptationConfirmed = useBrandAdaptationStore(
		(state) => state.state.isAdaptationConfirmed
	);
	const setAdaptationConfirmed = useBrandAdaptationStore(
		(state) => state.setAdaptationConfirmed
	);

	return {
		businessName: brandDefinition.businessName || "Lasa Yoga",
		primaryColor: brandDefinition.primaryColor,
		isAdaptationConfirmed,
		setAdaptationConfirmed,
	};
};
