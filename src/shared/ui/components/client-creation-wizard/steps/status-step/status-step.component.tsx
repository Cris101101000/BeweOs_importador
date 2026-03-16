import { Checkbox, H2, P } from "@beweco/aurora-ui";
import { STATUS_CLIENT } from "@clients/domain/constants/status-client.constants.ts";
import { EnumClientStatus } from "@clients/domain/enums/client-status.enum";
import { BACKGROUND_COLOR_MAP } from "@shared/utils/status-colors.utils.ts";
import { useTranslate } from "@tolgee/react";
import { type FC, useEffect } from "react";
import { useWizardValidation } from "../../contexts/wizard-validation.context.tsx";
import type { StatusStepProps } from "./status-step.types.ts";

/**
 * StatusStep Component
 *
 * Third step of the client creation wizard that allows status selection.
 * Features:
 * - AI-powered status suggestion based on collected data
 * - Radio button selection for Lead, Prospect, or Client
 * - Informative description of each status type
 * - Integration with wizard validation context
 * - Real-time form validation with react-hook-form
 *
 * @param data - Current status data from wizard state
 * @param onUpdate - Callback to update wizard state when status changes
 * @param stepIndex - Current step index for validation context
 */
export const StatusStep: FC<StatusStepProps> = ({
	data,
	onUpdate,
	stepIndex,
}) => {
	const { t } = useTranslate();
	const { updateStepValidity } = useWizardValidation();

	/**
	 * Update step validity in wizard context
	 * Step is always valid since user can select any available status
	 */
	useEffect(() => {
		updateStepValidity(stepIndex, true);
	}, [stepIndex, updateStepValidity]);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col">
				<H2>{t("status_step_title", "Sugerencia de estado")}</H2>
				<P>
					{t(
						"status_step_description",
						"Esta es una sugerencia de AI basada en los datos del contacto. Puedes cambiarla si lo consideras necesario."
					)}
				</P>
			</div>
			<div className="grid grid-cols-3 gap-3">
				{Object.entries(STATUS_CLIENT)
					.filter(([key]) => key !== "ex_client") // Filter out Ex-Client status
					.map(([key, config]) => {
						const status = key as EnumClientStatus;
						const isSelected = data === status;

						return (
							<div
								key={status}
								className={`${
									BACKGROUND_COLOR_MAP[config.color] || "bg-default-50"
								} py-3 px-4 rounded-2xl flex items-center gap-2`}
							>
								<Checkbox
									isSelected={isSelected}
									onValueChange={() => onUpdate(status)}
									size="sm"
									color="primary"
									classNames={{
										wrapper: "flex-shrink-0 bg-default-50",
										label:
											"text-tiny text-default-600 font-normal leading-tight w-full",
									}}
								>
									{t(config.translationKey, status)}
								</Checkbox>
							</div>
						);
					})}
			</div>
		</div>
	);
};

StatusStep.displayName = "StatusStep";
