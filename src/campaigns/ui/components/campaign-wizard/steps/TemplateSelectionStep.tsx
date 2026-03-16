/**
 * Template Selection Step (Step 2)
 * User selects a campaign template or starts from scratch
 */

import {
  H3,
  H4,
  P,
  Button,
  Card,
  CardBody,
  IconComponent,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Image,
  Chip,
} from "@beweco/aurora-ui";
import type { ITemplate } from '@campaigns/domain';
import type { TEditorConfiguration } from '@shared/ui/components';

interface TemplateSelectionStepProps {
  selectedTemplate: ITemplate | null;
  onSelectTemplate: (template: ITemplate | null) => void;
  savedEmailTemplate: TEditorConfiguration | null;
  onOpenTemplateBuilder: () => void;
  onDeleteEmailTemplate: () => void;
  templates: ITemplate[];
  isLoading: boolean;
  selectedContentType: string;
  onBack: () => void;
  onNext: () => void;
}

export function TemplateSelectionStep({
  selectedTemplate,
  onSelectTemplate,
  savedEmailTemplate,
  onOpenTemplateBuilder,
  onDeleteEmailTemplate,
  templates,
  isLoading,
  selectedContentType,
  onBack,
  onNext,
}: TemplateSelectionStepProps) {
  const isEmailChannel = selectedContentType === "email";
  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full">
      <div className="text-center mb-8">
        <H3>Selecciona una plantilla para tu campaña</H3>
        <P className="text-center mt-2 text-gray-600">
          Usa una plantilla existente o empieza desde cero
        </P>
      </div>

      {/* Dropdown Selector */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar plantilla
        </label>
        <Dropdown
          classNames={{
            content: "min-w-[500px]"
          }}
        >
          <DropdownTrigger>
            <Button 
              variant="bordered" 
              size="lg"
              className="w-full justify-between h-auto py-3"
              endContent={<IconComponent icon="solar:alt-arrow-down-outline" className="w-5 h-5 text-gray-400" />}
            >
              <div className="flex items-center gap-3 text-left flex-1">
                {selectedTemplate ? (
                  <>
                    <IconComponent 
                      icon="solar:document-text-bold" 
                      className="w-5 h-5 text-primary-600 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {selectedTemplate.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {selectedTemplate.description}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <IconComponent 
                      icon="solar:list-bold" 
                      className="w-5 h-5 text-gray-400 flex-shrink-0"
                    />
                    <span className="text-gray-500">Selecciona una plantilla de la lista o empieza sin plantilla</span>
                  </>
                )}
              </div>
            </Button>
          </DropdownTrigger>
          <DropdownMenu 
            aria-label="Plantillas disponibles"
            onAction={(key) => {
              if (key === "no-template") {
                onSelectTemplate(null);
              } else {
                const template = templates.find(t => t.id === key);
                if (template) onSelectTemplate(template);
              }
            }}
            selectedKeys={selectedTemplate ? new Set([selectedTemplate.id]) : new Set(["no-template"])}
            selectionMode="single"
            classNames={{
              base: "max-h-[300px] overflow-y-auto",
              list: "max-h-[300px]"
            }}
            itemClasses={{
              base: "py-3 px-4 gap-3 data-[hover=true]:bg-primary-50 data-[selected=true]:bg-primary-100",
              title: "text-sm font-semibold text-gray-900",
              description: "text-xs text-gray-600 whitespace-normal"
            }}
          >
            <>
              <DropdownItem
                key="no-template"
                description="Crea tu campaña sin usar una plantilla predefinida"
                startContent={
                  <div className="w-10 h-10 rounded bg-default-100 flex items-center justify-center flex-shrink-0">
                    <IconComponent 
                      icon="solar:document-add-bold" 
                      className="w-5 h-5 text-default-600"
                    />
                  </div>
                }
                endContent={
                  !selectedTemplate ? (
                    <IconComponent 
                      icon="solar:check-circle-bold" 
                      className="w-5 h-5 text-primary-600"
                    />
                  ) : null
                }
              >
                Sin plantilla (Empezar desde cero)
              </DropdownItem>
              {templates.map((template) => (
                <DropdownItem 
                  key={template.id}
                  description={template.description}
                  startContent={
                    <div className="flex-shrink-0">
                      {template.thumbnailUrl ? (
                        <div className="w-10 h-10 rounded overflow-hidden bg-gray-100">
                          <Image
                            src={template.thumbnailUrl}
                            alt={template.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded bg-primary-100 flex items-center justify-center">
                          <IconComponent 
                            icon="solar:document-text-outline" 
                            className="w-5 h-5 text-primary-600"
                          />
                        </div>
                      )}
                    </div>
                  }
                  endContent={
                    selectedTemplate?.id === template.id ? (
                      <IconComponent 
                        icon="solar:check-circle-bold" 
                        className="w-5 h-5 text-primary-600"
                      />
                    ) : null
                  }
                >
                  {template.name}
                </DropdownItem>
              ))}
            </>
          </DropdownMenu>
        </Dropdown>

        {/* Start from Scratch OR Show Saved Template - Only for Email channel */}
        {!selectedTemplate && isEmailChannel && (
          <div className="mt-4">
            {!savedEmailTemplate ? (
              // Initial button: Start from scratch
              <Button
                variant="bordered"
                size="lg"
                className="w-full p-6 h-auto border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                onPress={onOpenTemplateBuilder}
              >
                <div className="flex flex-col items-center gap-3">
                  <IconComponent icon="solar:document-add-bold" className="w-12 h-12 text-blue-500" />
                  <div className="text-center">
                    <P className="text-blue-700 dark:text-blue-400 font-semibold mb-1">Empezar desde cero</P>
                    <P className="text-sm text-blue-600 dark:text-blue-500">Crea tu plantilla de email con el editor visual</P>
                  </div>
                </div>
              </Button>
            ) : (
              // Card when template is saved
              <Card className="border-2 border-success-300 bg-success-50/50 dark:bg-success-900/20">
                <CardBody className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Success icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-success-100 dark:bg-success-900/40 flex items-center justify-center">
                        <IconComponent 
                          icon="solar:check-circle-bold" 
                          className="w-7 h-7 text-success-600 dark:text-success-400" 
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <P className="font-semibold text-success-800 dark:text-success-300">
                          Plantilla de email creada
                        </P>
                        <Chip 
                          size="sm" 
                          variant="flat" 
                          className="bg-success-200 text-success-800 dark:bg-success-900/60 dark:text-success-300"
                          startContent={<IconComponent icon="solar:letter-bold" className="w-3 h-3" />}
                        >
                          Email
                        </Chip>
                      </div>
                      <P className="text-sm text-success-700 dark:text-success-400 mb-3">
                        Tu plantilla personalizada está lista. Puedes editarla o continuar con la campaña.
                      </P>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="flat"
                          className="bg-success-100 text-success-700 hover:bg-success-200 dark:bg-success-900/40 dark:text-success-300"
                          startContent={<IconComponent icon="solar:pen-bold" className="w-4 h-4" />}
                          onPress={onOpenTemplateBuilder}
                        >
                          Editar plantilla
                        </Button>
                        <Button
                          size="sm"
                          variant="light"
                          className="text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20"
                          startContent={<IconComponent icon="solar:trash-bin-minimalistic-outline" className="w-4 h-4" />}
                          onPress={onDeleteEmailTemplate}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button
          variant="light"
          size="md"
          onPress={onBack}
        >
          Atrás
        </Button>
        <Button
          color="primary"
          variant="solid"
          size="md"
          onPress={() => {
            // Si hay plantilla seleccionada → ir directo a Step 6 (Alcance)
            // Si NO hay plantilla → ir a Step 4 (Opciones de contenido)
            onNext();
          }}
          endContent={<IconComponent icon="solar:arrow-right-outline" />}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
