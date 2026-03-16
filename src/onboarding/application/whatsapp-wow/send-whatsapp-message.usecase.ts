import type { Result } from "@shared/domain/errors/Result";
import type { ISendWhatsAppRequest } from "src/onboarding/domain/whatsapp-wow/interfaces/send-whatsapp-message.interface";
import type { IWhatsAppWowRepository } from "src/onboarding/domain/whatsapp-wow/ports/whatsapp-wow.port";

export class SendWhatsAppMessageUseCase {
	constructor(private readonly repository: IWhatsAppWowRepository) {}

	async execute(request: ISendWhatsAppRequest): Promise<Result<void, Error>> {
		return await this.repository.sendMessage(request);
	}
}
