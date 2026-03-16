export interface CreateCommunicationRequestDto {
	clientId: string;
	channel: string;
	subject?: string;
	content: string;
}

export interface UpdateCommunicationRequestDto {
	subject?: string;
	content?: string;
	type?: string;
	status?: string;
}

export interface CommunicationResponseDto {
	id: string;
	companyId: string;
	clientId: string;
	type: string;
	channel: string;
	direction: string;
	status: string;
	subject: string;
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
