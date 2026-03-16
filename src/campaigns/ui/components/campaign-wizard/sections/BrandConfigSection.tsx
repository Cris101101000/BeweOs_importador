/**
 * Brand Config Section for Campaign Wizard
 * Uses shared CollapsibleConfigSection and BrandConfigForm components
 */

import { 
  CollapsibleConfigSection, 
  BrandConfigForm,
  type BrandConfig 
} from '@shared/ui/components';

interface BrandConfigSectionProps {
  brandConfig: BrandConfig;
  onChange: (config: Partial<BrandConfig>) => void;
  isOpen: boolean;
  onToggle: () => void;
  /** Callback when logo files are uploaded */
  onLogoUpload?: (files: File[]) => void;
  /** Callback when logo is removed */
  onLogoRemove?: () => void;
  /** Whether logo is currently being uploaded */
  isUploadingLogo?: boolean;
  /** Error callback for logo upload errors */
  onLogoError?: (error: string) => void;
  /** Whether the form is in read-only mode (all inputs disabled) */
  isReadOnly?: boolean;
}

// Default translations for campaign context
const defaultTranslations = {
  section: {
    title: "Tono y estilo",
    description: "Añade logo, colores y guías de comunicación",
    badge: "Opcional",
    tipMessage: "Una configuración completa ayudará a la IA a crear contenido más alineado con tu identidad de marca",
    tipPrefix: "Tip:",
    configuredLabel: "Configurado",
  },
  form: {
    colorsLabel: "Colores de Marca",
    primaryColorLabel: "Principal",
    secondaryColorLabel: "Secundario",
    communicationGuideLabel: "Guía de Comunicación",
    communicationGuidePlaceholder: "Ej: Tono cercano y juvenil, enfocado en innovación...",
    useLogoLabel: "Utilizar logo",
    logoLabel: "Logo de Marca",
    logoRecommendedSize: "Tamaño recomendado: 300x300px, hasta 1MB",
    logoUploadingText: "Subiendo logo...",
    uploaderClickOrDragText: "Haz clic o arrastra para subir",
    uploaderDropText: "Suelta el archivo aquí",
    uploaderMultipleFilesError: "Solo se permite un archivo",
    uploaderMaxFilesError: "Máximo 1 archivo permitido",
    uploaderInvalidFileTypeError: "Tipo de archivo no válido",
    uploaderRemoveFileAriaLabel: "Eliminar archivo",
    uploaderUploadAreaAriaLabel: "Área de carga de archivos",
    uploaderCropModalTitle: "Recortar imagen",
    uploaderCropSaveButton: "Guardar",
    uploaderCropCancelButton: "Cancelar",
    uploaderCropZoomLabel: "Zoom",
    uploaderCropInstructions: "Arrastra para ajustar la posición",
    uploaderCropBackgroundLabel: "Color de fondo",
    uploaderCropBackgroundWhite: "Blanco",
    uploaderCropBackgroundBlack: "Negro",
    uploaderCropBackgroundTransparent: "Transparente",
  },
};

export function BrandConfigSection({
  brandConfig,
  onChange,
  isOpen,
  onToggle,
  onLogoUpload,
  onLogoRemove,
  isUploadingLogo = false,
  onLogoError,
  isReadOnly = false,
}: BrandConfigSectionProps) {
  const hasConfig = brandConfig.useLogo || brandConfig.generalPrompt.trim().length > 0;

  return (
    <CollapsibleConfigSection
      isOpen={isOpen}
      onToggle={onToggle}
      hasConfig={hasConfig}
      icon="solar:palette-bold"
      colorScheme="primary"
      badgeVariant="flat"
      badgeColor="primary"
      showTip={!isReadOnly}
      translations={defaultTranslations.section}
    >
      <BrandConfigForm
        value={brandConfig}
        onChange={onChange}
        translations={defaultTranslations.form}
        onLogoUpload={onLogoUpload}
        onLogoRemove={onLogoRemove}
        isUploadingLogo={isUploadingLogo}
        onLogoError={onLogoError}
        isReadOnly={isReadOnly}
      />
    </CollapsibleConfigSection>
  );
}
