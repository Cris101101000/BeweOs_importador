import type { ISchedule } from "@settings/bussinesConfig/domain/interfaces/schedule.interface";
import { GetSchedulesUseCase } from "@settings/schedules/application/get-schedules.usecase";
import { CalendarAdapter } from "@settings/schedules/infrastructure/adapters/calendar.adapter";
import { useCallback, useEffect, useState } from "react";

export const useGetSchedules = () => {
	const [schedules, setSchedules] = useState<ISchedule | null>(null);
	const [timezone, setTimezone] = useState<string>("UTC");
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchSchedules = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			const calendarAdapter = new CalendarAdapter();
			const getSchedulesUseCase = new GetSchedulesUseCase(calendarAdapter);

			const response = await getSchedulesUseCase.execute();

			setSchedules(response.schedules);
			setTimezone(response.timezone);
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Error desconocido al obtener los horarios";
			setError(errorMessage);
			console.error("Error fetching schedules:", err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchSchedules();
	}, [fetchSchedules]);

	return {
		schedules,
		timezone,
		isLoading,
		error,
		refetch: fetchSchedules, // Función para refrescar los datos
	};
};
