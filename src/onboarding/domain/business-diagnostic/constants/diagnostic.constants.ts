import { ContactRangeId } from "../../contact-volume/enums/contact-range.enum";
import { PainPointId } from "../../pain-points/enums/pain-point.enum";
import { VerticalId } from "../../business-vertical/enums/vertical.enum";
import type { IDiagnosticResult } from "../interfaces/diagnostic.interface";

export const getContactVolumeMultiplier = (contactRange: ContactRangeId): number => {
	switch (contactRange) {
		case ContactRangeId.MENOS_50:
			return 0.7;
		case ContactRangeId.RANGE_50_100:
			return 0.9;
		case ContactRangeId.RANGE_100_300:
			return 1;
		case ContactRangeId.RANGE_300_500:
			return 1.25;
		case ContactRangeId.RANGE_500_1000:
			return 1.5;
		case ContactRangeId.MAS_1000:
			return 1.8;
		default:
			return 1;
	}
};

export const getVerticalMultiplier = (vertical: VerticalId): number => {
	switch (vertical) {
		case VerticalId.BELLEZA_CUIDADO_PERSONAL:
			return 1;
		case VerticalId.FITNESS_BIENESTAR:
			return 1.1;
		case VerticalId.SALUD_MEDICINA:
			return 1.2;
		case VerticalId.COMIDA_BEBIDA:
			return 0.85;
		case VerticalId.SERVICIOS_PROFESIONALES:
			return 1.15;
		case VerticalId.RETAIL_ECOMMERCE:
			return 1.05;
		case VerticalId.SERVICIOS_HOGAR:
			return 1.1;
		case VerticalId.EDUCACION_FORMACION:
			return 0.95;
		case VerticalId.TURISMO_ENTRETENIMIENTO:
			return 1.25;
		case VerticalId.INMOBILIARIA:
			return 1.35;
		case VerticalId.EVENTOS:
			return 1.2;
		case VerticalId.OTRO:
			return 1;
		default:
			return 1;
	}
};

export const getPainPointWeight = (painPoint: PainPointId): number => {
	switch (painPoint) {
		case PainPointId.TIEMPO_RESPUESTA:
			return 1;
		case PainPointId.ORGANIZACION_CONTACTOS:
			return 0.8;
		case PainPointId.SEGUIMIENTO_MANUAL:
			return 1.1;
		case PainPointId.CONTENIDO_REDES:
			return 0.6;
		case PainPointId.MENSAJES_MASIVOS:
			return 0.9;
		default:
			return 1;
	}
};

export const calculateDiagnostic = ({
	painPoints,
	contactRange,
	vertical,
}: {
	painPoints: PainPointId[];
	contactRange: ContactRangeId;
	vertical: VerticalId;
}): IDiagnosticResult => {
	const painMultiplier =
		painPoints.reduce((sum, painPoint) => sum + getPainPointWeight(painPoint), 0) /
		Math.max(painPoints.length, 1);
	const volumeMultiplier = getContactVolumeMultiplier(contactRange);
	const verticalMultiplier = getVerticalMultiplier(vertical);
	const baseFactor = painMultiplier * volumeMultiplier * verticalMultiplier;

	const hoursBase = 38;
	const moneyBase = 1150;
	const leadsBase = 42;

	const hoursMid = Math.round(hoursBase * baseFactor);
	const moneyMid = Math.round(moneyBase * baseFactor);
	const leadsMid = Math.round(leadsBase * baseFactor);

	return {
		horasAhorradas: {
			min: Math.max(12, Math.round(hoursMid * 0.8)),
			max: Math.max(20, Math.round(hoursMid * 1.2)),
			fuente: "Benchmark SMB LATAM",
		},
		dineroPerdido: {
			min: Math.max(400, Math.round(moneyMid * 0.8)),
			max: Math.max(700, Math.round(moneyMid * 1.2)),
			fuente: "Conversion data 2025",
		},
		clientesAdicionales: {
			min: Math.max(10, Math.round(leadsMid * 0.8)),
			max: Math.max(16, Math.round(leadsMid * 1.2)),
			fuente: "CRM uplift benchmark",
		},
	};
};
