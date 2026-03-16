import {
	type IIntegration,
	type IIntegrationPort,
	type IWhatsAppBusinessPort,
	IntegrationStatus,
} from "../domain";

export class ConnectWhatsAppBusinessUseCase {
	constructor(
		private readonly whatsAppBusinessPort: IWhatsAppBusinessPort,
		private readonly integrationPort: IIntegrationPort
	) {}

	async execute(): Promise<string> {
		try {
			// RN-01: Verificar si ya existe una línea activa
			const hasExistingLine =
				await this.whatsAppBusinessPort.validateExistingLine();
			if (hasExistingLine) {
				throw new Error("Ya existe una línea activa");
			}

			// Iniciar flujo OAuth
			const oauthUrl = await this.whatsAppBusinessPort.initiateOAuth();
			return oauthUrl;
		} catch (error) {
			console.error("Error initiating WhatsApp Business connection:", error);
			throw error;
		}
	}

	async handleCallback(code: string): Promise<IIntegration> {
		try {
			// Manejar callback de OAuth
			const integration =
				await this.whatsAppBusinessPort.handleOAuthCallback(code);

			// Actualizar estado a PENDING
			await this.integrationPort.updateIntegrationStatus(
				integration.id,
				IntegrationStatus.REGISTERING
			);

			return integration;
		} catch (error) {
			console.error("Error handling OAuth callback:", error);

			// Si el usuario cancela el flujo, registrar evento INT-WABA-CANCEL
			if (
				(error as Error).message?.includes("cancelled") ||
				(error as Error).message?.includes("denied")
			) {
				// TODO: Registrar evento INT-WABA-CANCEL
				console.log("OAuth flow cancelled by user");
			}

			throw error;
		}
	}

	async verifyPhoneNumber(
		integrationId: string,
		phoneId: string
	): Promise<boolean> {
		try {
			const isVerified =
				await this.whatsAppBusinessPort.verifyPhoneNumber(phoneId);

			if (isVerified) {
				// Actualizar estado a ACTIVE
				await this.integrationPort.updateIntegrationStatus(
					integrationId,
					IntegrationStatus.ENABLED
				);
			}

			return isVerified;
		} catch (error) {
			console.error("Error verifying phone number:", error);
			throw error;
		}
	}
}
