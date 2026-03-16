import type React from "react";
import { HolidayManager } from "./components/holiday-manager/holiday-manager.component";
import { ScheduleEditor } from "./components/schedule-editor/schedule-editor.component";
import { useGetHolidays } from "./hooks/use-get-holidays.hook";
import { useGetSchedules } from "./hooks/use-get-schedules.hook";

const Shedules: React.FC = () => {
	const {
		schedules,
		timezone,
		isLoading: isLoadingSchedules,
		error: schedulesError,
		refetch: refetchSchedules,
	} = useGetSchedules();
	const {
		holidays,
		isLoading: isLoadingHolidays,
		error: holidaysError,
		refetch: refetchHolidays,
	} = useGetHolidays();

	// Mostrar loading si cualquiera de los dos está cargando
	if (isLoadingSchedules || isLoadingHolidays) {
		return (
			<div className="flex items-center justify-center h-64">
				<p className="text-default-500">Cargando datos...</p>
			</div>
		);
	}

	// Mostrar error si cualquiera de los dos tiene error
	if (schedulesError || holidaysError) {
		return (
			<div className="flex items-center justify-center h-64">
				<p className="text-danger">{schedulesError || holidaysError}</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full items-start">
			<ScheduleEditor
				schedule={schedules}
				timezone={timezone}
				onSaveSuccess={refetchSchedules}
			/>
			<HolidayManager
				initialHolidays={holidays}
				onSaveSuccess={refetchHolidays}
			/>
		</div>
	);
};

export default Shedules;
