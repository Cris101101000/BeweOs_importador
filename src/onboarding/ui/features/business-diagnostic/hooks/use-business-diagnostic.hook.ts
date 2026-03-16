import { useMemo } from "react";
import {
	calculateDiagnostic,
	type IDiagnosticResult,
} from "src/onboarding/domain/business-diagnostic";
import { ContactRangeId } from "src/onboarding/domain/contact-volume";
import { PainPointId } from "src/onboarding/domain/pain-points";
import { VerticalId } from "src/onboarding/domain/business-vertical";
import {
	useBusinessVerticalStore,
	useContactVolumeStore,
	usePainPointsStore,
} from "src/onboarding/ui/_shared/store";

export const useBusinessDiagnostic = (): IDiagnosticResult => {
	const selectedPainPoints = usePainPointsStore((state) => state.selectedPainPoints);
	const selectedRange = useContactVolumeStore((state) => state.selectedRange);
	const selectedVertical = useBusinessVerticalStore((state) => state.selectedVertical);

	return useMemo(() => {
		const painPoints: PainPointId[] =
			selectedPainPoints.length > 0
				? selectedPainPoints
				: [PainPointId.TIEMPO_RESPUESTA, PainPointId.ORGANIZACION_CONTACTOS, PainPointId.SEGUIMIENTO_MANUAL];
		const contactRange: ContactRangeId = selectedRange ?? ContactRangeId.RANGE_100_300;
		const vertical = (selectedVertical as VerticalId) ?? VerticalId.BELLEZA_CUIDADO_PERSONAL;

		return calculateDiagnostic({
			painPoints,
			contactRange,
			vertical,
		});
	}, [selectedPainPoints, selectedRange, selectedVertical]);
};
