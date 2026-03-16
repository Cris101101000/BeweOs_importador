import {
	AddHolidayForm,
	Button,
	Card,
	IconComponent,
	useAuraToast,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type React from "react";

import type { IHoliday } from "@settings/schedules/domain/interfaces/holiday.interface";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import {
	configureErrorToastWithTranslation,
	configureSuccessToast,
} from "@shared/utils/toast-config.utils";
import { useCreateHoliday } from "../../hooks/use-create-holiday.hook";
import { useDeleteHoliday } from "../../hooks/use-delete-holiday.hook";

const formatDate = (date: Date) => {
	return date.toLocaleDateString("es-ES", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

interface HolidayManagerProps {
	initialHolidays?: IHoliday[];
	onSaveSuccess?: () => void;
}

export const HolidayManager: React.FC<HolidayManagerProps> = ({
	initialHolidays = [],
	onSaveSuccess,
}) => {
	const { t } = useTranslate();
	const { showToast } = useAuraToast();
	const { createHoliday, isLoading: isCreating, error: createError } =
		useCreateHoliday();
	const { deleteHoliday, isLoading: isDeleting, error: deleteError } =
		useDeleteHoliday();

	const handleAddHoliday = async (
		newHoliday: Omit<import("@beweco/aurora-ui").Holiday, "id">
	) => {
		// Convertir el holiday del formato de aurora-ui al formato del dominio
		const holidayToCreate: Omit<IHoliday, "id"> = newHoliday as any;

		// Llamar al API para crear el holiday
		const createdHoliday = await createHoliday(holidayToCreate);

		if (createdHoliday) {
			// Mostrar toast de éxito
			showToast(
				configureSuccessToast(
					t("settings_holidays_create_success_title"),
					t("settings_holidays_create_success_message")
				)
			);

			// Refrescar los datos del backend
			if (onSaveSuccess) {
				onSaveSuccess();
			}
		} else {
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Critical,
					t,
					"settings_holidays_create_error_title",
					createError || "settings_holidays_create_error_message"
				)
			);
		}
	};

	const handleDeleteHoliday = async (holidayId: string) => {
		// Llamar al API para eliminar el holiday
		const success = await deleteHoliday(holidayId);

		if (success) {
			// Mostrar toast de éxito
			showToast(
				configureSuccessToast(
					t("settings_holidays_delete_success_title"),
					t("settings_holidays_delete_success_message")
				)
			);

			// Refrescar los datos del backend
			if (onSaveSuccess) {
				onSaveSuccess();
			}
		} else {
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Critical,
					t,
					"settings_holidays_delete_error_title",
					deleteError || "settings_holidays_delete_error_message"
				)
			);
		}
	};

	return (
		<Card className="w-full mx-auto p-5 gap-4 mt-1 ">
			<div>
				<h2 className="font-medium text-lg text-foreground">
					{t("settings_holidays_title")}
				</h2>
				<p className="text-default-500 text-sm">
					{t("settings_holidays_description")}
				</p>
			</div>

			{/* Lista de festivos */}
			{initialHolidays.length > 0 && (
				<div className="">
					<h3 className="font-semibold text-small text-foreground">
						{t("settings_holidays_list_title")}
					</h3>
					{initialHolidays.map((holiday) => (
						<div
							key={holiday.id}
							className="flex justify-between items-center p-4 border-b border-divider"
						>
							<div>
								<p className="font-semibold text-sm">
									{holiday.startDate ? formatDate(holiday.startDate) : ""}
									{holiday.endDate ? ` - ${formatDate(holiday.endDate)}` : ""}
								</p>
								<p className="text-xs text-default-500">{holiday.title}</p>
							</div>
							<Button
								isIconOnly
								variant="light"
								color="danger"
								onPress={() => handleDeleteHoliday(holiday.id)}
								isLoading={isDeleting}
								isDisabled={isDeleting || isCreating}
							>
								<IconComponent icon="solar:trash-bin-minimalistic-outline" />
							</Button>
						</div>
					))}
				</div>
			)}

			{/* Formulario para añadir festivos */}
			<div className="flex flex-col gap-4">
				<AddHolidayForm
					onAddHoliday={handleAddHoliday}
					translations={{
						addHolidayTitle: t("settings_holidays_add_title"),
						dayOption: t("day_option"),
						dateRangeOption: t("date_range_option"),
						selectDateRangeAriaLabel: t("select_date_range_aria_label"),
						selectDateAriaLabel: t("select_date_aria_label"),
						optionalTitle: t("optional_title"),
						titlePlaceholder: t("title_placeholder"),
						addButton: isCreating ? t("button_adding") : t("button_add"),
					}}
				/>
			</div>
		</Card>
	);
};
