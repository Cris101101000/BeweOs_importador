import { useCallback, useMemo, useState } from "react";
import { WhatsAppWowStep } from "src/onboarding/domain/whatsapp-wow";
import type { ISendWhatsAppRequest } from "src/onboarding/domain/whatsapp-wow";
import { SendWhatsAppMessage } from "../DependencyInjection";

const WHATSAPP_TEMPLATE_ID = "ac70386a-4e6c-40f3-92f9-39aa3d095066";
const WHATSAPP_CHANNEL_ID = "cae033d4-96a3-48b0-a56a-f1eb6f28cd29";
const DEFAULT_AI_NAME = "Linda";

interface UseWhatsAppWowParams {
	businessName: string;
	userName: string;
	userPhone: string;
	agencyName: string;
	userLocale?: string;
}

function buildDefaultMessage(
	userName: string,
	aiName: string,
	agencyName: string
): string {
	return `¡Hola, ${userName}! 👋 Soy ${aiName} , tu asistente en ${agencyName}.
¿Viste lo que acaba de pasar? Este mensaje llegó directo a tu WhatsApp, automáticamente.
Ahora imagina poder hacer lo mismo con cada uno de tus clientes:
Un recordatorio de cita, una promo o un "te extrañamos" — todo sin que tú muevas un dedo.
Todo esto y más te lo encontrarás en ${agencyName}. 🚀`;
}

export const useWhatsAppWow = ({
	businessName,
	userName,
	userPhone,
	agencyName,
	userLocale = "es_ES",
}: UseWhatsAppWowParams) => {
	const [step, setStep] = useState<WhatsAppWowStep>(WhatsAppWowStep.CAMPAIGN);
	const [error, setError] = useState<string | null>(null);

	const resolvedName = userName || "Usuario";
	const resolvedAgency = businessName ||agencyName || "tu negocio";

	const displayMessage = useMemo(
		() => buildDefaultMessage(resolvedName, DEFAULT_AI_NAME, resolvedAgency),
		[resolvedName, resolvedAgency]
	);

	const sendCampaign = useCallback(async () => {
		setStep(WhatsAppWowStep.SENDING);
		setError(null);

		const request: ISendWhatsAppRequest = {
			message: {
				type: "whatsapp",
				direction: "outbound",
				sender: {},
				recipients: [
					{
						name: resolvedName,
						phone: userPhone,
					},
				],
				locale: userLocale,
				content: {
					contentType: "text",
					variables: [
						{
							code: "company_admin_name",
							body: resolvedName,
						},
						{
							code: "agency_ai_name",
							body: DEFAULT_AI_NAME,
						},
						{
							code: "agency_name",
							body: resolvedAgency,
						},
						{
							code: "agency_name_2",
							body: resolvedAgency,
						},
					],
				},
				templateId: WHATSAPP_TEMPLATE_ID,
			},
			channelId: WHATSAPP_CHANNEL_ID,
		};

		const result = await SendWhatsAppMessage(request);

		if (result.isSuccess) {
			setStep(WhatsAppWowStep.SUCCESS);
		} else {
			setError(result.error?.message || "Error al enviar el mensaje");
			setStep(WhatsAppWowStep.ERROR);
		}
	}, [resolvedName, userPhone, resolvedAgency, userLocale]);

	const retrySendCampaign = useCallback(() => {
		sendCampaign();
	}, [sendCampaign]);

	const assistantSpeech = useMemo(() => {
		switch (step) {
			case WhatsAppWowStep.CAMPAIGN:
				return "Generé un mensaje personalizado para ti. Revísalo y cuando estés listo, envíalo.";
			case WhatsAppWowStep.SENDING:
				return "Enviando tu primer mensaje. Revisa tu WhatsApp en unos segundos...";
			case WhatsAppWowStep.SUCCESS:
				return "Lo lograste. Acabas de crear una campaña real en segundos.";
			case WhatsAppWowStep.ERROR:
				return "Hubo un problema al enviar el mensaje. Puedes intentarlo de nuevo.";
			default:
				return "";
		}
	}, [step]);

	return {
		step,
		error,
		displayMessage,
		assistantSpeech,
		sendCampaign,
		retrySendCampaign,
	};
};
