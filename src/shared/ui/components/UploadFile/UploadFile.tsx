import { UploadFile } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";

/**
 * Configuración para el recorte de imágenes
 */
export interface CropConfig {
	/** Ancho objetivo en píxeles */
	targetWidth: number;
	/** Alto objetivo en píxeles */
	targetHeight: number;
	/** Texto del botón de guardar recorte */
	textButton?: string;
	/** Color del botón de guardar recorte */
	colorButton?: string;
}

/**
 * Traducciones personalizables para el componente
 */
export interface UploadTranslations {
	/** Texto principal del área de carga */
	uploadText?: string;
	/** Texto secundario con información adicional */
	subText?: string;
	/** Texto mostrado cuando se arrastra un archivo */
	dragText?: string;
	/** Error cuando se intenta subir múltiples archivos */
	multipleFilesError?: string;
	/** Error cuando se excede el número máximo de archivos */
	maxFilesError?: string;
	/** Error cuando el tipo de archivo no es válido */
	invalidFileTypeError?: string;
	/** Error cuando el tamaño de archivo excede el límite */
	maxFileSizeError?: string;
	/** Etiqueta ARIA para el botón de remover archivo */
	removeFileAriaLabel?: string;
	/** Etiqueta ARIA para el área de carga */
	uploadAreaAriaLabel?: string;
	/** Título del modal de recorte */
	cropModalTitle?: string;
	/** Texto del botón guardar en modal de recorte */
	cropSaveButton?: string;
	/** Texto del botón cancelar en modal de recorte */
	cropCancelButton?: string;
	/** Etiqueta para el control de zoom */
	cropZoomLabel?: string;
	/** Instrucciones para el recorte */
	cropInstructions?: string;
	/** Etiqueta para el color de fondo */
	cropBackgroundLabel?: string;
	/** Opción de fondo blanco */
	cropBackgroundWhite?: string;
	/** Opción de fondo negro */
	cropBackgroundBlack?: string;
	/** Opción de fondo transparente */
	cropBackgroundTransparent?: string;
}

/**
 * Props del componente UploadFileComponent
 */
export interface UploadFileComponentProps {
	/** Tipos de archivo aceptados (string con patrones como "image/*,.pdf" o array de MIME types) */
	acceptedFiles?: string | string[];
	/** Configuración para recorte de imagen (opcional) */
	cropConfig?: CropConfig;
	/** Número máximo de archivos permitidos */
	maxFiles?: number;
	/** Tamaño del componente (micro: 64x64px, small: 100x100px, medium: 200x200px, large: 100% width) */
	size?: "micro" | "small" | "medium" | "large";
	/** Ancho del componente */
	width?: string | number;
	/** Alto del componente */
	height?: string | number;
	/** Icono a mostrar en el área de carga */
	icon?: string;
	/** Traducciones personalizadas */
	translations?: UploadTranslations;
	/** Callback ejecutado cuando ocurre un error */
	onError?: (error: string) => void;
	/** Callback ejecutado cuando se suben archivos */
	onUpload?: (files: File[]) => void;
	/** Deshabilita el componente */
	disabled?: boolean;
	/** Tamaño máximo de archivo en bytes */
	maxFileSize?: number;
	/** Texto principal del área de carga (alternativa a translations.uploadText) */
	text?: string;
	/** Color del texto principal */
	textColor?: string;
	/** Texto secundario (alternativa a translations.subText) */
	subText?: string;
	/** Permite selección múltiple de archivos */
	multiple?: boolean;
	/** Estado de error del componente */
	error?: boolean;
	/** Estado de éxito del componente */
	success?: boolean;
	/** Texto del error a mostrar */
	errorText?: string;
	/** Color del borde del componente */
	borderColor?: string;
	/** Color del icono */
	iconColor?: string;
	/** Color de fondo del componente */
	backgroundColor?: string;
	/** Archivo de imagen preseleccionado */
	image?: File;
	/** Clases CSS personalizadas */
	className?: string;
}

/**
 * Traducciones por defecto para el componente (en español)
 * Estas se usan cuando no se proporcionan translations personalizadas
 * y cuando no se usan las props directas text/subText
 */
