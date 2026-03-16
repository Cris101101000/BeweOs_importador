import type { Result } from "@shared/domain/errors/Result";
import { useCallback, useEffect, useRef, useState } from "react";
import { TrainingStatus } from "src/shared/features/linda/ingestion/domain/enums/training-status.enum";
import type { GetTrainingStatusError } from "src/shared/features/linda/ingestion/domain/errors/GetTrainingStatusError";
import type { ITrainingStatusResponse } from "src/shared/features/linda/ingestion/domain/interfaces/training";

const POLLING_INTERVAL = 10000; // 10 seconds

interface UseTrainingStatusOptions {
	onComplete?: () => void;
	onError?: () => void;
	getTrainingStatus: () => Promise<
		Result<ITrainingStatusResponse, GetTrainingStatusError>
	>;
}

interface UseTrainingStatusReturn {
	isOpen: boolean;
	status: TrainingStatus | null;
	openModal: () => void;
	startPolling: () => void;
}

export const useTrainingStatus = ({
	onComplete,
	onError,
	getTrainingStatus,
}: UseTrainingStatusOptions): UseTrainingStatusReturn => {
	const [isOpen, setIsOpen] = useState(false);
	const [status, setStatus] = useState<TrainingStatus | null>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const isPollingRef = useRef(false);

	const onCompleteRef = useRef(onComplete);
	const onErrorRef = useRef(onError);
	const getTrainingStatusRef = useRef(getTrainingStatus);

	useEffect(() => {
		onCompleteRef.current = onComplete;
		onErrorRef.current = onError;
		getTrainingStatusRef.current = getTrainingStatus;
	}, [onComplete, onError, getTrainingStatus]);

	const stopPolling = useCallback(() => {
		isPollingRef.current = false;
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	const checkStatus = async () => {
		if (!isPollingRef.current) return;

		const result = await getTrainingStatusRef.current();

		if (!result.isSuccess) {
			console.error("Error checking training status:", result.error);
			stopPolling();
			setIsOpen(false);
			setStatus(null);
			onErrorRef.current?.();
			return;
		}

		const response = result.value;

		if (response?.found && response.execution) {
			const currentStatus = response.execution.status;
			console.log(
				"Current training status:",
				currentStatus,
				"Expected completed:",
				TrainingStatus.COMPLETED
			);

			setStatus(currentStatus);

			const statusString = String(currentStatus);

			if (
				statusString === "completed" ||
				currentStatus === TrainingStatus.COMPLETED
			) {
				console.log("Training completed! Stopping polling...");
				stopPolling();
				// Dar tiempo para mostrar el estado completado antes de cerrar
				setTimeout(() => {
					setIsOpen(false);
					setStatus(null);
					onCompleteRef.current?.();
				}, 1500);
			} else if (
				statusString === "error" ||
				currentStatus === TrainingStatus.ERROR
			) {
				console.log("Training error! Stopping polling...");
				stopPolling();
				// Dar tiempo para mostrar el estado de error antes de cerrar
				setTimeout(() => {
					setIsOpen(false);
					setStatus(null);
					onErrorRef.current?.();
				}, 1500);
			}
		}
	};

	const startPolling = useCallback(() => {
		console.log("Starting training status polling...");
		stopPolling();

		isPollingRef.current = true;

		setStatus(TrainingStatus.IN_PROGRESS);

		checkStatus();

		intervalRef.current = setInterval(() => {
			checkStatus();
		}, POLLING_INTERVAL);
	}, [checkStatus, stopPolling]);

	const openModal = useCallback(() => {
		setIsOpen(true);
		setStatus(null);
	}, []);

	useEffect(() => {
		const checkInitialStatus = async () => {
			const result = await getTrainingStatusRef.current();

			if (result.isSuccess && result.value?.found && result.value.execution) {
				const currentStatus = result.value.execution.status;

				// Si hay un entrenamiento en progreso, abrir modal y comenzar polling
				if (currentStatus === TrainingStatus.IN_PROGRESS) {
					setIsOpen(true);
					startPolling();
				}
			}
		};

		checkInitialStatus();
	}, []); // Solo ejecutar al montar

	useEffect(() => {
		return () => {
			stopPolling();
		};
	}, [stopPolling]);

	return {
		isOpen,
		status,
		openModal,
		startPolling,
	};
};
