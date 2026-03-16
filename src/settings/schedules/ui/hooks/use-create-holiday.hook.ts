import { useState } from "react";
import { CreateHolidayUseCase } from "../../application/create-holiday.usecase";
import type { IHoliday } from "../../domain/interfaces/holiday.interface";
import { CalendarAdapter } from "../../infrastructure/adapters/calendar.adapter";

/**
 * Hook personalizado para crear un holiday
 *
 * @returns {Object} - Objeto con función createHoliday, estado de carga y error
 */
export const useCreateHoliday = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createHoliday = async (
		holiday: Omit<IHoliday, "id">
	): Promise<IHoliday | null> => {
		setIsLoading(true);
		setError(null);
		try {
			const adapter = new CalendarAdapter();
			const useCase = new CreateHolidayUseCase(adapter);
			const createdHoliday = await useCase.execute(holiday);
			return createdHoliday;
		} catch (e: any) {
			const errorMessage = e.message || "Error al crear el festivo";
			setError(errorMessage);
			console.error("Error al crear holiday:", e);
			return null;
		} finally {
			setIsLoading(false);
		}
	};

	return { createHoliday, isLoading, error };
};
