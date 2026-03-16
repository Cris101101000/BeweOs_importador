import type { Result } from "@shared/domain/errors/Result";
import type { ISendWhatsAppRequest } from "../interfaces/send-whatsapp-message.interface";

export interface IWhatsAppWowRepository {
	sendMessage(request: ISendWhatsAppRequest): Promise<Result<void, Error>>;
}
