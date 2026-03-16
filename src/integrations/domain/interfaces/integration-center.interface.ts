import type { IntegrationStatus } from "../enums/integration-status.enum";

/**
 * Interface para los items del Integration Center
 *
 * @property id - ID único del canal
 * @property agencyId - ID de la agencia a la que pertenece el canal (null si pertenece a un centro)
 * @property companyId - ID del centro al que pertenece el canal (null si pertenece a una agencia)
 * @property type - Tipo de canal: whatsapp o instagram
 * @property name - Nombre del canal (nombre del negocio en el canal, no necesariamente el de Bewe)
 * @property handler - Identificador del canal: número de teléfono (whatsapp) o username (instagram)
 * @property status - Estado del canal: registering, enabled o disabled
 * @property createdAt - Fecha de creación
 * @property updatedAt - Fecha de última actualización
 * @property deletedAt - Fecha de eliminación (null si no está eliminado)
 *
 * Nota: Un canal tendrá agencyId o companyId, pero nunca los dos
 */
export interface IIntegrationCenterItem {
	id: string;
	agencyId: string | null;
	companyId: string | null;
	type: IntegrationCenterType;
	name: string;
	handler: string;
	status: IntegrationStatus;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

/**
 * Tipo de canal
 */
export enum IntegrationCenterType {
	WHATSAPP = "whatsapp",
	INSTAGRAM = "instagram",
	// TODO: Add other channels here
	// - Facebook
	// - Telegram
	// - Metricool
	// - Google Business
	// - Facebook Pages
}
