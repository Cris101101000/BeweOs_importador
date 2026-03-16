export enum CommunicationType {
	Email = "email",
	Call = "call",
	Message = "message",
	Whatsapp = "whatsapp",
	InPerson = "meeting",
	Sms = "sms",
	Notification = "notification",
}

export enum CommunicationChannel {
	Phone = "phone",
	Email = "email",
	Whatsapp = "whatsapp",
	InPerson = "in_person",
	Sms = "sms",
}

export enum CommunicationStatus {
	Pending = "pending",
	Sent = "sent",
	Delivered = "delivered",
	Read = "read",
	Answered = "answered",
	Failed = "failed",
	Cancelled = "cancelled",
}

export interface ICommunication {
	id: string;
	companyId: string;
	clientId: string;
	type: CommunicationType;
	channel: CommunicationChannel;
	direction: "outbound" | "inbound";
	status: CommunicationStatus;
	title: string;
	content: string;
	duration: number;
	durationInMinutes: number;
	statusDate: string;
	recipientPhone: string;
	recipientEmail: string;
	campaignId: string;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
}

export interface ICreateCommunicationRequest {
	companyId: string;
	clientId: string;
	channel: CommunicationChannel;
	title?: string;
	content: string;
}

export interface IUpdateCommunicationRequest {
	companyId: string;
	contact?: string;
	channel?: CommunicationChannel;
	content?: string;
}
