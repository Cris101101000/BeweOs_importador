export interface UpdateScheduleTimeDto {
	start: string;
	end: string;
	isEnabled?: boolean;
}

export interface UpdateScheduleDto {
	day: number;
	timezone?: string;
	times: UpdateScheduleTimeDto[];
	isEnabled?: boolean;
}

export interface UpdateHolidayDto {
	startDate: Date;
	endDate?: Date;
}

export interface UpdateCalendarRequestDto {
	schedules?: UpdateScheduleDto[];
	holidays?: UpdateHolidayDto[];
}

/**
 * DTO para el endpoint POST /companies/schedules/bulk
 */
export interface BulkScheduleTimeDto {
	start: string; // Formato "HH:mm" ej: "08:00"
	end: string; // Formato "HH:mm" ej: "17:00"
	isEnabled?: boolean;
}

export interface BulkScheduleItemDto {
	dayOfWeek: string; // "MONDAY", "TUESDAY", etc. en UPPER_CASE
	timezone: string; // ej: "America/Bogota"
	times: BulkScheduleTimeDto[];
	isEnabled: boolean; // Si el día está habilitado o no
}

export interface BulkSchedulesRequestDto {
	schedules: BulkScheduleItemDto[];
}
