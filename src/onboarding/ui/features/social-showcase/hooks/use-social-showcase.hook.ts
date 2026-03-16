import { useEffect, useRef, useState } from "react";

interface UseSocialShowcaseParams {
	proposalsLength: number;
	onIntegrationClose: () => void;
	onAllProposalsComplete: () => void;
}

export const useSocialShowcase = ({
	proposalsLength,
	onIntegrationClose,
	onAllProposalsComplete,
}: UseSocialShowcaseParams) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isIntegrating, setIsIntegrating] = useState(false);
	const [isInstagramConnected, setInstagramConnected] = useState(false);
	const timeoutIdsRef = useRef<number[]>([]);

	const scheduleTimeout = (callback: () => void, delayMs: number) => {
		const timeoutId = window.setTimeout(callback, delayMs);
		timeoutIdsRef.current.push(timeoutId);
		return timeoutId;
	};

	useEffect(() => {
		return () => {
			for (const timeoutId of timeoutIdsRef.current) {
				window.clearTimeout(timeoutId);
			}
		};
	}, []);

	const handleConfirmIntegration = () => {
		setIsIntegrating(true);

		scheduleTimeout(() => {
			setInstagramConnected(true);
			setIsIntegrating(false);
			onIntegrationClose();

			scheduleTimeout(() => {
				if (currentIndex < proposalsLength - 1) {
					setCurrentIndex((prev) => prev + 1);
					return;
				}
				onAllProposalsComplete();
			}, 300);
		}, 1200);
	};

	const handleSkip = () => {
		if (currentIndex < proposalsLength - 1) {
			setCurrentIndex((prev) => prev + 1);
			return;
		}
		onAllProposalsComplete();
	};

	return {
		currentIndex,
		isIntegrating,
		isInstagramConnected,
		handleConfirmIntegration,
		handleSkip,
	};
};
