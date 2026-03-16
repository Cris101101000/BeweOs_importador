import { Result } from "@shared/domain/errors/Result";
import { httpService } from "@shared/infrastructure/services/api-http.service";
import type { ISendWhatsAppRequest } from "src/onboarding/domain/whatsapp-wow/interfaces/send-whatsapp-message.interface";
import type { IWhatsAppWowRepository } from "src/onboarding/domain/whatsapp-wow/ports/whatsapp-wow.port";

export class WhatsAppWowAdapter implements IWhatsAppWowRepository {
	async sendMessage(
		request: ISendWhatsAppRequest
	): Promise<Result<void, Error>> {
		try {
			const response = await httpService.post("/channels/send", request);

			if (!response.success) {
				return Result.Err(
					new Error(
						response.message || "Error al enviar el mensaje de WhatsApp"
					)
				);
			}

			return Result.Ok();
		} catch (error) {
			return Result.Err(
				error instanceof Error
					? error
					: new Error("Error inesperado al enviar mensaje")
			);
		}
	}
}
