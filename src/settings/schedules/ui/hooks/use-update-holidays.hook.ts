import type { IHoliday } from "@settings/schedules/domain/interfaces/holiday.interface";
import { useState } from "react";
import { UpdateHolidaysUseCase } from "../../application/update-holidays.usecase";
import { CalendarAdapter } from "../../infrastructure/adapters/calendar.adapter";

export const useUpdateHolidays = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const updateHolidays = async (
		agencyId: string,
		holidays: IHoliday[]
	): Promise<boolean> => {
		setIsLoading(true);
		setError(null);
		try {
			const adapter = new CalendarAdapter();
			const useCase = new UpdateHolidaysUseCase(adapter);
			await useCase.execute(agencyId, holidays);
			return true;
		} catch (e: any) {
			setError(
				e.message || "An unexpected error occurred while updating holidays."
			);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	return { updateHolidays, isLoading, error };
};