const defaultTranslationKeys = {
	uploadText: "upload_text",
	subText: "upload_sub_text",
	dragText: "upload_drag_text",
	multipleFilesError: "upload_errors_multiple_files",
	maxFilesError: "upload_errors_max_files",
	invalidFileTypeError: "upload_errors_invalid_file_type",
	maxFileSizeError: "upload_errors_max_file_size",
	removeFileAriaLabel: "upload_aria_remove_file",
	uploadAreaAriaLabel: "upload_aria_upload_area",
	cropModalTitle: "upload_crop_title",
	cropSaveButton: "upload_crop_save",
	cropCancelButton: "upload_crop_cancel",
	cropZoomLabel: "upload_crop_zoom",
	cropInstructions: "upload_crop_instructions",
	cropBackgroundLabel: "upload_crop_background_label",
	cropBackgroundWhite: "upload_crop_background_white",
	cropBackgroundBlack: "upload_crop_background_black",
	cropBackgroundTransparent: "upload_crop_background_transparent",
};

/**
 * Valores por defecto para cuando no hay traducciones disponibles
 */
const fallbackTranslations: Required<UploadTranslations> = {
	uploadText: "Haz clic o arrastra y suelta tus archivos aquí",
	subText: "Selecciona los archivos que deseas subir",
	dragText: "Suelta los archivos aquí",
	multipleFilesError: "Solo puedes subir un archivo a la vez",
	maxFilesError: "Puedes subir máximo {maxFiles} archivos",
	invalidFileTypeError: "Solo se aceptan archivos de tipo: {acceptedTypes}",
	maxFileSizeError: "El archivo excede el tamaño máximo permitido de {maxSize}",
	removeFileAriaLabel: "Remover archivo",
	uploadAreaAriaLabel: "Área de carga de archivos",
	cropModalTitle: "Recortar imagen",
	cropSaveButton: "Guardar",
	cropCancelButton: "Cancelar",
	cropZoomLabel: "Zoom",
	cropInstructions:
		"Arrastra para mover la imagen y usa el zoom para ajustar el tamaño",
	cropBackgroundLabel: "Color de fondo",
	cropBackgroundWhite: "Blanco",
	cropBackgroundBlack: "Negro",
	cropBackgroundTransparent: "Transparente",
};

