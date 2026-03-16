import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconComponent, Tooltip, Chip, useAuraToast, P } from "@beweco/aurora-ui";
import { SocialMediaCarouselComponent, ContentPreviewModal, AccordionListComponent } from '@shared/ui/components';
import type { SocialMediaCarouselItem } from '@shared/ui/components';
import { useProposedCampaigns } from '../hooks/useProposedCampaigns';
import type { ProposedCampaignAccordionItem } from '../types';
import { configureSuccessToast, configureErrorToastWithTranslation } from '@shared/utils/toast-config.utils';
import { EnumErrorType } from '@shared/domain/enums/enum-error-type.enum';
import { useTranslate } from '@tolgee/react';
import { mockCarouselCampaigns } from '../../../../infrastructure/mocks/carousel-campaigns.mock';

/**
 * Página de contenido propuesto por Linda para campañas
 * Muestra un carousel 3D con campañas generadas por IA
 */
type ChipColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default';

export function ProposedCampaignsTabPage() {
  const navigate = useNavigate();
  const { showToast } = useAuraToast();
  const { t } = useTranslate();
  
  // Hook para campañas propuestas
  const {
    campaigns,
    error,
    fetchProposedCampaigns,
    deleteProposedCampaign,
  } = useProposedCampaigns();
  
  // Preview modal state
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedItemForPreview, setSelectedItemForPreview] = useState<SocialMediaCarouselItem | null>(null);
  
  // State para items del accordion
  const [proposedCampaignItems, setProposedCampaignItems] = useState<ProposedCampaignAccordionItem[]>([]);
  
  // Carousel inspiration items - State for managing carousel items
  // Inicializado con mock data desde infrastructure layer
  const [carouselItems, setCarouselItems] = useState<SocialMediaCarouselItem[]>(mockCarouselCampaigns);

  const handleCarouselItemClick = (item: SocialMediaCarouselItem) => {
    // Navigate to create campaign wizard at final step (step 6 - Publicación) with item data for preview
    navigate('/campaigns/create-campaign', { 
      state: { 
        editMode: true,
        currentStep: 6,
        selectedContentType: item.type,
        generatedImage: item.imageUrl,
        generatedCaption: item.caption || '',
        itemId: item.id,
        targetAudienceCount: item.targetAudienceCount,
        audienceReason: item.audienceReason,
        requiredTags: item.requiredTags,
        isProposedCampaign: true // Flag to indicate this is a proposed campaign from Linda
      } 
    });
  };

  const handleDeleteCarouselItem = (item: SocialMediaCarouselItem) => {
    // Filter out the deleted item from carousel
    setCarouselItems(prevItems => prevItems.filter(carouselItem => carouselItem.id !== item.id));
  };

  const handleEditCarouselItem = (item: SocialMediaCarouselItem) => {
    // Navigate to create campaign wizard at final step (step 6 - Publicación) with item data for editing
    navigate('/campaigns/create-campaign', { 
      state: { 
        editMode: true,
        currentStep: 6,
        selectedContentType: item.type,
        generatedImage: item.imageUrl,
        generatedCaption: item.caption || '',
        itemId: item.id
      } 
    });
  };

  const handlePublishCarouselItem = (item: SocialMediaCarouselItem) => {
    // Navigate to create campaign wizard at final step (step 6 - Publicación) with item data ready to publish
    navigate('/campaigns/create-campaign', { 
      state: { 
        editMode: true,
        currentStep: 6,
        selectedContentType: item.type,
        generatedImage: item.imageUrl,
        generatedCaption: item.caption || '',
        itemId: item.id,
        targetAudienceCount: item.targetAudienceCount,
        readyToPublish: true // Flag to indicate this is ready to publish
      } 
    });
  };

  const handlePreviewCarouselItem = (item: SocialMediaCarouselItem) => {
    setSelectedItemForPreview(item);
    setIsPreviewModalOpen(true);
  };

  // Show error toast when hook detects an error
  useEffect(() => {
    if (error) {
      showToast(
        configureErrorToastWithTranslation(
          EnumErrorType.Network,
          t,
          'campaigns_error_loading',
          'campaigns_error_loading_description'
        )
      );
    }
  }, [error, showToast, t]);

  // Fetch proposed campaigns on mount
  useEffect(() => {
    const loadProposedCampaigns = async () => {
      try {
        await fetchProposedCampaigns(20, 0);
      } catch (err) {
        console.error('Error loading proposed campaigns:', err);
      }
    };

    loadProposedCampaigns();
  }, [fetchProposedCampaigns]);

  // Update proposed campaign items when campaigns change
  useEffect(() => {
    if (campaigns && campaigns.length > 0) {
      const items: ProposedCampaignAccordionItem[] = campaigns.map(campaign => ({
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        suggestedText: campaign.suggestedText,
        contentType: campaign.contentType,
        targetAudienceCount: campaign.targetAudienceCount,
        audienceReason: campaign.audienceReason,
        requiredTags: campaign.requiredTags,
        score: campaign.evaluationScore,
        scoringBreakdown: campaign.scoringBreakdown,
        priority: campaign.priority,
        suggestedDate: campaign.suggestedDate,
      }));
      setProposedCampaignItems(items);
    } else {
      setProposedCampaignItems([]);
    }
  }, [campaigns]);

  // Handle delete proposed campaign
  const handleDeleteProposedCampaign = async (item: ProposedCampaignAccordionItem) => {
    try {
      await deleteProposedCampaign(item.id);
      showToast(
        configureSuccessToast(
          'Campaña eliminada',
          'La campaña propuesta se eliminó correctamente'
        )
      );
    } catch (error) {
      console.error('Error deleting proposed campaign:', error);
      showToast(
        configureErrorToastWithTranslation(
          EnumErrorType.Critical,
          t,
          'campaigns_error_deleting',
          'campaigns_error_deleting_description'
        )
      );
    }
  };

  return (
    <div className="relative">
      {/* Linda Info Banner - Positioned absolutely to not take vertical space */}
      {carouselItems.length > 0 && (
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center pointer-events-none">
          <Tooltip 
            content="Por ahora solo en WhatsApp"
            placement="bottom"
            showArrow
          >
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-violet-50 text-violet-600 pointer-events-auto shadow-sm cursor-help dark:bg-violet-950 dark:text-violet-300">
              <IconComponent
                icon="solar:star-fall-minimalistic-2-bold"
                className="w-3.5 h-3.5"
              />
              <P className="text-xs font-medium">Contenido propuesto por Linda en WhatsApp</P>
            </div>
          </Tooltip>
        </div>
      )}
      
      <SocialMediaCarouselComponent 
        items={carouselItems}
        onItemClick={handleCarouselItemClick}
        onEdit={handleEditCarouselItem}
        onDelete={handleDeleteCarouselItem}
        onPublish={handlePublishCarouselItem}
        onPreview={handlePreviewCarouselItem}
        className=""
        emptyStateRedirectPath="/campaigns/create-campaign"
      />

      {/* Preview Modal */}
      {selectedItemForPreview && (
        <ContentPreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => {
            setIsPreviewModalOpen(false);
            setSelectedItemForPreview(null);
          }}
          platform="instagram"
          imageUrl={selectedItemForPreview.imageUrl || ''}
          caption={selectedItemForPreview.caption || ''}
          title={selectedItemForPreview.title}
          variant="full"
        />
      )}

      {/* AccordionList para campañas propuestas del Banco de Ideas */}
      {proposedCampaignItems.length > 0 && (
        <div className="mt-6">
          <AccordionListComponent<ProposedCampaignAccordionItem>
            mode="accordion"
            items={proposedCampaignItems}
            sectionTitle="Campañas Propuestas - Banco de Ideas"
            sectionIcon="solar:lightbulb-bolt-bold-duotone"
            showCount
            accordionVariant="splitted"
            selectionMode="multiple"
            header={{
              getTitle: (item: ProposedCampaignAccordionItem) => item.title,
              getSubtitle: (item: ProposedCampaignAccordionItem) => item.description,
              getMetadata: (item: ProposedCampaignAccordionItem) => {
                const metadata = [];
                
                // Chip de tipo de contenido
                if (item.contentType) {
                  const typeLabel = item.contentType.toUpperCase();
                  metadata.push({
                    key: 'type',
                    label: typeLabel,
                    color: 'primary' as ChipColor,
                    variant: 'flat' as const,
                  });
                }
                
                // Chip de audiencia objetivo
                metadata.push({
                  key: 'audience',
                  label: `${item.targetAudienceCount} destinatarios`,
                  color: 'secondary' as ChipColor,
                  variant: 'flat' as const,
                });
                
                return metadata;
              },
            }}
            content={{
              render: (item: ProposedCampaignAccordionItem) => (
                <div className="space-y-4">
                  {/* Texto sugerido */}
                  <div>
                    <P className="text-sm font-medium mb-2 text-foreground">Texto sugerido:</P>
                    <div className="bg-default-100 dark:bg-default-50 p-3 rounded-lg">
                      <P className="text-sm whitespace-pre-wrap text-foreground">{item.suggestedText}</P>
                    </div>
                  </div>
                  
                  {/* Razón de audiencia */}
                  <div>
                    <P className="">Por qué esta audiencia:</P>
                    <P className="text-sm text-default-600">{item.audienceReason}</P>
                  </div>
                  
                  {/* Tags requeridos */}
                  {item.requiredTags.length > 0 && (
                    <div>
                      <P className="text-sm font-medium mb-2 text-foreground">Tags requeridos:</P>
                      <div className="flex flex-wrap gap-2">
                        {item.requiredTags.map((tag) => (
                          <Chip key={tag} size="sm" variant="flat" color="default">
                            {tag}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Score de evaluación */}
                  <div>
                    <P className="text-sm font-medium mb-2 text-foreground">Score de evaluación:</P>
                    <div className="flex items-center gap-2">
                      <Chip size="sm" variant="flat" color="success">
                        {item.score}% de relevancia
                      </Chip>
                    </div>
                  </div>
                </div>
              )
            }}
            actions={[
              {
                key: 'delete',
                icon: 'solar:trash-bin-minimalistic-outline',
                tooltip: 'Eliminar',
                color: 'danger',
                onPress: handleDeleteProposedCampaign
              }
            ]}
            emptyState={{
              icon: 'solar:inbox-line-bold-duotone',
              title: 'No hay campañas propuestas',
              description: 'Linda generará nuevas ideas pronto'
            }}
          />
        </div>
      )}
    </div>
  );
}
