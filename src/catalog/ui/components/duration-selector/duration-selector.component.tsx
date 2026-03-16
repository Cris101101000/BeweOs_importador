import { Input, Select, SelectItem } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { useCallback, useMemo } from "react";
import {
	DURATION_MAX_VALUES,
	DURATION_TYPE_OPTIONS,
	EnumDurationType,
} from "../../../domain/enums/duration-type.enum";

export interface DurationSelectorProps {
	durationValue: number;
	durationType: EnumDurationType;
	onDurationValueChange: (value: number) => void;
	onDurationTypeChange: (type: EnumDurationType) => void;
	label?: React.ReactNode;
	isRequired?: boolean;
	isInvalid?: boolean;
	errorMessage?: string;
}

const DurationSelector: FC<DurationSelectorProps> = ({
	durationValue,
	durationType,
	onDurationValueChange,
	onDurationTypeChange,
	label,
	isRequired = false,
	isInvalid = false,
	errorMessage,
}) => {
	const { t } = useTranslate();

	const maxValue = useMemo(
		() => DURATION_MAX_VALUES[durationType],
		[durationType]
	);

	const handleValueChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			const numValue = value === "" ? 0 : Number.parseInt(value, 10);

			// Only allow non-negative integers
			if (!Number.isNaN(numValue) && numValue >= 0) {
				onDurationValueChange(numValue);
			}
		},
		[onDurationValueChange]
	);

	const handleTypeChange = useCallback(
		(keys: Set<string> | any) => {
			const selectedKey = Array.from(keys)[0] as EnumDurationType;
			if (selectedKey) {
				onDurationTypeChange(selectedKey);
			}
		},
		[onDurationTypeChange]
	);

	const helperText = useMemo(() => {
		const maxHours = DURATION_MAX_VALUES[EnumDurationType.HOURS];
		const maxMinutes = DURATION_MAX_VALUES[EnumDurationType.MINUTES];

		if (durationType === EnumDurationType.HOURS) {
			return t(
				"duration_max_hours_helper",
				`Máximo ${maxHours} horas (${maxMinutes} minutos)`
			);
		}
		return t(
			"duration_max_minutes_helper",
			`Máximo ${maxMinutes} minutos (${maxHours} horas)`
		);
	}, [durationType, t]);

	return (
		<div className="flex flex-col gap-2">
			{/* Label */}
			{label && (
				<label className="text-sm font-medium text-foreground">
					{label}
					{isRequired && <span className="text-danger ml-1">*</span>}
				</label>
			)}

			<div className="flex gap-2">
				{/* Duration Value Input */}
				<div className="flex-1">
					<Input
						type="number"
						label={t("duration_value_label", "Valor")}
						placeholder="0"
						value={durationValue.toString()}
						onChange={handleValueChange}
						isInvalid={isInvalid}
						min={0}
						max={maxValue}
						step={1}
						classNames={{
							input: "text-center",
						}}
					/>
				</div>

				{/* Duration Type Select */}
				<div className="flex-1">
					<Select
						label={t("duration_type_label", "Tipo")}
						placeholder={t("duration_type_placeholder", "Seleccionar")}
						selectedKeys={[durationType]}
						onSelectionChange={handleTypeChange}
						isInvalid={isInvalid}
						classNames={{
							trigger: "z-10",
							popoverContent: "z-[9999]",
						}}
					>
						{DURATION_TYPE_OPTIONS.map((option) => (
							<SelectItem key={option.value}>
								{t(option.labelKey, option.value)}
							</SelectItem>
						))}
					</Select>
				</div>
			</div>

			{/* Helper Text - Maximum allowed */}
			<p className="text-xs text-default-500">{helperText}</p>

			{/* Error Message */}
			{isInvalid && errorMessage && (
				<div className="text-tiny text-danger">{errorMessage}</div>
			)}
		</div>
	);
};

export default DurationSelector;

