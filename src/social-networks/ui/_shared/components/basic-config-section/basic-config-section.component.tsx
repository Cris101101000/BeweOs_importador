import { useState, useEffect } from "react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, IconComponent, useAuraToast, Spinner, P } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import { useBrandGuide } from "../../hooks/use-brand-guide.hook";
import { configureSuccessToast, configureErrorToastWithTranslation } from "@shared/utils/toast-config.utils";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import { BrandConfigForm } from "@shared/ui/components/BrandConfigForm";
import type { BrandConfig } from "@shared/ui/components/BrandConfigForm";
import { filestackService } from "@shared/infrastructure/services/filestack.service";
import { useSession } from "@shared/ui/contexts/session-context/session-context";

interface BasicConfigSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BasicConfigSection({ isOpen, onClose }: BasicConfigSectionProps) {
  const { t } = useTranslate();
  const { showToast } = useAuraToast();
  const { agency } = useSession();
  const { brandGuide, loading, error, fetchBrandGuide, patchBrandGuide, generateBrandGuide } = useBrandGuide();

  // Estado unificado para la configuración de marca
  const [brandConfig, setBrandConfig] = useState<BrandConfig>({
    logo: "",
    useLogo: true,
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    generalPrompt: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Cargar datos al abrir el modal
  useEffect(() => {
    if (isOpen && !brandGuide) {
      fetchBrandGuide();
    }
  }, [isOpen, brandGuide, fetchBrandGuide]);

  // Actualizar estado cuando se carga la guía de marca
  useEffect(() => {
    if (brandGuide) {
      setBrandConfig({
        logo: brandGuide.logoUrl || "",
        useLogo: brandGuide.useLogo ?? true,
        primaryColor: brandGuide.primaryColor || "#3B82F6",
        secondaryColor: brandGuide.secondaryColor || "#10B981",
        generalPrompt: brandGuide.smbAddedDescription || "",
      });
    }
  }, [brandGuide]);

  const handleBrandConfigChange = (changes: Partial<BrandConfig>) => {
    setBrandConfig(prev => ({ ...prev, ...changes }));
  };

  const handleLogoUpload = async (files: File[]) => {
    if (files.length === 0 || !agency?.id) return;

    setIsUploadingLogo(true);
    try {
      const file = files[0];

      // Paso 1: Subir a Filestack
      console.log('🔄 Subiendo logo a Filestack...', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      const uploadedResults = await filestackService.uploadFilesWithMetadata(
        [file],
        {
          path: "brand-guide/logos/",
          agencyId: agency.id,
        }
      );

      if (!uploadedResults[0]?.url) {
        throw new Error('No se recibió URL de Filestack');
      }

      const logoUrl = uploadedResults[0].url;
      console.log('✅ Logo subido a Filestack:', logoUrl);

      // PATCH inmediato al backend solo con el logo
      console.log('🔄 Actualizando logo en backend...');
      await patchBrandGuide({
        logoUrl: logoUrl,
      });

      // Actualizar estado local
      setBrandConfig(prev => ({ ...prev, logo: logoUrl }));

      showToast(
        configureSuccessToast(
          t("social_networks_brand_guide_logo_upload_success", "Logo actualizado"),
          t("social_networks_brand_guide_logo_upload_success_description", "El logo se actualizó correctamente")
        )
      );
    } catch (err) {
      console.error('❌ Error subiendo logo:', err);
      showToast(
        configureErrorToastWithTranslation(
          EnumErrorType.Critical,
          t,
          "social_networks_brand_guide_logo_upload_error",
          err instanceof Error ? err.message : "social_networks_brand_guide_logo_upload_error_description"
        )
      );
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleLogoRemove = async () => {
    try {
      setIsUploadingLogo(true);

      // Actualizar estado local
      setBrandConfig(prev => ({ ...prev, logo: "" }));

      showToast(
        configureSuccessToast(
          t("social_networks_brand_guide_logo_remove_success", "Logo eliminado"),
          t("social_networks_brand_guide_logo_remove_success_description", "El logo se eliminó correctamente")
        )
      );
    } catch (err) {
      console.error('❌ Error eliminando logo:', err);
      showToast(
        configureErrorToastWithTranslation(
          EnumErrorType.Critical,
          t,
          "social_networks_brand_guide_logo_remove_error", 
          err instanceof Error ? err.message : "No se pudo eliminar el logo"
        )
      );
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleLogoError = (errorMessage: string) => {
    console.error("Error uploading logo:", errorMessage);
    showToast(
      configureErrorToastWithTranslation(
        EnumErrorType.Validation,
        t,
        "social_networks_brand_guide_logo_upload_error",
        errorMessage
      )
    );
  };

  const handleSave = async () => {
    // Validar formato de colores
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!hexColorRegex.test(brandConfig.primaryColor)) {
      showToast(
        configureErrorToastWithTranslation(
          EnumErrorType.Validation,
          t,
          "social_networks_brand_guide_invalid_color",
          "social_networks_brand_guide_invalid_color_description"
        )
      );
      return;
    }

    if (!hexColorRegex.test(brandConfig.secondaryColor)) {
      showToast(
        configureErrorToastWithTranslation(
          EnumErrorType.Validation,
          t,
          "social_networks_brand_guide_invalid_color",
          "social_networks_brand_guide_invalid_color_description"
        )
      );
      return;
    }

    setIsSaving(true);
    try {
      // POST /linda/brand-guide/generate con colores y descripción
      await generateBrandGuide({
        smbAddedDescription: brandConfig.generalPrompt,
        primaryColor: brandConfig.primaryColor.toUpperCase(),
        secondaryColor: brandConfig.secondaryColor.toUpperCase(),
        logoUrl: brandConfig.logo,
      });

      showToast(
        configureSuccessToast(
          t("social_networks_brand_guide_save_success"),
          t("social_networks_brand_guide_save_success_description")
        )
      );

      onClose();
    } catch (err) {
      showToast(
        configureErrorToastWithTranslation(
          EnumErrorType.Critical,
          t,
          "social_networks_brand_guide_save_error",
          "social_networks_brand_guide_save_error_description"
        )
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        size="2xl"
        placement="center"
        scrollBehavior="outside"
        hideCloseButton
      >
        <ModalContent>
          <ModalHeader className="flex flex-col p-0">
            {t("social_networks_brand_guide_title", "Tono y estilo")}
            <P className="text-small text-default-500 font-normal">
              {t("social_networks_brand_guide_subtitle", "Define cómo se verán y comunicarán tus publicaciones")}
            </P>
          </ModalHeader>
          
          <ModalBody className="p-0 mt-4 overflow-visible">
            {loading && !brandGuide ? (
              <div className="flex items-center justify-center py-8">
                <Spinner size="lg" label={t("social_networks_brand_guide_loading")} />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <IconComponent 
                  icon="solar:danger-triangle-bold" 
                  style={{ width: '48px', height: '48px' }} 
                  className="text-danger mb-2"
                />
                <P className="text-danger text-sm">{t("social_networks_brand_guide_error")}</P>
                <Button 
                  size="sm" 
                  variant="flat" 
                  color="danger"
                  onPress={fetchBrandGuide}
                  className="mt-2"
                >
                  {t("button_retry", "Reintentar")}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                 {/* Tip informativo */}
                <div className="flex items-start gap-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                  <IconComponent 
                    icon="solar:lightbulb-bolt-bold" 
                    className="text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" 
                    style={{ width: '18px', height: '18px' }}
                  />
                  <P className="text-sm text-primary-700 dark:text-primary-300">
                    {t("social_networks_brand_guide_tip", "Tip: Una configuración completa ayudará a la IA a crear contenido más alineado con tu identidad de marca")}
                  </P>
                </div>
                <BrandConfigForm
                  value={brandConfig}
                  onChange={handleBrandConfigChange}
                  onLogoUpload={handleLogoUpload}
                  onLogoRemove={handleLogoRemove}
                  isUploadingLogo={isUploadingLogo}
                  onLogoError={handleLogoError}
                  translations={{
                    colorsLabel: t("social_networks_brand_guide_colors_label", "Paleta de Colores"),
                    primaryColorLabel: t("field_primary_color", "Color Principal"),
                    secondaryColorLabel: t("field_secondary_color", "Color Secundario"),
                    communicationGuideLabel: t("social_networks_brand_guide_communication_label", "Guía de Comunicación"),
                    communicationGuidePlaceholder: brandGuide?.visualStyle || t("social_networks_brand_guide_communication_placeholder", "Ej: Somos una marca juvenil y moderna. Usamos un tono cercano y amigable..."),
                    useLogoLabel: t("social_networks_brand_guide_use_logo_label", "Utilizar logo"),
                    logoRecommendedSize: t("social_networks_brand_guide_logo_recommended_size", "Tamaño recomendado: 300x300px, hasta 1MB"),
                    logoUploadingText: t("social_networks_brand_guide_logo_uploading", "Subiendo logo..."),
                    uploaderClickOrDragText: t("uploader_click_or_drag_text"),
                    uploaderDropText: t("uploader_drop_text"),
                    uploaderMultipleFilesError: t("uploader_multiple_files_error"),
                    uploaderMaxFilesError: t("uploader_max_files_error", { maxFiles: 1 }),
                    uploaderInvalidFileTypeError: t("uploader_invalid_file_type_error"),
                    uploaderRemoveFileAriaLabel: t("uploader_remove_file_aria_label"),
                    uploaderUploadAreaAriaLabel: t("uploader_upload_area_aria_label"),
                    uploaderCropModalTitle: t("uploader_crop_modal_title"),
                    uploaderCropSaveButton: t("uploader_crop_save_button"),
                    uploaderCropCancelButton: t("uploader_crop_cancel_button"),
                    uploaderCropZoomLabel: t("uploader_crop_zoom_label"),
                    uploaderCropInstructions: t("uploader_crop_instructions"),
                    uploaderCropBackgroundLabel: t("uploader_crop_background_label"),
                    uploaderCropBackgroundWhite: t("uploader_crop_background_white"),
                    uploaderCropBackgroundBlack: t("uploader_crop_background_black"),
                    uploaderCropBackgroundTransparent: t("uploader_crop_background_transparent"),
                  }}
                />
              </div>
            )}
          </ModalBody>
          
          <ModalFooter className="flex p-0 mt-4">
            <Button
              color="default"
              variant="flat"
              onPress={onClose}
              className="flex-1"
              isDisabled={loading || isSaving}
            >
              {t("button_cancel")}
            </Button>
            <Button
              color="primary"
              onPress={handleSave}
              className="flex-1"
              isLoading={isSaving}
              isDisabled={loading || !brandGuide}
            >
              {t("button_save")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
