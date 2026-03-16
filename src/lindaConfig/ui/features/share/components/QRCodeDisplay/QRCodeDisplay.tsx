import { Button, IconComponent, useAuraToast } from "@beweco/aurora-ui";
import { configureSuccessToast } from "@shared/utils/toast-config.utils";
import { useTranslate } from "@tolgee/react";
import QRCode from "qrcode";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import type { IQRCodeDisplayProps } from "./QRCodeDisplay.types";

/**
 * Componente para mostrar un código QR con opciones de descarga y copiar link
 */
export const QRCodeDisplay: React.FC<IQRCodeDisplayProps> = ({
	link,
	size = 192,
	isDisabled = false,
	onDownload,
	onCopyLink,
	downloadFileName = "linda-qr",
}) => {
	const { t } = useTranslate();
	const { showToast } = useAuraToast();
	const [isDownloading, setIsDownloading] = useState(false);
	const [isCopied, setIsCopied] = useState(false);

	const handleDownloadQR = async () => {
		if (!link || isDisabled) return;

		try {
			setIsDownloading(true);
			const dataUrl = await QRCode.toDataURL(link, {
				width: 400,
				margin: 2,
				color: {
					dark: "#000000",
					light: "#ffffff",
				},
			});

			const downloadLink = document.createElement("a");
			downloadLink.download = `${downloadFileName}.png`;
			downloadLink.href = dataUrl;
			downloadLink.click();

			showToast(
				configureSuccessToast(
					t("share_qr_downloaded", "QR descargado"),
					t(
						"share_qr_downloaded_description",
						"El código QR se ha descargado correctamente"
					)
				)
			);

			onDownload?.();
		} catch (error) {
			console.error("Error downloading QR:", error);
		} finally {
			setIsDownloading(false);
		}
	};

	const handleCopyLink = async () => {
		if (!link || isDisabled) return;

		try {
			await navigator.clipboard.writeText(link);
			setIsCopied(true);

			showToast(
				configureSuccessToast(
					t("share_link_copied", "Link copiado"),
					t(
						"share_link_copied_description",
						"El link se ha copiado al portapapeles"
					)
				)
			);

			onCopyLink?.();

			setTimeout(() => setIsCopied(false), 2000);
		} catch (error) {
			console.error("Error copying link:", error);
		}
	};

	const showPlaceholder = !link || isDisabled;

	return (
		<div className="flex flex-col md:flex-row items-center md:items-center gap-8">
			{/* QR Code Preview */}
			<div className="flex-shrink-0">
				<div
					className={`w-48 h-48 flex items-center justify-center border-2 shadow-sm ${
						showPlaceholder
							? "bg-gradient-to-br from-gray-50 to-gray-100 border-dashed border-gray-300"
							: "bg-white border-solid border-gray-200"
					}`}
				>
					{showPlaceholder ? (
						<IconComponent
							icon="solar:qr-code-outline"
							className="w-24 h-24 text-gray-400"
						/>
					) : (
						<QRCodeSVG
							value={link}
							size={size}
							level="M"
							includeMargin={false}
							bgColor="#ffffff"
							fgColor="#000000"
						/>
					)}
				</div>
			</div>

			{/* Botones */}
			<div className="flex flex-col gap-3 w-full md:w-auto">
				<Button
					color="primary"
					variant="solid"
					size="md"
					startContent={
						<IconComponent
							icon={
								isDownloading ? "solar:refresh-bold" : "solar:download-bold"
							}
						/>
					}
					isDisabled={showPlaceholder}
					isLoading={isDownloading}
					onPress={handleDownloadQR}
					className="w-full md:w-auto"
				>
					{t("share_download_qr", "Descargar QR")}
				</Button>
				<Button
					color="primary"
					variant="solid"
					size="md"
					startContent={
						<IconComponent
							icon={isCopied ? "solar:check-circle-bold" : "solar:copy-bold"}
						/>
					}
					isDisabled={showPlaceholder}
					onPress={handleCopyLink}
					className="w-full md:w-auto"
				>
					{isCopied
						? t("share_link_copied_button", "¡Copiado!")
						: t("share_copy_link", "Copiar link")}
				</Button>
			</div>
		</div>
	);
};
