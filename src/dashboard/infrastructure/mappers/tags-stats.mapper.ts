import type { IAiTagsStats, IAiTagTopItem } from "../../domain/interfaces/dashboard.interface";
import type { GetTagsStatsDataDto } from "../dtos/get-tags-stats.dto";

const TOP_TAG_COLORS: IAiTagTopItem["color"][] = [
	"success",
	"primary",
	"warning",
	"secondary",
	"default",
];

/**
 * Mapea la respuesta de la API (data) al modelo de dominio IAiTagsStats.
 * newTagsPerMonth: suma de aiCreatedByPeriod[].count
 * newTagsPerMonthTrend: growthVsPreviousPeriodPct
 * totalTags: totalAiTags, tagsInUse: aiTagsInUse
 * topTags: topAiTags -> label (tagName), count (usageCount), color por índice
 */
export const toAiTagsStatsFromDto = (
	dto: GetTagsStatsDataDto
): IAiTagsStats => {
	const newTagsPerMonth = (dto.aiCreatedByPeriod ?? []).reduce(
		(sum, p) => sum + (p.count ?? 0),
		0
	);
	const topTags: IAiTagTopItem[] = (dto.topAiTags ?? []).map((item, index) => ({
		label: item.tagName,
		count: item.usageCount,
		color: TOP_TAG_COLORS[index % TOP_TAG_COLORS.length],
	}));
	return {
		newTagsPerMonth,
		newTagsPerMonthTrend: dto.growthVsPreviousPeriodPct ?? 0,
		totalTags: dto.totalAiTags ?? 0,
		tagsInUse: dto.aiTagsInUse ?? 0,
		topTags,
	};
};
