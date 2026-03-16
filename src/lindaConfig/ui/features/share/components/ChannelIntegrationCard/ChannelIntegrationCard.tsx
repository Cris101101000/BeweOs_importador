import { Button, Card, H3, IconComponent, Tooltip } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type React from "react";
import { QRCodeDisplay } from "../QRCodeDisplay";
import type { ChannelIntegrationCardProps } from "./ChannelIntegrationCard.types";

/**
 * Tooltip de compartir Linda - Reutilizable para todos los canales
 */
const ShareLindaTooltip: React.FC = () => (
	<div className="px-2 py-2 max-w-xs">
		<div className="text-sm font-semibold mb-2">¿Por qué compartir Linda?</div>
		<p className="text-xs mb-3">
			Cuanto más compartas el chat, más te podrá ayudar Linda tanto a ti como a
			tus clientes para que reciban la atención que se merecen.
		</p>
		<div className="text-xs font-semibold mb-1">💡 Consejos prácticos:</div>
		<ul className="text-xs space-y-1 list-disc list-inside">
			<li>Imprime el QR y colócalo donde tus clientes lo vean</li>
			<li>Comparte el link en tus redes sociales</li>
			<li>Ofrece atención al cliente 24/7 automática</li>
			<li>Mejora la experiencia de tus clientes</li>
		</ul>
	</div>
);

/**
 * Componente de integración de canal reutilizable
 * Muestra los pasos para integrar y compartir Linda en diferentes canales
 */
export const ChannelIntegrationCard: React.FC<ChannelIntegrationCardProps> = ({
	title,
	isChannelActive,
	step1Config,
	onBack,
	shareLink = "",
	onDownloadQR,
	onCopyLink,
}) => {
	const { t } = useTranslate();
	const { activeTitle, inactiveTitle, tooltipContent, actionButton } =
		step1Config;

	// Determinar propiedades del botón según estado
	const buttonLabel =
		isChannelActive && actionButton.activeLabel
			? actionButton.activeLabel
			: actionButton.label;
	const buttonIcon =
		isChannelActive && actionButton.activeIcon
			? actionButton.activeIcon
			: actionButton.icon;
	const buttonVariant =
		isChannelActive && actionButton.activeVariant
			? actionButton.activeVariant
			: actionButton.variant || "solid";
	const buttonColor =
		isChannelActive && actionButton.activeColor
			? actionButton.activeColor
			: actionButton.color || "primary";

	return (
		<Card className="p-6">
			<div className="space-y-8">
				{/* Header con botón atrás y título */}
				<div className="flex items-center gap-3 mb-4">
					<Button
						variant="light"
						color="default"
						size="sm"
						onPress={onBack}
						startContent={
							<IconComponent icon="solar:alt-arrow-left-outline" size="sm" />
						}
					>
						Atrás
					</Button>
					<H3>{title}</H3>
				</div>

				{/* Paso 1: Integrar el canal */}
				<div className="space-y-4">
					<div className="flex items-center gap-3">
						<div
							className={`w-8 h-8 rounded-full flex items-center justify-center ${
								isChannelActive ? "bg-success-100" : "bg-primary-100"
							}`}
						>
							{isChannelActive ? (
								<IconComponent
									icon="solar:check-circle-bold"
									className="w-5 h-5 text-success-600"
								/>
							) : (
								<span className="text-sm font-bold text-primary-600">1</span>
							)}
						</div>
						<div className="flex-1">
							<div className="flex items-center gap-2">
								<h3 className="text-base font-semibold text-gray-900">
									{isChannelActive ? activeTitle : inactiveTitle}
								</h3>
								{tooltipContent && (
									<Tooltip
										content={tooltipContent}
										placement="right"
										className="max-w-sm"
									>
										<div className="cursor-help">
											<IconComponent
												icon="solar:info-circle-bold"
												className="w-4 h-4 text-gray-400 hover:text-gray-600"
											/>
										</div>
									</Tooltip>
								)}
							</div>
						</div>
					</div>

					<div className="flex justify-start">
						<Button
							color={buttonColor}
							variant={buttonVariant}
							size="md"
							onPress={actionButton.onPress}
							startContent={<IconComponent icon={buttonIcon} />}
						>
							{buttonLabel}
						</Button>
					</div>
				</div>

				{/* Paso 2: Compartir Linda */}
				<div
					className={`space-y-4 ${!isChannelActive ? "opacity-50 pointer-events-none" : ""}`}
				>
					<div className="flex items-center gap-3">
						<div
							className={`w-8 h-8 rounded-full flex items-center justify-center ${
								isChannelActive ? "bg-primary-100" : "bg-gray-100"
							}`}
						>
							<span
								className={`text-sm font-bold ${
									isChannelActive ? "text-primary-600" : "text-gray-400"
								}`}
							>
								2
							</span>
						</div>
						<div className="flex-1">
							<div className="flex items-center gap-2">
								<h3 className="text-base font-semibold text-gray-900">
									Compartir Linda
								</h3>
								<Tooltip
									content={<ShareLindaTooltip />}
									placement="right"
									className="max-w-sm"
								>
									<div className="cursor-help">
										<IconComponent
											icon="solar:info-circle-bold"
											className="w-4 h-4 text-gray-400 hover:text-gray-600"
										/>
									</div>
								</Tooltip>
							</div>
							<p className="text-sm text-gray-600">
								{t(
									"share_step2_description",
									"Genera QR y links para que tus clientes accedan a Linda"
								)}
							</p>
						</div>
					</div>

					<QRCodeDisplay
						link={shareLink}
						isDisabled={!isChannelActive}
						onDownload={onDownloadQR}
						onCopyLink={onCopyLink}
						downloadFileName="linda-qr"
					/>
				</div>
			</div>
		</Card>
	);
};
