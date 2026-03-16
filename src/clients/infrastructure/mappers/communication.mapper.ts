import type {
	CommunicationChannel,
	CommunicationStatus,
	CommunicationType,
	ICommunication,
	ICreateCommunicationRequest,
} from "@clients/domain/interfaces/communication.interface";
import type {
	CommunicationResponseDto,
	CreateCommunicationRequestDto,
} from "../dtos/create-communications.dto";

/**
 * Mapper for converting between domain objects and service DTOs for communications
 */
// biome-ignore lint/complexity/noStaticOnlyClass: Mapper pattern with static methods
export class CommunicationServiceMapper {
	/**
	 * Convert domain CreateCommunicationRequest to service DTO
	 */
	static toCreateCommunicationRequestDto(
		domainData: ICreateCommunicationRequest
	): CreateCommunicationRequestDto {
		return {
			clientId: domainData.clientId,
			channel: domainData.channel,
			subject: domainData.title || "",
			content: domainData.content,
		};
	}

	/**
	 * Convert service response DTO to domain Communication
	 */
	static toDomainCommunication(dto: CommunicationResponseDto): ICommunication {
		return {
			id: dto.id,
			companyId: dto.companyId,
			clientId: dto.clientId,
			type: dto.type as CommunicationType,
			channel: dto.channel as CommunicationChannel,
			direction: dto.direction as "outbound" | "inbound",
			status: dto.status as CommunicationStatus,
			title: dto.subject,
			content: dto.content,
			duration: dto.duration,
			durationInMinutes: dto.durationInMinutes,
			statusDate: dto.statusDate,
			recipientPhone: dto.recipientPhone,
			recipientEmail: dto.recipientEmail,
			campaignId: dto.campaignId,
			createdBy: dto.createdBy,
			createdAt: dto.createdAt,
			updatedAt: dto.updatedAt,
		};
	}

	/**
	 * Convert array of service response DTOs to domain Communications
	 */
	static toDomainCommunicationList(
		dtos: CommunicationResponseDto[]
	): ICommunication[] {
		return dtos.map(CommunicationServiceMapper.toDomainCommunication);
	}

	/**
	 * Helper method to create a mock service response for development
	 */
	static createMockServiceResponse(
		domainData: ICreateCommunicationRequest,
		id?: string
	): CommunicationResponseDto {
		return {
			id: id || `comm-${Date.now()}`,
			clientId: domainData.clientId,
			companyId: domainData.companyId,
			type: domainData.channel,
			channel: domainData.channel,
			direction: "outbound", // Default direction
			status: "pending", // Default status
			subject: domainData.title || "",
			content: domainData.content,
			duration: 0,
			durationInMinutes: 0,
			statusDate: new Date().toISOString(),
			recipientPhone: "",
			recipientEmail: "",
			campaignId: "",
			createdBy: "current-user",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
	}
}
