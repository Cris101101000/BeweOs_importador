import type { ICommunication } from "@clients/domain/interfaces/communication.interface";
import {
	CommunicationChannel,
	CommunicationStatus,
	CommunicationType,
} from "@clients/domain/interfaces/communication.interface";
import type { GetClientCommunicationsResponseDto } from "../dtos/get-client-communications.dto";

// biome-ignore lint/complexity/noStaticOnlyClass: Mapper pattern with static methods
export class GetClientCommunicationsResponseMapper {
	static toDomain(dto: GetClientCommunicationsResponseDto): ICommunication {
		return {
			id: dto.id,
			clientId: dto.clientId,
			companyId: dto.companyId,
			type: GetClientCommunicationsResponseMapper.mapType(dto.type),
			channel: GetClientCommunicationsResponseMapper.mapChannel(dto.channel),
			direction: dto.direction,
			status: GetClientCommunicationsResponseMapper.mapStatus(dto.status),
			title: dto.subject,
			content: dto.content,
			duration: dto.duration,
			durationInMinutes: dto.durationInMinutes,
			statusDate: dto.statusDate,
			recipientPhone: dto.recipientPhone,
			recipientEmail: dto.recipientEmail,
			campaignId: dto.campaignId,
			createdBy: dto.createdBy || "",
			createdAt: dto.createdAt,
			updatedAt: dto.updatedAt || "",
		};
	}

	static toDomainList(
		dtos: GetClientCommunicationsResponseDto[]
	): ICommunication[] {
		return dtos.map(GetClientCommunicationsResponseMapper.toDomain);
	}

	private static mapType(type: string): CommunicationType {
		switch (type) {
			case "call":
				return CommunicationType.Call;
			case "message":
				return CommunicationType.Message;
			case "email":
				return CommunicationType.Email;
			case "sms":
				return CommunicationType.Sms;
			case "whatsapp":
				return CommunicationType.Whatsapp;
			case "meeting":
				return CommunicationType.InPerson;
			case "notification":
				return CommunicationType.Notification;
			default:
				return CommunicationType.Email;
		}
	}

	private static mapChannel(channel: string): CommunicationChannel {
		switch (channel) {
			case "phone":
				return CommunicationChannel.Phone;
			case "email":
				return CommunicationChannel.Email;
			case "sms":
				return CommunicationChannel.Sms;
			case "whatsapp":
				return CommunicationChannel.Whatsapp;
			case "in_person":
				return CommunicationChannel.InPerson;
			default:
				return CommunicationChannel.Email;
		}
	}

	private static mapStatus(status: string): CommunicationStatus {
		switch (status) {
			case "pending":
				return CommunicationStatus.Pending;
			case "sent":
				return CommunicationStatus.Sent;
			case "delivered":
				return CommunicationStatus.Delivered;
			case "read":
				return CommunicationStatus.Read;
			case "answered":
				return CommunicationStatus.Answered;
			case "failed":
				return CommunicationStatus.Failed;
			case "cancelled":
				return CommunicationStatus.Cancelled;
			default:
				return CommunicationStatus.Pending;
		}
	}
}
