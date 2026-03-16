import { Button, Card, useAuraToast } from "@beweco/aurora-ui";
import type { ISchedule } from "@settings/bussinesConfig/domain/interfaces/schedule.interface";
import { ScheduleRowComponent } from "@shared/ui/components/ScheduleRow";
import { useTranslate } from "@tolgee/react";
import type React from "react";
import { useScheduleManager } from "../../hooks/use-schedule-manager.hook";
import { useUpdateSchedules } from "../../hooks/use-update-schedules.hook";

interface ScheduleEditorProps {
	schedule?: ISchedule | null;
	timezone?: string;
	onSaveSuccess?: () => void;
}

export const ScheduleEditor: React.FC<ScheduleEditorProps> = ({
	schedule: initialSchedule,
	timezone = "America/Bogota", // Timezone por defecto
	onSaveSuccess,
}) => {
	const { t } = useTranslate();
	const { showToast } = useAuraToast();
	const { schedule, handleScheduleChange, handleCopyToAll } =
		useScheduleManager(initialSchedule ?? undefined);
	const { updateSchedules, isLoading: isSaving } = useUpdateSchedules();

	const handleSave = async () => {
		const success = await updateSchedules(schedule, timezone);

		// Si el guardado fue exitoso, refrescar los datos del backend
		if (success && onSaveSuccess) {
			onSaveSuccess();
		}
	};

	return (
		<Card className="w-full mx-auto p-5 gap-4 mt-1">
			<div>
				<h2 className="font-medium text-lg text-foreground">
					{t("settings_schedules_title")}
				</h2>
				<p className="text-default-500 text-sm">
					{t("settings_schedules_description")}
				</p>
			</div>
			<div className="flex flex-col gap-2">
				{Object.entries(schedule).map(([day, daySchedule]) => (
					<ScheduleRowComponent
						key={day}
						day={t(`day_${day}`)}
						daySchedule={daySchedule}
						onChange={(newDaySchedule) => {
							if (newDaySchedule.timeSlots.length > 2) {
								showToast({
									color: "danger",
									title: t("settings_schedules_error_max_slots"),
									description: t(
										"settings_schedules_error_max_slots_description"
									),
								});
								newDaySchedule.timeSlots.pop();
								return;
							}

							handleScheduleChange(day, newDaySchedule);
						}}
						onCopyToAll={handleCopyToAll}
						translations={{
							addTimeSlot: t("schedule_add_time_slot"),
							closed: t("schedule_closed"),
							copyToAll: t("button_copy_to_all"),
							from: t("schedule_from"),
							open: t("schedule_open"),
							to: t("schedule_to"),
						}}
					/>
				))}
			</div>
			<Button className="w-36" onPress={handleSave} isLoading={isSaving}>
				{t("button_save")}
			</Button>
		</Card>
	);
};
