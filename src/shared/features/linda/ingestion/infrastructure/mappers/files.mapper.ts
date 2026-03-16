import type { IFile } from "../../domain/interfaces/files";
import type { AssetDto } from "../dtos/assets-response.dto";

export class FilesMapper {
	static toDomain(dto: AssetDto): IFile {
		return {
			id: dto.id,
			name: dto.info.originalName,
			type: dto.info.mimeType.split("/")[1] || "",
			size: dto.info.fileSize,
			formattedSize: dto.info.formattedSize,
			createdAt: new Date(dto.createdAt),
			accessUrl: dto.storage.accessUrl,
			contexts: dto.contexts,
			isScraped: dto.metadata?.isScraped ?? false,
		};
	}

	static toDomainList(dtos: AssetDto[]): IFile[] {
		return dtos.map((dto) => FilesMapper.toDomain(dto));
	}
}