/**
 * Componente de carga de archivos altamente configurable
 *
 * Este componente permite la carga de archivos con las siguientes características:
 * - ✅ Soporte para drag & drop
 * - ✅ Validación de tipos de archivo
 * - ✅ Limitación de número de archivos y selección múltiple
 * - ✅ Recorte de imágenes opcional
 * - ✅ Estados visuales (error, success, disabled)
 * - ✅ Traducciones completamente personalizables
 * - ✅ Textos configurables via props directas o translations
 * - ✅ Callbacks para manejo de errores y archivos subidos
 * - ✅ Personalización visual completa (colores, fondos, bordes)
 * - ✅ Archivo preseleccionado (imagen inicial)
 * - ✅ Configuración avanzada de recorte
 * - ✅ Clases CSS personalizables
 * - ✅ 4 tamaños predefinidos completamente adaptativos
 *
 * ## 📐 Tamaños Disponibles
 *
 * El componente soporta 4 tamaños predefinidos mediante la prop `size`. Todos los tamaños son completamente adaptativos:
 * - **micro**: 64x64px - Icono + texto en pantallas grandes (≥640px), solo icono en móviles (<640px)
 * - **small**: 100x100px - Icono + texto en pantallas grandes (≥640px), solo icono en móviles (<640px)
 * - **medium**: 200x200px - Icono + texto en pantallas grandes (≥640px), solo icono en móviles (<640px)
 * - **large**: 100% width - Icono + texto en pantallas grandes (≥640px), solo icono en móviles (<640px)
 *
 * ## 📝 Configuración de Textos
 *
 * Puedes configurar los textos de dos formas:
 * 1. **Props directas**: `text` y `subText` (más simple para casos básicos)
 * 2. **Objeto translations**: Para internacionalización completa y control total
 *
 * Las props directas tienen prioridad sobre las translations.
 *
 * @example
 * // Uso básico para cualquier tipo de archivo
 * <UploadFileComponent
 *   onUpload={(files) => console.log('Archivos subidos:', files)}
 *   onError={(error) => console.error('Error:', error)}
 * />
 *
 * @example
 * // Tamaño micro - Ideal para avatares pequeños o iconos
 * <UploadFileComponent
 *   size="micro"
 *   acceptedFiles="image/*"
 *   maxFiles={1}
 *   text="Avatar"
 *   subText="64x64px"
 * />
 *
 * @example
 * // Tamaño small - Para miniaturas
 * <UploadFileComponent
 *   size="small"
 *   acceptedFiles="image/*"
 *   text="Miniatura"
 *   subText="100x100px"
 * />
 *
 * @example
 * // Tamaño medium (por defecto) - Para imágenes estándar
 * <UploadFileComponent
 *   size="medium"
 *   acceptedFiles="image/*"
 *   text="Imagen principal"
 *   subText="200x200px"
 * />
 *
 * @example
 * // Tamaño large - Ocupa todo el ancho disponible
 * <UploadFileComponent
 *   size="large"
 *   acceptedFiles="image/*"
 *   text="Banner o imagen grande"
 *   subText="Ancho completo"
 * />
 *
 * @example
 * // Configuración específica para imágenes con recorte
 * <UploadFileComponent
 *   size="medium"
 *   acceptedFiles={["image/png", "image/jpeg"]}
 *   cropConfig={{ targetWidth: 300, targetHeight: 300 }}
 *   maxFiles={1}
 *   translations={{
 *     uploadText: "Sube tu imagen de perfil",
 *     subText: "Tamaño recomendado 300×300px"
 *   }}
 * />
 *
 * @example
 * // Configuración para documentos PDF con props directas
 * <UploadFileComponent
 *   acceptedFiles="application/pdf,.doc,.docx"
 *   maxFiles={3}
 *   multiple={true}
 *   text="Arrastra tus documentos aquí"
 *   subText="Máximo 3 archivos PDF, DOC o DOCX"
 * />
 *
 * @example
 * // Manejo de estados de error y éxito
 * <UploadFileComponent
 *   acceptedFiles="image/*"
 *   error={hasError}
 *   success={uploadSuccess}
 *   errorText="Formato de archivo no válido"
 *   onError={(error) => setErrorMessage(error)}
 *   onUpload={(files) => handleUpload(files)}
 * />
 *
 * @example
 * // Uso con clases CSS personalizadas
 * <UploadFileComponent
 *   className="my-custom-upload-area"
 *   width={400}
 *   height={200}
 *   acceptedFiles="image/*,.pdf"
 * />
 *
 * @example
 * // Personalización visual con colores
 * <UploadFileComponent
 *   backgroundColor="#f8f9fa"
 *   borderColor="#6366f1"
 *   iconColor="#6366f1"
 *   textColor="#374151"
 *   text="Zona de carga personalizada"
 * />
 *
 * @example
 * // Con imagen preseleccionada y recorte personalizado
 * <UploadFileComponent
 *   image={preselectedFile}
 *   acceptedFiles="image/*"
 *   cropConfig={{
 *     targetWidth: 400,
 *     targetHeight: 400,
 *     textButton: "Aplicar recorte",
 *     colorButton: "#10b981"
 *   }}
 * />
 *
 * ## 💡 Notas Importantes
 *
 * ### Tipos de Archivo Aceptados
 * - Usa string pattern: `"image/*,.pdf,.doc"` (recomendado)
 * - O array de MIME types: `["image/png", "image/jpeg"]`
 *
 * ### Estados del Componente
 * - `error`: Muestra estado de error visual
 * - `success`: Muestra estado de éxito visual
 * - `disabled`: Deshabilita toda interacción
 *
 * ### Internacionalización
 * - Para casos simples: usa `text` y `subText`
 * - Para i18n completa: usa el objeto `translations`
 * - Las props directas siempre tienen prioridad
 *
 * ### Validación de Archivos
 * - La validación se maneja automáticamente según `acceptedFiles`
 * - Los errores se pueden capturar con `onError`
 * - Usa `maxFiles` para limitar cantidad
 * - Usa `multiple` para permitir selección múltiple
 * - `maxFileSize` define el límite de tamaño (si es soportado)
 *
 * ### Personalización Visual
 * - `backgroundColor`: Color de fondo del área de carga
 * - `borderColor`: Color del borde del componente
 * - `iconColor`: Color del icono principal
 * - `textColor`: Color del texto principal
 * - `className`: Para estilos CSS adicionales
 *
 * ### Archivo Preseleccionado
 * - `image`: Permite mostrar una imagen ya seleccionada
 * - Útil para formularios de edición o vista previa
 *
 * ### Configuración de Recorte Avanzada
 * - `cropConfig.textButton`: Personalizar texto del botón de recorte
 * - `cropConfig.colorButton`: Personalizar color del botón de recorte
 */
