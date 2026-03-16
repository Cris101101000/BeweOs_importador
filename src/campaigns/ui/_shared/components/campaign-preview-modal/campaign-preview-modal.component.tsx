/**
 * Modal de preview para campañas (WhatsApp y Email)
 * Reescrito siguiendo cursor rules: Aurora UI components, IconComponent, y traducciones
 */

import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button,
  H3,
  P,
  Chip,
  IconComponent,
  Image
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { CampaignContent } from '../../types';

const getChannelInfo = (contentType: CampaignContent["contentType"]) => {
  switch (contentType) {
    case "whatsapp":
      return {
        labelKey: "campaigns_channel_whatsapp",
        color: "success" as const,
      };
    case "email":
      return {
        labelKey: "campaigns_channel_email",
        color: "primary" as const,
      };
    default:
      return {
        labelKey: "campaigns_channel_unknown",
        color: "default" as const,
      };
  }
};

interface CampaignPreviewModalProps {
	isOpen: boolean;
	onClose: () => void;
	content: CampaignContent | null;
	onApprove?: () => void;
	onDiscard?: () => void;
}

export function CampaignPreviewModal({
	isOpen,
	onClose,
	content,
	onApprove,
	onDiscard,
}: CampaignPreviewModalProps) {
  const { t } = useTranslate();
  
  if (!content) return null;

	const channelInfo = getChannelInfo(content.contentType);

  const getPreviewComponent = () => {
    switch (content.contentType) {
      case "whatsapp":
        return (
          <div className="flex justify-center">
            <div className="bg-success-500 p-4 rounded-lg max-w-sm w-full">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-default-300 rounded-full flex items-center justify-center">
                    <IconComponent 
                      icon="ri:whatsapp-fill" 
                      className="w-4 h-4 text-gray-600"
                    />
                  </div>
                  <div className="ml-2">
                    <P className="text-sm font-semibold">{t('label_your_business', 'Tu Negocio')}</P>
                    <P className="text-xs text-default-500">{t('message_online', 'en línea')}</P>
                  </div>
                </div>
                {content.imageUrl && (
                  <div className="mb-2">
                    <Image 
                      src={content.imageUrl} 
                      alt={t('campaigns_preview_image_alt', 'Vista previa de campaña')}
                      className="w-full rounded-lg"
                    />
                  </div>
                )}
                <P className="text-sm whitespace-pre-wrap">{content.text}</P>
                <P className="text-xs text-default-500 mt-2 text-right">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </P>
              </div>
              
              {/* Audience Info */}
              {content.targetAudienceCount && (
                <div className="mt-2 bg-white bg-opacity-20 rounded-lg p-2 text-white text-xs">
                  <P className="font-semibold">
                    📊 {t('campaigns_preview_reach', 'Alcance')}: {content.targetAudienceCount} {t('campaigns_preview_people', 'personas')}
                  </P>
                  {content.audienceReason && (
                    <P className="mt-1 opacity-90">{content.audienceReason}</P>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case "email":
        return (
          <div className="flex justify-center">
            <div className="bg-white dark:bg-gray-800 border border-default-200 rounded-lg shadow-sm max-w-md w-full">
              <div className="border-b border-default-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <P className="font-semibold text-sm">{t('label_your_business', 'Tu Negocio')}</P>
                    <P className="text-xs text-default-500">info@tunegocio.com</P>
                  </div>
                  <P className="text-xs text-default-500">
                    {new Date().toLocaleDateString()}
                  </P>
                </div>
              </div>
              {content.imageUrl && (
                <div className="p-4 border-b border-default-200">
                  <Image 
                    src={content.imageUrl} 
                    alt={t('campaigns_preview_image_alt', 'Vista previa de campaña')}
                    className="w-full rounded-lg"
                  />
                </div>
              )}
              <div className="p-4">
                <P className="text-sm whitespace-pre-wrap">{content.text}</P>
              </div>
              
              {/* Audience Info */}
              {content.targetAudienceCount && (
                <div className="mx-4 mb-4 bg-primary-50 border border-primary-200 rounded-lg p-3">
                  <P className="text-xs font-semibold text-primary-900">
                    📊 {t('campaigns_preview_audience_count', 'Destinatarios')}: {content.targetAudienceCount} {t('campaigns_preview_people', 'personas')}
                  </P>
                  {content.audienceReason && (
                    <P className="mt-1 text-xs text-primary-700">{content.audienceReason}</P>
                  )}
                  {content.requiredTags && content.requiredTags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {content.requiredTags.map((tag, index) => (
                        <Chip
                          key={index}
                          size="sm"
                          color="primary"
                          variant="flat"
                        >
                          {tag}
                        </Chip>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="flex justify-center">
            <div className="bg-default-100 p-8 rounded-lg">
              <P className="text-default-500">{t('campaigns_preview_no_preview', 'Vista previa no disponible para este tipo de contenido')}</P>
            </div>
          </div>
        );
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <H3>{t('campaigns_preview_title', 'Vista Previa de Campaña')}</H3>
        </ModalHeader>

        <ModalBody className="gap-4">
          {/* Channel Label */}
          <div className="flex justify-start">
            <Chip
              color={channelInfo.color}
              variant="flat"
              startContent={
                content.contentType === "whatsapp" ? (
                  <IconComponent icon="ri:whatsapp-fill" className="w-3.5 h-3.5" />
                ) : (
                  <IconComponent icon="solar:letter-bold" className="w-3.5 h-3.5" />
                )
              }
            >
              {t(channelInfo.labelKey, content.contentType)}
            </Chip>
          </div>

          {/* Preview */}
          {getPreviewComponent()}
        </ModalBody>

        {/* Actions */}
        {(onApprove || onDiscard) && (
          <ModalFooter>
            {onDiscard && (
              <Button
                variant="light"
                onPress={onDiscard}
              >
                {t('button_discard', 'Descartar')}
              </Button>
            )}
            {onApprove && (
              <Button
                color="primary"
                onPress={onApprove}
              >
                {t('button_approve', 'Aprobar')}
              </Button>
            )}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
