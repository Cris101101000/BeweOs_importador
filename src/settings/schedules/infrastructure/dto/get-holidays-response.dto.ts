/**
 * DTO para la respuesta del endpoint GET /companies/holidays
 */

export interface DateRangeDto {
	startDate: string; // ISO 8601 format
	endDate: string | null; // ISO 8601 format, null para días únicos
}

export interface HolidayItemDto {
	id: string;
	agencyId: string;
	companyId: string;
	dateRange: DateRangeDto;
	description: string;
}

export interface GetHolidaysResponseDto {
	success: boolean;
	message: string;
	data: HolidayItemDto[];
	timestamp: string;
}
