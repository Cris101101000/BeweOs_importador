import type { IAiTag } from "@clients/domain/interfaces/ai-tag.interface";
import type { CreateAiTagRequestDto } from "../dtos/ai-tag.dto";

export const toCreateAiTagRequestDto = (
	clientId: string,
	tag: Partial<IAiTag>
): CreateAiTagRequestDto => {
	return {
		clientId: clientId,
		title: tag.value || "",
		color: tag.color || "",
	};
};
