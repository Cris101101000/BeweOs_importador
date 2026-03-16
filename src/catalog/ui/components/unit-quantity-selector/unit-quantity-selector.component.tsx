import { Input, Select, SelectItem } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { useMemo } from "react";
import {
	EnumMeasureUnit,
	MEASURE_UNIT_OPTIONS,
} from "../../../domain/enums/measure-unit.enum";
import { useCatalogEnums } from "../../hooks/use-catalog-enums.hook";

export interface UnitQuantitySelectorProps {
	unitValue?: string;
	quantityValue?: number;
	onUnitChange: (unit: string) => void;
	onQuantityChange: (quantity: number) => void;
	label?: React.ReactNode;
	description?: string;
	isRequired?: boolean;
	isInvalid?: boolean;
	errorMessage?: string;
}

const UnitQuantitySelector: FC<UnitQuantitySelectorProps> = ({
	unitValue = "",
	quantityValue = 0,
	onUnitChange,
	onQuantityChange,
	label,
	description,
	isRequired = false,
	isInvalid = false,
	errorMessage,
}) => {
	const { t } = useTranslate();

	const { units: apiUnits } = useCatalogEnums();

	const formatUnitName = (unit: string): string => {
		return t(`unit_${unit}`, unit.charAt(0).toUpperCase() + unit.slice(1));
	};

	const defaultUnit = useMemo(() => {
		// If API units are available, use "units" (English API format)
		if (apiUnits.length > 0) {
			return "units";
		}
		// Fallback to enum value (Spanish)
		return EnumMeasureUnit.Unidad;
	}, [apiUnits]);

	const unitOptions = useMemo(() => {
		if (apiUnits.length > 0) {
			return apiUnits.map((unit) => ({
				key: unit,
				label: formatUnitName(unit),
			}));
		}

		// Use enum options as fallback
		return MEASURE_UNIT_OPTIONS.map((option) => ({
			key: option.value,
			label: formatUnitName(option.value),
		}));
	}, [apiUnits, formatUnitName]);

	const currentUnit = unitValue || defaultUnit;
	console.log('currentUnit >>',currentUnit);
	const inputStep = useMemo(() => {
		if (currentUnit === "units") {
			return 1;
		}
		return 0.01;
	}, [currentUnit]);

	return (
		<div className="flex flex-col gap-2">
			{/* Title */}
			{label && (
				<label className="text-sm font-medium text-foreground">
					{label}
					{isRequired && <span className="text-danger ml-1">*</span>}
				</label>
			)}

			{/* Description */}
			{description && (
				<p className="text-xs text-default-500 -mt-1 mb-1">{description}</p>
			)}

			<div className="flex gap-2">
				{/* Quantity Input */}
				<div className="flex-1">
					<Input
						type="number"
						label={t("unit_quantity_quantity_label", "Cantidad")}
						placeholder={t("unit_quantity_quantity_placeholder", "0")}
						value={quantityValue?.toString() || ""}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							const value = e.target.value;
							onQuantityChange(value ? Number(value) : 0);
						}}
						isInvalid={isInvalid}
						min={0}
						step={inputStep}
						classNames={{
							input: "text-center",
						}}
					/>
				</div>

				{/* Unit Select */}
				<div className="flex-1">
					<Select
						label={t("unit_quantity_unit_label", "Unidad")}
						placeholder={t("unit_quantity_unit_placeholder", "Medida")}
						selectedKeys={unitValue ? [unitValue] : [defaultUnit]}
						onSelectionChange={(keys: any) => {
							const selectedKey = Array.from(keys)[0] as string;
							onUnitChange(selectedKey || defaultUnit);
						}}
						isInvalid={isInvalid}
						classNames={{
							trigger: "z-10", // Ensure proper z-index
							popoverContent: "z-[9999]", // High z-index for dropdown
						}}
					>
						{unitOptions.map((option) => (
							<SelectItem key={option.key}>{option.label}</SelectItem>
						))}
					</Select>
				</div>
			</div>

			{/* Error Message */}
			{isInvalid && errorMessage && (
				<div className="text-tiny text-danger">{errorMessage}</div>
			)}
		</div>
	);
};

export default UnitQuantitySelector;