export const UploadFileComponent = ({
	acceptedFiles = "*/*", // Por defecto acepta todos los tipos
	cropConfig,
	size = "medium", // Por defecto tamaño medium
	maxFiles = 5, // Por defecto máximo 5 archivos
	width = "100%",
	height = "auto",
	icon = "solar:cloud-upload-bold",
	translations = {},
	onError = (error: string) => console.log(error),
	onUpload = (files: File[]) => console.log(files),
	disabled = false,
	maxFileSize = 10 * 1024 * 1024, // 10MB por defecto
	text,
	textColor,
	subText,
	multiple = false,
	error = false,
	success = false,
	errorText,
	borderColor,
	iconColor,
	backgroundColor,
	image,
	className,
}: UploadFileComponentProps) => {
	const { t } = useTranslate();

	// Crear traducciones por defecto usando el sistema de i18n
	// Solo para las traducciones que NO requieren parámetros dinámicos
	const defaultTranslations: Required<UploadTranslations> = {
		uploadText: t(
			defaultTranslationKeys.uploadText,
			fallbackTranslations.uploadText
		),
		subText: t(defaultTranslationKeys.subText, fallbackTranslations.subText),
		dragText: t(defaultTranslationKeys.dragText, fallbackTranslations.dragText),
		multipleFilesError: t(
			defaultTranslationKeys.multipleFilesError,
			fallbackTranslations.multipleFilesError
		),
		// Para estas con parámetros, usar solo fallback - se formatearán dinámicamente cuando se usen
		maxFilesError: fallbackTranslations.maxFilesError,
		invalidFileTypeError: fallbackTranslations.invalidFileTypeError,
		maxFileSizeError: fallbackTranslations.maxFileSizeError,
		removeFileAriaLabel: t(
			defaultTranslationKeys.removeFileAriaLabel,
			fallbackTranslations.removeFileAriaLabel
		),
		uploadAreaAriaLabel: t(
			defaultTranslationKeys.uploadAreaAriaLabel,
			fallbackTranslations.uploadAreaAriaLabel
		),
		cropModalTitle: t(
			defaultTranslationKeys.cropModalTitle,
			fallbackTranslations.cropModalTitle
		),
		cropSaveButton: t(
			defaultTranslationKeys.cropSaveButton,
			fallbackTranslations.cropSaveButton
		),
		cropCancelButton: t(
			defaultTranslationKeys.cropCancelButton,
			fallbackTranslations.cropCancelButton
		),
		cropZoomLabel: t(
			defaultTranslationKeys.cropZoomLabel,
			fallbackTranslations.cropZoomLabel
		),
		cropInstructions: t(
			defaultTranslationKeys.cropInstructions,
			fallbackTranslations.cropInstructions
		),
		cropBackgroundLabel: t(
			defaultTranslationKeys.cropBackgroundLabel,
			fallbackTranslations.cropBackgroundLabel
		),
		cropBackgroundWhite: t(
			defaultTranslationKeys.cropBackgroundWhite,
			fallbackTranslations.cropBackgroundWhite
		),
		cropBackgroundBlack: t(
			defaultTranslationKeys.cropBackgroundBlack,
			fallbackTranslations.cropBackgroundBlack
		),
		cropBackgroundTransparent: t(
			defaultTranslationKeys.cropBackgroundTransparent,
			fallbackTranslations.cropBackgroundTransparent
		),
	};

	// Combinar traducciones por defecto (del sistema i18n) con las personalizadas
	const finalTranslations = { ...defaultTranslations, ...translations };

	return (
		<UploadFile
			{...(size === "medium" || size === "large"
				? { translations: finalTranslations }
				: {})}
			size={size}
			acceptedFiles={acceptedFiles}
			cropConfig={cropConfig}
			maxFiles={maxFiles}
			onError={onError}
			onUpload={onUpload}
			width={typeof width === "number" ? `${width}px` : width}
			height={typeof height === "number" ? `${height}px` : height}
			icon={icon}
			disabled={disabled}
			text={text}
			textColor={textColor}
			subText={subText}
			multiple={multiple}
			error={error}
			success={success}
			errorText={errorText}
			borderColor={borderColor}
			iconColor={iconColor}
			maxFileSize={maxFileSize}
			backgroundColor={backgroundColor}
			image={image}
			className={className}
		/>
	);
};
