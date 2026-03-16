import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '@tolgee/react';
import { Button, IconComponent, Tabs, Tab } from "@beweco/aurora-ui";
import { PageHeader } from "@shared/ui/components/page-header";
import { BasicConfigSection } from '../_shared';
import { ProposedContentTabPage } from '../proposed-content';
import { HistoryTabPage } from '../content-history';

export function SocialNetworksPage() {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const [selectedTab, setSelectedTab] = useState<string>("crear");
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const handleCreateContent = () => {
    navigate('/social-networks/create-content');
  };

  return (
    <div className="w-full flex flex-col gap-1">
      {/* Page Header */}
      <PageHeader
        title={t("social_networks_page_title", "Redes Sociales")}
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
              onPress={() => setIsConfigModalOpen(true)}
              startContent={<IconComponent icon="solar:palette-bold" className="w-4 h-4" />}
              className="w-auto"
            >
              {t("social_networks_page_tone_style", "Tono y estilo")}
            </Button>
            <Button
              variant="solid"
              size="sm"
              onPress={handleCreateContent}
              endContent={<IconComponent icon="solar:add-circle-bold" className="w-4 h-4" />}
              className="w-auto"
            >
              {t("social_networks_page_create_content", "Crear Contenido")}
            </Button>
          </>
        }
      />

      {/* Tabs Section */}
      <Tabs 
        selectedKey={selectedTab} 
        onSelectionChange={(key) => setSelectedTab(key as string)}
        aria-label={t("social_networks_page_aria_tabs", "Opciones de redes sociales")}
        classNames={{
          panel: "p-0"
        }}
      >
        <Tab
          key="crear"
          title={t("social_networks_page_tab_create", "Crear Contenido")}
        >
          <ProposedContentTabPage />
        </Tab>

        <Tab
          key="historial"
          title={t("social_networks_page_tab_history", "Historial")}
        >
          <HistoryTabPage />
        </Tab>
      </Tabs>

      {/* Config Modal */}
      <BasicConfigSection
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />
    </div>
  );
}

