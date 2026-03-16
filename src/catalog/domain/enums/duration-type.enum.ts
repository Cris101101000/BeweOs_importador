export enum EnumDurationType {
	HOURS = "hours",
	MINUTES = "minutes",
}

export const DURATION_TYPE_OPTIONS = [
	{ value: EnumDurationType.HOURS, labelKey: "duration_type_hours" },
	{ value: EnumDurationType.MINUTES, labelKey: "duration_type_minutes" },
];

// Maximum values for each duration type (equivalent to 8 hours max)
export const DURATION_MAX_VALUES: Record<EnumDurationType, number> = {
	[EnumDurationType.HOURS]: 8,
	[EnumDurationType.MINUTES]: 480,
};

