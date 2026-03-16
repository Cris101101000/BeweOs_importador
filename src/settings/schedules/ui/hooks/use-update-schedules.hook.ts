import { useAuraToast } from "@beweco/aurora-ui";
import type { ISchedule } from "@settings/bussinesConfig/domain/interfaces/schedule.interface";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import {
	configureErrorToastWithTranslation,
	configureSuccessToast,
} from "@shared/utils/toast-config.utils";
import { useTranslate } from "@tolgee/react";
import { useState } from "react";
import { UpdateSchedulesUseCase } from "../../application/update-schedules.usecase";
import { CalendarAdapter } from "../../infrastructure/adapters/calendar.adapter";

export const useUpdateSchedules = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { showToast } = useAuraToast();
	const { t } = useTranslate();

	const updateSchedules = async (
		schedules: ISchedule,
		timezone: string
	): Promise<boolean> => {
		setIsLoading(true);
		setError(null);
		try {
			const adapter = new CalendarAdapter();
			const useCase = new UpdateSchedulesUseCase(adapter);
			await useCase.execute(schedules, timezone);

			// Mostrar notificación de éxito
			showToast(
				configureSuccessToast(
					t("settings_schedules_update_success_title"),
					t("settings_schedules_update_success_message")
				)
			);

			return true; // ✅ Éxito
		} catch (e: unknown) {
			const errorMessage =
				e instanceof Error
					? e.message
					: t("settings_schedules_update_error_message");
			setError(errorMessage);

			// Mostrar notificación de error
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Critical,
					t,
					"settings_schedules_update_error_title",
					errorMessage
				)
			);

			return false; // ❌ Error
		} finally {
			setIsLoading(false);
		}
	};

	return { updateSchedules, isLoading, error };
};
