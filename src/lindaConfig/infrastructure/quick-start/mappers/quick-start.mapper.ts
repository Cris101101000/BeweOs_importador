import type { QuickStart } from "../../../domain/quick-starts/interfaces";
import type {
	CreateQuickStartDTO,
	QuickStartItemDTO,
	UpdateQuickStartDTO,
} from "../dtos/quick-start.dto";

export class QuickStartMapper {
	static toDomain(dto: QuickStartItemDTO): QuickStart {
		return {
			id: dto.id,
			text: dto.text,
			icon: dto.icon,
			isActive: dto.isActive,
			createdAt: new Date(dto.createdAt),
		};
	}

	static toDomainList(items: QuickStartItemDTO[]): QuickStart[] {
		return items.map((item) => this.toDomain(item));
	}

	static toCreateDTO(entity: QuickStart): CreateQuickStartDTO {
		return {
			text: entity.text,
			icon: entity.icon,
			type: "quick-start",
			isActive: entity.isActive,
		};
	}

	static toUpdateDTO(entity: Partial<QuickStart>): UpdateQuickStartDTO {
		const dto: UpdateQuickStartDTO = {};

		if (entity.text !== undefined) dto.text = entity.text;
		if (entity.icon !== undefined) dto.icon = entity.icon;
		if (entity.isActive !== undefined) dto.isActive = entity.isActive;

		return dto;
	}
}
