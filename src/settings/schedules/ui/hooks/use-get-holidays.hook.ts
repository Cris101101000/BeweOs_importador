import { useEffect, useState } from "react";
import { GetHolidaysUseCase } from "../../application/get-holidays.usecase";
import type { IHoliday } from "../../domain/interfaces/holiday.interface";
import { CalendarAdapter } from "../../infrastructure/adapters/calendar.adapter";

/**
 * Hook personalizado para obtener festivos y vacaciones
 *
 * Utiliza useState y useEffect para manejar el estado de la petición
 *
 * @returns {Object} - Objeto con holidays, estado de carga, error y función para refrescar
 */
export const useGetHolidays = () => {
	const [holidays, setHolidays] = useState<IHoliday[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Instanciar el adapter y el caso de uso
	const calendarAdapter = new CalendarAdapter();
	const getHolidaysUseCase = new GetHolidaysUseCase(calendarAdapter);

	const fetchHolidays = async () => {
		try {
			setIsLoading(true);
			setError(null);

			const holidaysData = await getHolidaysUseCase.execute();
			setHolidays(holidaysData);
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Error al cargar los festivos y vacaciones";
			setError(errorMessage);
			console.error("Error al obtener holidays:", err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchHolidays();
	}, []);

	return {
		holidays,
		isLoading,
		error,
		refetch: fetchHolidays,
	};
};
