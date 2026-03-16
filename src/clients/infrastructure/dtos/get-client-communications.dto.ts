export interface GetClientCommunicationsResponseDto {
	id: string;
	companyId: string;
	clientId: string;
	type:
		| "call"
		| "message"
		| "email"
		| "sms"
		| "whatsapp"
		| "meeting"
		| "notification";
	channel: "phone" | "email" | "sms" | "whatsapp" | "in_person";
	direction: "outbound" | "inbound";
	status:
		| "pending"
		| "sent"
		| "delivered"
		| "read"
		| "answered"
		| "failed"
		| "cancelled";
	subject: string;
	content: string;
	duration: number;
	durationInMinutes: number;
	statusDate: string;
	recipientPhone: string;
	recipientEmail: string;
	campaignId: string;
	createdAt: string;
	updatedAt?: string;
	createdBy?: string;
}
