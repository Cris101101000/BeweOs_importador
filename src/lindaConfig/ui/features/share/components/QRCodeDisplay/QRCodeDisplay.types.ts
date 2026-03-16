export interface IQRCodeDisplayProps {
	/** Link que se codificará en el QR */
	link: string;
	/** Tamaño del QR en píxeles */
	size?: number;
	/** Si el componente está deshabilitado */
	isDisabled?: boolean;
	/** Callback al descargar el QR */
	onDownload?: () => void;
	/** Callback al copiar el link */
	onCopyLink?: () => void;
	/** Nombre del archivo al descargar */
	downloadFileName?: string;
}
