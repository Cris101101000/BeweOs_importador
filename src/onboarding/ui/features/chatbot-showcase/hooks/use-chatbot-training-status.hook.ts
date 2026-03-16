import { useCallback, useEffect, useRef, useState } from "react";
import { TrainingStatus } from "src/shared/features/linda/ingestion/domain/enums/training-status.enum";
import { GetTrainingStatus } from "src/shared/features/linda/ingestion/ui/DependencyInjection";

const POLLING_INTERVAL = 10000;

type ChatbotTrainingPhase = "checking" | "training" | "ready";

interface UseChatbotTrainingStatusReturn {
	phase: ChatbotTrainingPhase;
}

export const useChatbotTrainingStatus = (): UseChatbotTrainingStatusReturn => {
	const [phase, setPhase] = useState<ChatbotTrainingPhase>("checking");
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const isPollingRef = useRef(false);

	const stopPolling = useCallback(() => {
		isPollingRef.current = false;
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	const checkStatus = useCallback(async () => {
		if (!isPollingRef.current) return;

		const result = await GetTrainingStatus();

		if (!result.isSuccess) {
			stopPolling();
			setPhase("ready");
			return;
		}

		const response = result.value;

		if (!response.found || !response.execution) {
			stopPolling();
			setPhase("ready");
			return;
		}

		const currentStatus = response.execution.status;
		const statusString = String(currentStatus);

		if (
			statusString === "completed" ||
			currentStatus === TrainingStatus.COMPLETED
		) {
			stopPolling();
			setPhase("ready");
		} else if (
			statusString === "error" ||
			currentStatus === TrainingStatus.ERROR
		) {
			stopPolling();
			setPhase("ready");
		}
	}, [stopPolling]);

	const startPolling = useCallback(() => {
		stopPolling();
		isPollingRef.current = true;
		setPhase("training");

		checkStatus();

		intervalRef.current = setInterval(() => {
			checkStatus();
		}, POLLING_INTERVAL);
	}, [checkStatus, stopPolling]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: startPolling uses refs internally, only needs to run on mount
	useEffect(() => {
		const checkInitial = async () => {
			const result = await GetTrainingStatus();

			if (!result.isSuccess) {
				setPhase("ready");
				return;
			}

			const response = result.value;

			if (
				response.found &&
				response.execution &&
				(String(response.execution.status) === "in_process" ||
					response.execution.status === TrainingStatus.IN_PROGRESS)
			) {
				startPolling();
			} else {
				setPhase("ready");
			}
		};

		checkInitial();
	}, []);

	useEffect(() => {
		return () => {
			stopPolling();
		};
	}, [stopPolling]);

	return { phase };
};
