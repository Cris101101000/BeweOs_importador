/**
 * Edit Text Section
 * Collapsible section for editing campaign text/caption
 */

import { H4, Card, IconComponent, Textarea, Button, Tooltip } from "@beweco/aurora-ui";

interface EditTextSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  generatedCaption: string;
  onCaptionChange: (caption: string) => void;
  editCaptionPrompt: string;
  onEditCaptionPromptChange: (prompt: string) => void;
  onEditCaption: () => void;
  isGenerating: boolean;
  isStory: boolean;
}

export function EditTextSection({
  isOpen,
  onToggle,
  generatedCaption,
  onCaptionChange,
  editCaptionPrompt,
  onEditCaptionPromptChange,
  onEditCaption,
  isGenerating,
  isStory,
}: EditTextSectionProps) {
  return (
    <Card className="shadow-sm">
      {/* Header clickeable */}
      <button
        onClick={onToggle}
        className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
        type="button"
      >
        <div className="flex items-center gap-2">
          <IconComponent icon="solar:text-bold" className="text-lg text-primary-600" />
          <H4 className="text-sm">Editar Texto</H4>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500">
            {generatedCaption.length} caracteres
          </div>
          <IconComponent 
            icon="solar:alt-arrow-down-bold" 
            className={`text-lg text-gray-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Collapsible content */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-200 dark:border-gray-800 pt-3">
          {/* Editable textarea - REAL TIME */}
          <Textarea
            value={generatedCaption}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCaptionChange(e.target.value)}
            placeholder={isStory ? "Edita el texto de tu story..." : "Escribe el texto de tu publicación..."}
            minRows={6}
          />
          
          {/* Variables hint */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span>💡 Usa variables:</span>
            <Tooltip 
              content={
                <div className="px-1 py-2 max-w-xs">
                  <div className="text-tiny space-y-1">
                    <div><code className="bg-default-100 px-1 rounded">{"{{cliente}}"}</code> = Nombre completo</div>
                    <div><code className="bg-default-100 px-1 rounded">{"{{nombre}}"}</code> = Primer nombre</div>
                    <div><code className="bg-default-100 px-1 rounded">{"{{negocio}}"}</code> = Tu negocio</div>
                    <div><code className="bg-default-100 px-1 rounded">{"{{email}}"}</code> = Email cliente</div>
                    <div><code className="bg-default-100 px-1 rounded">{"{{telefono}}"}</code> = Teléfono</div>
                    <div><code className="bg-default-100 px-1 rounded">{"{{ciudad}}"}</code> = Ciudad</div>
                    <div><code className="bg-default-100 px-1 rounded">{"{{fecha}}"}</code> = Fecha actual</div>
                  </div>
                </div>
              }
              placement="bottom"
              showArrow
            >
              <code className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded cursor-help hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                {"{{cliente}}, {{negocio}}, {{fecha}}..."}
              </code>
            </Tooltip>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white dark:bg-gray-950 text-xs text-gray-500 uppercase tracking-wider">
                o mejora con IA
              </span>
            </div>
          </div>

          {/* AI improvement field */}
          <Textarea
            value={editCaptionPrompt}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEditCaptionPromptChange(e.target.value)}
            placeholder="Ej: Hazlo más corto, más profesional, añade emojis..."
            minRows={2}
            label="Prompt para la IA"
          />
          
          <Button
            onPress={onEditCaption}
            isDisabled={!editCaptionPrompt.trim() || isGenerating}
            color="primary"
            variant="solid"
            className="w-full"
            startContent={<IconComponent icon="solar:magic-stick-bold" className="text-base" />}
          >
            {isGenerating ? "Mejorando..." : "Mejorar con IA"}
          </Button>
        </div>
      )}
    </Card>
  );
}
