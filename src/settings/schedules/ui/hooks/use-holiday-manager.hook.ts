import type { Holiday } from "@beweco/aurora-ui";
import type { IHoliday } from "@settings/schedules/domain/interfaces/holiday.interface";
import { useCallback, useState } from "react";

export const useHolidayManager = (initialHolidays: IHoliday[] = []) => {
	const [holidays, setHolidays] = useState<IHoliday[]>(initialHolidays);

	const onAddHoliday = useCallback((newHoliday: Omit<Holiday, "id">) => {
		setHolidays((prevHolidays) => [
			...prevHolidays,
			{ ...newHoliday, id: Date.now().toString() } as IHoliday,
		]);
	}, []);

	const onDeleteHoliday = useCallback((holidayId: string) => {
		setHolidays((prevHolidays) =>
			prevHolidays.filter((holiday) => holiday.id !== holidayId)
		);
	}, []);

	return {
		holidays,
		onAddHoliday,
		onDeleteHoliday,
	};
};
