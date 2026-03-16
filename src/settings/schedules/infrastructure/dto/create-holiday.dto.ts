/**
 * DTO para la petición POST /companies/holidays
 */

export interface CreateHolidayDateRangeDto {
	startDate: string; // Formato: "YYYY-MM-DD"
	endDate?: string; // Formato: "YYYY-MM-DD" (opcional, solo para rangos)
}

export interface CreateHolidayRequestDto {
	dateRange: CreateHolidayDateRangeDto;
	description: string;
}

/**
 * DTO para la respuesta POST /companies/holidays
 */
export interface CreateHolidayResponseDto {
	success: boolean;
	message: string;
	data: {
		id: string;
		agencyId: string;
		companyId: string;
		dateRange: CreateHolidayDateRangeDto;
		description: string;
	};
	timestamp: string;
}
