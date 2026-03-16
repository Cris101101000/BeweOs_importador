import { useState } from "react";
import { DeleteHolidayUseCase } from "../../application/delete-holiday.usecase";
import { CalendarAdapter } from "../../infrastructure/adapters/calendar.adapter";

/**
 * Hook personalizado para eliminar un holiday
 *
 * @returns {Object} - Objeto con función deleteHoliday, estado de carga y error
 */
export const useDeleteHoliday = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const deleteHoliday = async (holidayId: string): Promise<boolean> => {
		setIsLoading(true);
		setError(null);
		try {
			const adapter = new CalendarAdapter();
			const useCase = new DeleteHolidayUseCase(adapter);
			await useCase.execute(holidayId);
			return true;
		} catch (e: any) {
			const errorMessage = e.message || "Error al eliminar el festivo";
			setError(errorMessage);
			console.error("Error al eliminar holiday:", e);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	return { deleteHoliday, isLoading, error };
};
