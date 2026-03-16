import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, IconComponent, Tabs, Tab } from "@beweco/aurora-ui";
import { PageHeader } from "@shared/ui/components/page-header";
import { ProposedCampaignsTabPage } from '../features/proposed-campaigns/screens/proposed-campaigns-tab.page';
import { TemplatesTabPage } from '../features/templates/screens/templates-tab.page';
import { CampaignHistoryTabPage } from '../features/campaign-management/screens/campaign-history-tab.page';
import { BasicConfigSection } from '@social-networks/ui/_shared';

/**
 * Página principal de Campañas
 * Orquesta los tres slices principales: Crear Contenido, Plantillas e Historial
 */
export function CampanasPage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<string>("crear");
  const [isBrandConfigOpen, setIsBrandConfigOpen] = useState(false);

  const handleCreateContent = () => {
    navigate('/campaigns/create-campaign');
  };

  return (
    <div className="w-full flex flex-col gap-1">
      {/* Page Header */}
      <PageHeader
        title="Campañas New"
        metadata={[
          {
            key: "ai",
            label: "AI",
            color: "primary",
            variant: "flat",
          },
        ]}
        actions={
          <>
            <Button
              variant="flat"
              size="sm"
              onPress={() => setIsBrandConfigOpen(true)}
              startContent={<IconComponent icon="solar:palette-bold" className="w-4 h-4" />}
              className="w-auto"
            >
              Tono y estilo
            </Button>
            <Button
              variant="solid"
              size="sm"
              onPress={handleCreateContent}
              endContent={<IconComponent icon="solar:rocket-outline" className="w-4 h-4" />}
              className="w-auto"
            >
              Crear Campaña
            </Button>
          </>
        }
      />

      {/* Brand Config Modal */}
      <BasicConfigSection 
        isOpen={isBrandConfigOpen} 
        onClose={() => setIsBrandConfigOpen(false)} 
      />

      {/* Tabs Section */}
      <Tabs 
        selectedKey={selectedTab} 
        onSelectionChange={(key) => setSelectedTab(key as string)}
        aria-label="Opciones de campañas"
        classNames={{
          panel: "p-0"
        }}
      >
        <Tab
          key="crear"
          title="Crear Contenido"
        >
          <ProposedCampaignsTabPage />
        </Tab>

        <Tab
          key="plantillas"
          title="Plantillas"
        >
          <TemplatesTabPage />
        </Tab>

        <Tab
          key="historial"
          title="Historial"
        >
          <CampaignHistoryTabPage />
        </Tab>
      </Tabs>
    </div>
  );
}
