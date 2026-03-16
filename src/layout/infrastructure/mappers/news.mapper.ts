import type { EnumNewsActionType } from "../../domain/enums/enum-news-action-type.enum";
import type { INews } from "../../domain/interfaces/news.interface";
import type { DtoGetUserData } from "../dtos/get-init-user.dto";

/**
 * Maps DTO news items to the INews domain model.
 * In this app, "news" are referred to as "news".
 * @param dtoNews - The news data from the user DTO.
 * @returns An array of INews objects.
 */
export const mapDtoToNews = (dtoNews: DtoGetUserData["news"]): INews[] => {
	return dtoNews.map((newsItem) => ({
		title: newsItem.title,
		description: newsItem.description,
		action: {
			type: newsItem.action.type as EnumNewsActionType,
			value: newsItem.action.value,
			label: newsItem.action.label,
		},
	}));
};
