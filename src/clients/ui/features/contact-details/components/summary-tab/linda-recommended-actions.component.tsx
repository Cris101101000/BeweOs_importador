import {
	Button,
	Card,
	CardBody,
	CardHeader,
	H3,
	IconComponent,
	P,
} from "@beweco/aurora-ui";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import { getClientFullName } from "@clients/domain/utils/client-name.utils";
import { useCreateNoteModal } from "@clients/ui/_shared/contexts/create-note-modal.context";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

interface LindaRecommendedActionsProps {
	client: IClient;
}

interface RecommendedAction {
	id: string;
	type: "whatsapp_campaign" | "email" | "note";
	title: string;
	description: string;
	affectedClients?: number;
	icon: string;
	iconColor: string;
	generatedImage?: string;
	generatedCaption?: string;
}

/**
 * Linda Recommended Actions Component
 *
 * Displays AI-powered recommended actions for the client including:
 * - WhatsApp campaigns (showing similar clients count)
 * - Email suggestions
 * - Note reminders
 */
export const LindaRecommendedActions: FC<LindaRecommendedActionsProps> = ({
	client,
}) => {
	const { t } = useTranslate();
	const navigate = useNavigate();
	const { openModal: openNoteModal } = useCreateNoteModal();

	// Mock data - In production, this would come from Linda's API
	const recommendedActions: RecommendedAction[] = [
		{
			id: "1",
			type: "whatsapp_campaign",
			title: "Campaña de Reactivación",
			description:
				"Este cliente lleva tiempo sin actividad. Linda sugiere una campaña personalizada para reconectar.",
			affectedClients: 23,
			icon: "solar:chat-round-line-bold",
			iconColor: "text-green-500",
			generatedImage:
				"https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=800&fit=crop",
			generatedCaption: `¡Hola ${getClientFullName(client)}! 👋

Te extrañamos y queremos reconectar contigo. 

🎁 Tenemos una oferta especial pensada solo para ti:
✨ 20% de descuento en tu próxima visita
⏰ Válido hasta fin de mes

¿Cuándo te gustaría volver a visitarnos?

¡Esperamos verte pronto!`,
		},
		{
			id: "2",
			type: "whatsapp_campaign",
			title: "Oferta de Cumpleaños",
			description:
				"Su cumpleaños se acerca. Envía una campaña especial para celebrar con una oferta exclusiva.",
			affectedClients: 8,
			icon: "solar:gift-bold",
			iconColor: "text-purple-500",
			generatedImage:
				"https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=800&fit=crop",
			generatedCaption: `🎉 ¡Feliz Cumpleaños ${getClientFullName(client)}! 🎂

Queremos celebrar este día especial contigo.

🎁 Regalo de cumpleaños:
💝 Servicio especial completamente GRATIS
🌟 + 30% de descuento en servicios adicionales

Válido durante todo tu mes de cumpleaños.

¡Agenda tu cita y celebra con nosotros! 🥳`,
		},
		{
			id: "3",
			type: "note",
			title: "Actualizar Información",
			description:
				"Necesito más información sobre las preferencias de este cliente. ¿Podrías añadir una nota? Esto me ayudará a ser más inteligente y a entender mejor sus necesidades.",
			icon: "solar:document-add-bold",
			iconColor: "text-blue-500",
		},
	];

	const handleActionClick = (action: RecommendedAction) => {
		if (action.type === "whatsapp_campaign") {
			// Navigate to campaign creation wizard at publication step (step 6)
			// with pre-populated content from Linda's recommendation
			navigate("/campanas/crear-campana", {
				state: {
					editMode: true,
					currentStep: 6, // Publication step
					selectedContentType: "whatsapp",
					generatedImage: action.generatedImage,
					generatedCaption: action.generatedCaption,
					itemId: action.id,
					clientSuggestion: {
						clientId: client.id,
						clientName: getClientFullName(client),
						recommendationId: action.id,
					},
				},
			});
		} else if (action.type === "email") {
			// Navigate to campaign creation wizard for email at publication step
			// with pre-populated content from Linda's recommendation
			navigate("/campanas/crear-campana", {
				state: {
					editMode: true,
					currentStep: 6, // Publication step
					selectedContentType: "email",
					generatedImage: action.generatedImage,
					generatedCaption: action.generatedCaption,
					itemId: action.id,
					clientSuggestion: {
						clientId: client.id,
						clientName: getClientFullName(client),
						recommendationId: action.id,
					},
				},
			});
		} else if (action.type === "note") {
			// Open note creation modal
			// Note: This opens the modal to add more information for Linda's recommendations
			openNoteModal(client);
		}
	};

	const handleDismissAction = (actionId: string) => {
		// TODO: Implement dismiss functionality
		console.log("Dismiss action:", actionId);
	};

	return (
		<Card radius="sm" className="border border-default-200">
			<CardHeader className="pb-2">
				<div className="flex items-center gap-2">
					<IconComponent
						icon="solar:magic-stick-3-bold"
						className="text-primary"
						size={"md"}
					/>
					<H3 className="text-base font-semibold text-default-900">
						{t("linda_recommended_actions", "Acciones Recomendadas por Linda")}
					</H3>
				</div>
			</CardHeader>
			<CardBody className="pt-2">
				<div className="flex flex-col gap-2">
					{recommendedActions.map((action) => (
						<div
							key={action.id}
							className="flex items-center justify-between p-3 border border-default-200 rounded-lg hover:border-default-300 transition-colors"
						>
							<div className="flex-1 min-w-0">
								<P className="text-sm font-medium text-default-900 mb-0.5">
									{action.title}
								</P>
								<P className="text-xs text-default-600 mb-1">
									{action.description}
								</P>
								{action.affectedClients && (
									<P className="text-xs text-default-400">
										{action.type === "whatsapp_campaign" ||
										action.type === "email"
											? t(
													"campaign_applies_to_more",
													"Esta campaña aplica para {{count}} personas más",
													{
														count: action.affectedClients,
													}
												)
											: ""}
									</P>
								)}
							</div>
							<div className="flex items-center gap-1 ml-3">
								<Button
									variant="light"
									size="sm"
									isIconOnly
									onPress={() => handleActionClick(action)}
									className="text-primary hover:bg-primary-50 min-w-9 w-9 h-9"
									startContent={
										<IconComponent icon="solar:eye-outline" size={"sm"} />
									}
								/>
								<Button
									variant="light"
									size="sm"
									isIconOnly
									onPress={() => handleDismissAction(action.id)}
									className="text-default-400 hover:bg-default-50 min-w-9 w-9 h-9"
									startContent={
										<IconComponent
											icon="solar:close-circle-outline"
											size={"sm"}
										/>
									}
								/>
							</div>
						</div>
					))}
				</div>
			</CardBody>
		</Card>
	);
};
