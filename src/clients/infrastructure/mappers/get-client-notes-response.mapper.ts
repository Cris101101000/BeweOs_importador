import type { INote } from "@clients/domain/interfaces/note.interface";
import type { GetClientNotesResponseDto } from "../dtos/get-client-notes.dto";

// biome-ignore lint/complexity/noStaticOnlyClass: Mapper pattern with static methods
export class GetClientNotesResponseMapper {
	static toDomain(dto: GetClientNotesResponseDto): INote {
		return {
			id: dto.id,
			clientId: dto.clientId,
			companyId: dto.companyId ?? "",
			type: dto.type,
			title: dto.title ?? "",
			description: dto.content ?? "", // Map DTO content to domain description
			createdAt: dto.createdAt,
			updatedAt: dto.updatedAt,
			createdBy: dto.createdBy,
		};
	}

	static toDomainList(dtos: GetClientNotesResponseDto[]): INote[] {
		return dtos.map(GetClientNotesResponseMapper.toDomain);
	}
}
