export enum EnumMeasureUnit {
	Kilogramo = "kilogramo",
	Gramo = "gramo",
	Mililitro = "mililitro",
	Litro = "litro",
	Onza = "onza",
	Unidad = "unidad",
	Centimetro = "centimetro",
	Metro = "metro",
}

export const MEASURE_UNIT_LABELS: Record<EnumMeasureUnit, string> = {
	[EnumMeasureUnit.Kilogramo]: "Kilogramo",
	[EnumMeasureUnit.Gramo]: "Gramo",
	[EnumMeasureUnit.Mililitro]: "Mililitro",
	[EnumMeasureUnit.Litro]: "Litro",
	[EnumMeasureUnit.Onza]: "Onza",
	[EnumMeasureUnit.Unidad]: "Unidad",
	[EnumMeasureUnit.Centimetro]: "Centímetro",
	[EnumMeasureUnit.Metro]: "Metro",
};

export const MEASURE_UNIT_OPTIONS = Object.entries(MEASURE_UNIT_LABELS).map(
	([value, label]) => ({
		value: value as EnumMeasureUnit,
		label,
	})
);
