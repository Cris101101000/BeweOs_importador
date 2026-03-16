/**
 * BrandConfigForm Component
 * A reusable form for brand configuration (colors, communication guide, logo)
 * 
 * @example
 * // Basic usage with all fields
 * <BrandConfigForm
 *   value={brandConfig}
 *   onChange={(changes) => setBrandConfig({ ...brandConfig, ...changes })}
 * />
 * 
 * @example
 * // Only colors
 * <BrandConfigForm
 *   value={brandConfig}
 *   onChange={handleChange}
 *   showCommunicationGuide={false}
 *   showUseLogo={false}
 * />
 * 
 * @example
 * // With logo upload functionality
 * <BrandConfigForm
 *   value={brandConfig}
 *   onChange={handleChange}
 *   onLogoUpload={handleLogoUpload}
 *   onLogoRemove={handleLogoRemove}
 *   isUploadingLogo={isUploading}
 * />
 * 
 * @example
 * // With custom translations
 * <BrandConfigForm
 *   value={brandConfig}
 *   onChange={handleChange}
 *   translations={{
 *     colorsLabel: t('brand_colors_label'),
 *     primaryColorLabel: t('primary_color'),
 *     secondaryColorLabel: t('secondary_color'),
 *   }}
 * />
 */

import { Switch, IconComponent, Spinner, P } from "@beweco/aurora-ui";
import type { BrandConfigFormProps, BrandConfigFormTranslations } from './BrandConfigForm.types';
import { ImagePreviewComponent } from "@shared/ui/components/ImagePreview";
import { UploadFileComponent } from "@shared/ui/components/UploadFile/UploadFile";
import { ColorPickerComponent } from "@shared/ui/components/ColorPicker";

const defaultTranslations: Required<BrandConfigFormTranslations> = {
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
};

export function BrandConfigForm({
  value,
  onChange,
  translations: customTranslations = {},
  showColors = true,
  showCommunicationGuide = true,
  showUseLogo = true,
  className = '',
  onLogoUpload,
  onLogoRemove,
  isUploadingLogo = false,
  onLogoError,
  isReadOnly = false,
}: BrandConfigFormProps) {
  const t = { ...defaultTranslations, ...customTranslations };

  return (
    <div className={`flex flex-col gap-5 ${className}`}>
       {/* Use Logo Toggle */}
       {showUseLogo && (
        <div className="space-y-3">
          <div className="flex items-center justify-between pt-2 border-t border-default-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <IconComponent icon="solar:gallery-bold" className="text-primary-600" />
              <span className="text-sm font-medium text-default-700">{t.useLogoLabel}</span>
            </div>
            <Switch 
              isSelected={value.useLogo}
              onValueChange={(selected) => onChange({ useLogo: selected })}
              size="sm"
              color="primary"
              aria-label={t.useLogoLabel}
              isDisabled={isReadOnly}
            />
          </div>

          {/* Logo Upload/Preview Section - Only visible when useLogo is enabled */}
          {value.useLogo && (
            <div className="space-y-2 pl-6">
              {isUploadingLogo ? (
                <div className="flex items-center justify-center py-6">
                  <Spinner size="md" label={t.logoUploadingText} />
                </div>
              ) : value.logo ? (
                <div className="space-y-2">
                  <ImagePreviewComponent
                    images={value.logo}
                    size="small"
                    onRemove={onLogoRemove}
                  />
                  <P className="text-tiny text-default-500">
                    {t.logoRecommendedSize}
                  </P>
                </div>
              ) : onLogoUpload ? (
                <div className="space-y-2">
                  <UploadFileComponent
                    translations={{
                      uploadText: t.uploaderClickOrDragText,
                      dragText: t.uploaderDropText,
                      multipleFilesError: t.uploaderMultipleFilesError,
                      maxFilesError: t.uploaderMaxFilesError,
                      invalidFileTypeError: t.uploaderInvalidFileTypeError,
                      removeFileAriaLabel: t.uploaderRemoveFileAriaLabel,
                      uploadAreaAriaLabel: t.uploaderUploadAreaAriaLabel,
                      cropModalTitle: t.uploaderCropModalTitle,
                      cropSaveButton: t.uploaderCropSaveButton,
                      cropCancelButton: t.uploaderCropCancelButton,
                      cropZoomLabel: t.uploaderCropZoomLabel,
                      cropInstructions: t.uploaderCropInstructions,
                      cropBackgroundLabel: t.uploaderCropBackgroundLabel,
                      cropBackgroundWhite: t.uploaderCropBackgroundWhite,
                      cropBackgroundBlack: t.uploaderCropBackgroundBlack,
                      cropBackgroundTransparent: t.uploaderCropBackgroundTransparent,
                    }}
                    size="small"
                    acceptedFiles={["image/png", "image/jpeg"]}
                    cropConfig={{
                      targetWidth: 300,
                      targetHeight: 300,
                    }}
                    maxFiles={1}
                    multiple={false}
                    maxFileSize={1024 * 1024}
                    onError={(error: string) => {
                      console.error("Error uploading logo:", error);
                      onLogoError?.(error);
                    }}
                    onUpload={onLogoUpload}
                    width="100%"
                    height="auto"
                    icon="solar:cloud-upload-bold"
                  />
                  <P className="text-tiny text-default-500">
                    {t.logoRecommendedSize}
                  </P>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
      {/* Colors Section */}
      {showColors && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-default-700 flex items-center gap-2">
            <IconComponent icon="solar:palette-bold" className="text-primary-600" />
            {t.colorsLabel}
          </label>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Primary Color */}
            <ColorPickerComponent
              value={value.primaryColor}
              onChange={(color) => onChange({ primaryColor: color })}
              label={t.primaryColorLabel}
              disabled={isReadOnly}
            />

            {/* Secondary Color */}
            <ColorPickerComponent
              value={value.secondaryColor}
              onChange={(color) => onChange({ secondaryColor: color })}
              label={t.secondaryColorLabel}
              disabled={isReadOnly}
            />
          </div>
        </div>
      )}

      {/* Communication Guide Section */}
      {showCommunicationGuide && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-default-700 flex items-center gap-2">
            <IconComponent icon="solar:document-text-bold" className="text-primary-600" />
            {t.communicationGuideLabel}
          </label>
          <textarea
            value={value.generalPrompt}
            onChange={(e) => onChange({ generalPrompt: e.target.value })}
            placeholder={t.communicationGuidePlaceholder}
            className={`w-full h-20 px-3 py-2 border border-default-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white ${
              isReadOnly ? 'cursor-not-allowed opacity-60 bg-default-100' : ''
            }`}
            aria-label={t.communicationGuideLabel}
            disabled={isReadOnly}
          />
        </div>
      )}

     
    </div>
  );
}
