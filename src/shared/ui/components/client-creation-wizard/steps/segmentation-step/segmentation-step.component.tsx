import { GenderSelect } from "@shared/ui/components";

import { DatePicker, TagsFilter } from "@beweco/aurora-ui";
import { EnumCreationChannel } from "@shared/domain/enums/enum-creation-channel.enum.ts";
import { useTranslate } from "@tolgee/react";
import { type FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import type { ISegmentInfo } from "../../client-creation-wizard.types.ts";
import { useWizardValidation } from "../../contexts/wizard-validation.context.tsx";
import { useAiTags } from "../../hooks/use-ai-tags.hook";
import type { SegmentationStepProps } from "./segmentation-step.types.ts";

/**
 * SegmentationStep Component
 *
 * Second step of the client creation wizard that collects segmentation information.
 * Allows users to:
 * - Select AI tags for client categorization
 * - Choose creation channel (source)
 * - Set birthdate (required)
 * - Select gender (required)
 *
 * Features:
 * - Real-time form validation with react-hook-form
 * - Integration with wizard validation context
 * - Automatic data synchronization with parent wizard
 * - Required field validation with proper error handling
 * - Responsive design with Aurora UI components
 *
 * @param data - Current segmentation data from wizard state
 * @param onUpdate - Callback to update wizard state when data changes
 * @param stepIndex - Current step index for validation context
 */
export const SegmentationStep: FC<SegmentationStepProps> = ({
	data,
	onUpdate,
	stepIndex,
}) => {
	const { t } = useTranslate();
	const { updateStepValidity } = useWizardValidation();

	// AI Tags hook
	const { aiTags, isLoading: isLoadingTags, error: tagsError } = useAiTags();

	// Form setup with proper defaults and validation mode
	const {
		control,
		watch,
		formState: { isValid, errors },
	} = useForm<ISegmentInfo>({
		mode: "onChange",
		defaultValues: data || {
			tagsIA: [],
			creationChannel: EnumCreationChannel.Web,
			birthdate: null,
			gender: undefined,
		},
	});

	/**
	 * Synchronize form data with parent wizard state
	 * Updates parent whenever any field value changes
	 */
	useEffect(() => {
		const subscription = watch((value) => {
			onUpdate(value as ISegmentInfo);
		});
		return () => subscription.unsubscribe();
	}, [watch, onUpdate]);

	/**
	 * Update step validity in wizard context
	 * Step is valid when required fields (birthdate and gender) are completed
	 */
	useEffect(() => {
		updateStepValidity(stepIndex, isValid);
	}, [isValid, stepIndex, updateStepValidity]);

	return (
		<div className="flex flex-col gap-4">
			{/* AI Tags Section */}
			<Controller
				name="tagsIA"
				control={control}
				render={({ field }) => (
					<div className="flex flex-col gap-2">
						<span className="text-tiny text-left text-default-600">
							{t("field_ai_tags", "AI Tags")}
						</span>
						{tagsError && (
							<span className="text-danger text-small">
								{t("error_loading_tags", "Error loading tags")}: {tagsError}
							</span>
						)}
						<TagsFilter
							value={field.value ?? []}
							items={aiTags ?? []}
							onChange={field.onChange}
							isLoading={isLoadingTags}
						/>
					</div>
				)}
			/>

			{/* Birthdate (Required) */}
			<Controller
				name="birthdate"
				control={control}
				rules={{
					required: {
						value: true,
						message: t("field_birthdate_required", "Birthdate is required"),
					},
				}}
				render={({ field }) => (
					<DatePicker
						label={t("field_birthdate", "Birthdate")}
						value={field.value || null}
						onChange={(dateValue) => {
							field.onChange(dateValue);
						}}
						classNames={{
							label: "text-tiny text-left text-default-600",
						}}
						isInvalid={!!errors.birthdate}
						errorMessage={errors.birthdate?.message}
						size="md"
						isRequired
					/>
				)}
			/>

			{/* Gender Selection (Required) */}
			<Controller
				name="gender"
				control={control}
				rules={{
					required: {
						value: true,
						message: t("field_gender_required", "Gender is required"),
					},
				}}
				render={({ field }) => (
					<GenderSelect
						value={field.value}
						onSelectionChange={field.onChange}
						isInvalid={!!errors.gender}
						errorMessage={errors.gender?.message}
						isRequired
					/>
				)}
			/>
		</div>
	);
};

SegmentationStep.displayName = "SegmentationStep";
