import { Card, H3, Skeleton, useAuraToast } from "@beweco/aurora-ui";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import { configureErrorToastWithTranslation } from "@shared/utils/toast-config.utils";
import { useTranslate } from "@tolgee/react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateEmbedScript } from "src/lindaConfig/application/share/generate-embed-script.helper";
import { getShareLinkForChannel } from "src/lindaConfig/application/share/generate-share-link.helper";
import type { ShareChannelType } from "src/lindaConfig/domain/share/types";
import { useChannels } from "../../../_shared";
import { ChannelCard, ChannelIntegrationCard } from "../components";

export const ShareScreen = () => {
	const navigate = useNavigate();
	const { showToast } = useAuraToast();
	const { t } = useTranslate();
	const [selectedShareChannel, setSelectedShareChannel] =
		useState<ShareChannelType | null>(null);
	const [copiedScript, setCopiedScript] = useState(false);

	// Obtener estado de canales desde la API
	const {
		channelStatus,
		channelActiveStatus,
		channelAccounts,
		isLoading,
		error,
	} = useChannels();

	// Generar link de compartir según el canal seleccionado
	const currentShareLink = useMemo(() => {
		if (!selectedShareChannel) return "";
		return getShareLinkForChannel(selectedShareChannel, channelAccounts);
	}, [selectedShareChannel, channelAccounts]);

	// Mostrar toast de error cuando falla la carga de integraciones
	useEffect(() => {
		if (error) {
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Network,
					t,
					"share_integrations_error",
					"share_integrations_error_description"
				)
			);
		}
	}, [error, showToast, t]);

	const handleCopyScript = () => {
		const script = generateEmbedScript({
			apiKey: window.USER_SESSION?.pk || "",
		});
		navigator.clipboard.writeText(script);
		setCopiedScript(true);
		setTimeout(() => setCopiedScript(false), 2000);
	};

	const handleShareChannelSelect = (channel: ShareChannelType) => {
		setSelectedShareChannel(channel);
	};

	const handleBackToChannels = () => {
		setSelectedShareChannel(null);
	};

	// Mostrar skeleton mientras se cargan los datos
	if (isLoading) {
		return (
			<div className="space-y-6">
				<Skeleton className="h-8 w-64 rounded-lg" />
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{[1, 2, 3].map((i) => (
						<Card key={i} className="p-4 h-40">
							<div className="flex flex-col items-center space-y-3">
								<Skeleton className="h-12 w-12 rounded-full" />
								<Skeleton className="h-5 w-24 rounded-lg" />
								<Skeleton className="h-8 w-20 rounded-lg" />
							</div>
						</Card>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{!selectedShareChannel ? (
				/* Vista de selección de canales */
				<div>
					<H3 className="mb-6">Comparte Linda en más canales</H3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
						<ChannelCard
							channelType="web"
							title="Web"
							icon="solar:global-bold"
							iconBgColor="bg-blue-100"
							iconActiveColor="text-blue-600"
							isIntegrated={channelStatus.web}
							isActive={channelActiveStatus.web}
							onShare={() => handleShareChannelSelect("web")}
							onIntegrate={() => navigate("/integrations")}
						/>

						<ChannelCard
							channelType="instagram"
							title="Instagram"
							icon="simple-icons:instagram"
							iconBgColor="bg-pink-100"
							iconActiveColor="text-pink-600"
							isIntegrated={channelStatus.instagram}
							isActive={channelActiveStatus.instagram}
							accountInfo={channelAccounts.instagram}
							onShare={() => handleShareChannelSelect("instagram")}
							onIntegrate={() => navigate("/integrations")}
						/>

						<ChannelCard
							channelType="whatsapp"
							title="WhatsApp"
							icon="simple-icons:whatsapp"
							iconBgColor="bg-green-100"
							iconActiveColor="text-green-600"
							isIntegrated={channelStatus.whatsapp}
							isActive={channelActiveStatus.whatsapp}
							accountInfo={channelAccounts.whatsapp}
							onShare={() => handleShareChannelSelect("whatsapp")}
							onIntegrate={() => navigate("/integrations")}
						/>
					</div>
				</div>
			) : selectedShareChannel === "web" ? (
				/* Vista de Web - Dos pasos: Integrar y Compartir */
				<ChannelIntegrationCard
					channelType="web"
					title={t("share_web_title", "Integración Web")}
					isChannelActive={channelStatus.web}
					onBack={handleBackToChannels}
					shareLink={currentShareLink}
					step1Config={{
						activeTitle: t(
							"share_web_active_title",
							"Linda está activa en tu sitio web"
						),
						inactiveTitle: t(
							"share_web_inactive_title",
							"Copia el script y pégalo antes del cierre de </body> en tu web"
						),
						tooltipContent: (
							<div className="px-2 py-2 max-w-xs">
								<div className="text-sm font-semibold mb-2">
									{t(
										"share_web_tooltip_title",
										"¿Cómo integrar Linda en tu web?"
									)}
								</div>
								<ol className="text-xs space-y-1 list-decimal list-inside">
									<li>
										{t(
											"share_web_tooltip_step1",
											"Copia el script haciendo clic en el botón"
										)}
									</li>
									<li>
										{t(
											"share_web_tooltip_step2",
											"Abre el código HTML de tu sitio web"
										)}
									</li>
									<li>
										{t(
											"share_web_tooltip_step3",
											"Pega el script justo antes del cierre de la etiqueta"
										)}{" "}
										<code className="bg-gray-700 px-1 rounded">
											&lt;/body&gt;
										</code>
									</li>
									<li>
										{t(
											"share_web_tooltip_step4",
											"Guarda los cambios y publica tu sitio"
										)}
									</li>
									<li>
										{t(
											"share_web_tooltip_step5",
											"¡Linda aparecerá como un widget flotante!"
										)}
									</li>
								</ol>
							</div>
						),
						actionButton: {
							label: t("share_copy_script", "Copiar script de integración"),
							activeLabel: copiedScript
								? t("share_script_copied", "¡Script copiado!")
								: t("share_copy_script", "Copiar script de integración"),
							icon: "solar:copy-bold",
							activeIcon: copiedScript
								? "solar:check-circle-bold"
								: "solar:copy-bold",
							onPress: handleCopyScript,
							variant: "solid",
							activeVariant: channelStatus.web ? "flat" : "solid",
							color: "primary",
							activeColor: copiedScript ? "success" : "primary",
						},
					}}
				/>
			) : (
				/* Vista de Instagram/WhatsApp - Dos pasos: Integrar y Compartir */
				<ChannelIntegrationCard
					channelType={selectedShareChannel}
					title={
						selectedShareChannel === "instagram"
							? t("share_instagram_title", "Integración Instagram")
							: t("share_whatsapp_title", "Integración WhatsApp")
					}
					isChannelActive={
						selectedShareChannel === "instagram"
							? channelStatus.instagram
							: channelStatus.whatsapp
					}
					onBack={handleBackToChannels}
					shareLink={currentShareLink}
					step1Config={{
						activeTitle: t(
							"share_channel_active_title",
							"Linda está activa en este canal"
						),
						inactiveTitle: t(
							"share_channel_inactive_title",
							"Conecta tu cuenta para activar Linda"
						),
						actionButton: {
							label: t("share_go_to_integrations", "Ir a Integraciones"),
							icon: "solar:link-bold",
							onPress: () => navigate("/integrations"),
							variant: "solid",
							color: "primary",
						},
					}}
				/>
			)}
		</div>
	);
};
