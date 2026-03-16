import { useEffect, useMemo, useState } from "react";
import {
	GrandFinalePhase,
	SUMMARY_SLIDES,
	TOTAL_INTERNAL_SCREENS,
	MILESTONES,
} from "src/onboarding/domain/automation-grand-finale";

export const useAutomationGrandFinale = () => {
	const [phase, setPhase] = useState<GrandFinalePhase>(GrandFinalePhase.ALWAYS_ON);

	const activeSlide = useMemo(
		() => SUMMARY_SLIDES.find((slide) => slide.id === phase),
		[phase]
	);

	const currentInternalScreen = useMemo(() => {
		switch (phase) {
			case GrandFinalePhase.ALWAYS_ON:
				return 1;
			case GrandFinalePhase.SMART_CRM:
				return 2;
			case GrandFinalePhase.AUTOMATION:
				return 3;
			case GrandFinalePhase.FINAL:
				return 4;
			default:
				return 1;
		}
	}, [phase]);

	const progressPercentage =
		(currentInternalScreen / TOTAL_INTERNAL_SCREENS) * 100;

	useEffect(() => {
		const nextPhaseMap: Partial<Record<GrandFinalePhase, GrandFinalePhase>> = {
			[GrandFinalePhase.ALWAYS_ON]: GrandFinalePhase.SMART_CRM,
			[GrandFinalePhase.SMART_CRM]: GrandFinalePhase.AUTOMATION,
			[GrandFinalePhase.AUTOMATION]: GrandFinalePhase.FINAL,
		};

		const next = nextPhaseMap[phase];
		if (!next) {
			return;
		}

		const timer = setTimeout(() => {
			setPhase(next);
		}, 4500);

		return () => clearTimeout(timer);
	}, [phase]);

	const assistantSpeech = useMemo(() => {
		if (phase === GrandFinalePhase.FINAL) {
			return "Todo esta listo. Tu onboarding termina y Linda queda activada para empezar a vender.";
		}
		return activeSlide?.lindaSpeech ?? "";
	}, [phase, activeSlide]);

	return {
		phase,
		activeSlide,
		currentInternalScreen,
		progressPercentage,
		assistantSpeech,
		milestones: MILESTONES,
		totalInternalScreens: TOTAL_INTERNAL_SCREENS,
	};
};
