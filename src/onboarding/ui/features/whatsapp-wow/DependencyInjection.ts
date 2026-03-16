import { SendWhatsAppMessageUseCase } from "src/onboarding/application/whatsapp-wow";
import type { ISendWhatsAppRequest } from "src/onboarding/domain/whatsapp-wow";
import { WhatsAppWowAdapter } from "src/onboarding/infrastructure/whatsapp-wow";

const repository = new WhatsAppWowAdapter();

export const SendWhatsAppMessage = (request: ISendWhatsAppRequest) =>
	new SendWhatsAppMessageUseCase(repository).execute(request);
