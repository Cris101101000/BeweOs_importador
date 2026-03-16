export interface IWhatsAppRecipient {
	name: string;
	phone: string;
}

export interface IWhatsAppVariable {
	code: string;
	body: string;
}

export interface IWhatsAppContent {
	contentType: "text";
	variables: IWhatsAppVariable[];
}

export interface IWhatsAppMessagePayload {
	type: "whatsapp";
	direction: "outbound";
	sender: Record<string, never>;
	recipients: IWhatsAppRecipient[];
	locale: string;
	content: IWhatsAppContent;
	templateId: string;
}

export interface ISendWhatsAppRequest {
	message: IWhatsAppMessagePayload;
	channelId: string;
}
