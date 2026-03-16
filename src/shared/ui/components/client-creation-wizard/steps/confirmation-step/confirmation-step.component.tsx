import { Chip, type ChipColor, H2, H4, P } from "@beweco/aurora-ui";
import { STATUS_CLIENT } from "@clients/domain/constants/status-client.constants.ts";
import { getGenderTranslate } from "@shared/domain/utils/gender-translate.utils.ts";
import { formatDateObjectToDisplay } from "@shared/utils/date-formatter.utils.ts";
import { useTranslate } from "@tolgee/react";
import { type FC, useEffect, useMemo } from "react";
import { useWizardValidation } from "../../contexts/wizard-validation.context.tsx";
import type { ConfirmationStepProps } from "./confirmation-step.types.ts";

/**
 * ConfirmationStep Component
 *
 * Final step of the client creation wizard that shows a summary of all collected data.
 * Features:
 * - Complete summary of basic information (name, email, phone)
 * - Display of segmentation data (AI tags, creation channel, birthdate)
 * - Visual representation of selected client status with appropriate colors
 * - Action buttons for final confirmation or cancellation
 * - Integration with wizard validation context
 *
 * @param data - Complete form data from all previous steps
 * @param onConfirm - Callback to execute when user confirms client creation
 * @param onCancel - Callback to execute when user cancels the process
 * @param stepIndex - Current step index for validation context
 */
export const ConfirmationStep: FC<ConfirmationStepProps> = ({
	data,
	stepIndex,
}) => {
	const { t } = useTranslate();
	const { updateStepValidity } = useWizardValidation();

	/**
	 * Update step validity in wizard context
	 * Confirmation step is always valid since it's just a summary
	 */
	useEffect(() => {
		updateStepValidity(stepIndex, true);
	}, [stepIndex]);

	/**
	 * Get formatted phone number for display
	 * Combines country code and number
	 */
	const formattedPhone = useMemo(() => {
		if (!data.basicInfo.phone?.code || !data.basicInfo.phone?.number) {
			return t("not_provided", "No proporcionado");
		}
		return `${data.basicInfo.phone.code} ${data.basicInfo.phone.number}`;
	}, [data.basicInfo.phone, t]);

	/**
	 * Get status configuration for display
	 */
	const statusConfig = useMemo(() => {
		return (
			STATUS_CLIENT[data.status] || {
				color: "bg-default-100",
				translationKey: "status_unknown",
			}
		);
	}, [data.status]);

	/**
	 * Format birthdate for display
	 */
	const formattedBirthdate = useMemo(() => {
		if (!data.segment.birthdate) {
			return t("not_provided", "No proporcionado");
		}
		return formatDateObjectToDisplay(data.segment.birthdate.toString());
	}, [data.segment.birthdate, t]);

	return (
		<div className="flex flex-col gap-6">
			{/* Header */}
			<div className="text-center">
				<H2>{t("confirmation_title", "Resumen del contacto")}</H2>
				<P>
					{t(
						"confirmation_description",
						"Revisa la información antes de crear el contacto"
					)}
				</P>
			</div>

			{/* Basic Information Section */}
			<div className="bg-default-50 rounded-xl p-4">
				<H4>{t("basic_info_section", "Información básica")}</H4>

				<div className="flex flex-col gap-2 mt-3">
				{/* Name */}
				<div className="flex justify-between items-center">
					<P className="text-tiny">{t("field_name", "Nombre")}</P>
					<H4 className="text-tiny">
						{[data.basicInfo.firstName, data.basicInfo.lastName]
							.filter(Boolean)
							.join(" ") || t("not_provided", "No proporcionado")}
					</H4>
				</div>

					{/* Email */}
					<div className="flex justify-between items-center">
						<P className="text-tiny">
							{t("field_email", "Correo electrónico")}
						</P>
						<H4 className="text-tiny">
							{data.basicInfo.email || t("not_provided", "No proporcionado")}
						</H4>
					</div>

					{/* Phone */}
					<div className="flex justify-between items-center">
						<P className="text-tiny">{t("field_phone", "Teléfono")}</P>
						<H4 className="text-tiny">{formattedPhone}</H4>
					</div>
				</div>
			</div>

			{/* Segmentation Section */}
			<div className="bg-default-50 rounded-xl p-4">
				<H4>{t("segmentation_section", "Segmentación")}</H4>

				<div className="flex flex-col gap-2 mt-3">
					{/* AI Tags */}
					<div className="flex justify-between items-center gap-2">
						<P className="text-tiny">{t("field_ai_tags", "Etiquetas IA")}</P>
						{data.segment.tagsIA && data.segment.tagsIA.length > 0 ? (
							<div className="flex flex-wrap gap-2 justify-end">
								{data.segment.tagsIA.map((tag) => (
									<Chip
										key={tag.id || tag.value}
										size="sm"
										color="primary"
										variant="flat"
									>
										{tag.value}
									</Chip>
								))}
							</div>
						) : (
							<H4 className="text-tiny">
								{t("no_tags_selected", "Sin etiquetas seleccionadas")}
							</H4>
						)}
					</div>
					{data.segment.gender && (
						<div className="flex justify-between items-center">
							<P className="text-tiny">{t("gender", "Género")}</P>
							<H4 className="text-tiny lowercase">
								{getGenderTranslate(data.segment.gender, t)}
							</H4>
						</div>
					)}

					{/* Birthdate */}
					<div className="flex justify-between items-center">
						<P className="text-tiny">
							{t("field_birthdate", "Fecha de cumpleaños")}
						</P>
						<H4 className="text-tiny">{formattedBirthdate}</H4>
					</div>
				</div>
			</div>

			{/* Status Section */}
			<div className="bg-default-50 rounded-xl p-4">
				<H4>{t("status_section", "Estado del cliente")}</H4>

				<div className="flex justify-between items-center">
					<P className="text-tiny">{t("field_client_status", "Estado")}</P>
					<Chip
						color={statusConfig.color as ChipColor}
						variant="flat"
						className="py-2 px-4 rounded-xl"
					>
						{t(statusConfig.translationKey, data.status)}
					</Chip>
				</div>
			</div>
		</div>
	);
};

ConfirmationStep.displayName = "ConfirmationStep";
