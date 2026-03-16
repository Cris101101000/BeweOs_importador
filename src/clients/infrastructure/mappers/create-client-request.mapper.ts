import type { IClient } from "@clients/domain/interfaces/client.interface";
import type { AiTagDto } from "@clients/infrastructure/dtos/ai-tag.dto";
import { toAiTagDtos } from "@clients/infrastructure/mappers/ai-tag.mapper";
import type { CreateClientRequestDto } from "../dtos/create-client.dto";
import { toPhoneDtos } from "./phone.mapper";

export const toCreateClientRequestDto = (
	client: IClient
): CreateClientRequestDto => {
	const {
		firstName,
		lastName,
		phones,
		email,
		status,
		bussines,
		category,
		birthdate,
		createdChannel,
		tags,
		gender,
	} = client;

	// Map IAiTag[] to AiTagDto[] using shared mapper
	const mappedTags: AiTagDto[] | undefined = tags
		? toAiTagDtos(tags)
		: undefined;

	// Map phones with required API schema fields using shared mapper
	const mappedPhones = toPhoneDtos(phones);

	return {
		firstname: firstName,
		lastname: lastName,
		phones: mappedPhones,
		email,
		status: status.value,
		creationChannel: createdChannel as string,
		...(bussines && { business: bussines }),
		...(category && { category }),
		...(birthdate && { birthdate: birthdate.toString() }),
		...(mappedTags && { tags: mappedTags }),
		...(gender && { gender }),
	};
};
