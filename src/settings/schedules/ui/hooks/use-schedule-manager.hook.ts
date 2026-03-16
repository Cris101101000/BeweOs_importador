import type { DaySchedule } from "@beweco/aurora-ui";
import type { ISchedule } from "@settings/bussinesConfig/domain/interfaces/schedule.interface";
import { useCallback, useEffect, useState } from "react";

const defaultInitialSchedule: ISchedule = {
	monday: { isOpen: true, timeSlots: [{ from: "09:00", to: "17:00" }] },
	tuesday: { isOpen: true, timeSlots: [{ from: "09:00", to: "17:00" }] },
	wednesday: { isOpen: true, timeSlots: [{ from: "09:00", to: "13:00" }] },
	thursday: { isOpen: true, timeSlots: [{ from: "09:00", to: "17:00" }] },
	friday: { isOpen: true, timeSlots: [{ from: "09:00", to: "17:00" }] },
	saturday: { isOpen: false, timeSlots: [] },
	sunday: { isOpen: false, timeSlots: [] },
};

export const useScheduleManager = (initialSchedule?: ISchedule) => {
	const [schedule, setSchedule] = useState<ISchedule>(
		initialSchedule || defaultInitialSchedule
	);

	useEffect(() => {
		if (initialSchedule) {
			setSchedule(initialSchedule);
		}
	}, [initialSchedule]);

	const handleScheduleChange = useCallback(
		(day: string, newDaySchedule: DaySchedule) => {
			setSchedule((prevSchedule: ISchedule) => ({
				...prevSchedule,
				[day]: newDaySchedule,
			}));
		},
		[]
	);

	const handleCopyToAll = useCallback(
		(day: string) => {
			const scheduleToCopy = schedule[day as keyof ISchedule];
			if (!scheduleToCopy) return;

			const newSchedule = Object.fromEntries(
				Object.keys(schedule).map((key) => [
					key,
					JSON.parse(JSON.stringify(scheduleToCopy)),
				])
			);
			setSchedule(newSchedule as ISchedule);
		},
		[schedule]
	);

	return {
		schedule,
		handleScheduleChange,
		handleCopyToAll,
	};
};
