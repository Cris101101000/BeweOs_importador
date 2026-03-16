import type {
	IIntegrationNotificationPort,
	IIntegrationSyncMonitor,
	IWhatsAppBusinessPort,
} from "../domain";

export class GetSyncMonitorUseCase {
	constructor(
		private readonly whatsAppBusinessPort: IWhatsAppBusinessPort,
		private readonly notificationPort: IIntegrationNotificationPort
	) {}

	async execute(integrationId: string): Promise<IIntegrationSyncMonitor> {
		try {
			const syncMonitor =
				await this.whatsAppBusinessPort.getSyncMonitor(integrationId);

			// Verificar si el token está por expirar (7 días de antelación)
			if (syncMonitor.tokenExpiresIn <= 7) {
				await this.notificationPort.notifyTokenExpiration(
					integrationId,
					syncMonitor.tokenExpiresIn
				);
			}

			return syncMonitor;
		} catch (error) {
			console.error("Error fetching sync monitor:", error);
			throw new Error("Failed to fetch sync monitor");
		}
	}
}
