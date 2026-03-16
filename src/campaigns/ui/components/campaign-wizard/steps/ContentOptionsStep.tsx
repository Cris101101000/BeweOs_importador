/**
 * Content Options Step (Step 3)
 * User chooses between AI generation or manual content
 */

import { H3, H4, P, Button, IconComponent } from "@beweco/aurora-ui";
import type { ITemplate } from '@campaigns/domain';

interface ContentOptionsStepProps {
  useAI: boolean | null;
  onSelectOption: (useAI: boolean) => void;
  selectedTemplate: ITemplate | null;
  selectedContentType: string;
  onBack: () => void;
  onNext: () => void;
}

export function ContentOptionsStep({
  useAI,
  onSelectOption,
  selectedTemplate,
  selectedContentType,
  onBack,
  onNext,
}: ContentOptionsStepProps) {
  // En WhatsApp, siempre mostrar ambas opciones (como en RRSS)
  // En Email, solo mostrar "Generar con IA" si hay plantilla
  const showAIOption = selectedTemplate || selectedContentType === 'whatsapp';
  const showBothOptions = showAIOption;
  
  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full">
      <div className="text-center mb-6">
        <H3>¿Cómo quieres crear tu contenido?</H3>
        <P className="text-center mt-2">
          {showBothOptions
            ? "Elige si quieres generar el contenido con IA o si ya tienes tu propio contenido"
            : "Sube tu propio contenido para crear tu campaña"
          }
        </P>
      </div>

      {/* AI Option Selection */}
      <div className={`grid gap-4 ${showBothOptions ? "grid-cols-2" : "grid-cols-1"}`}>
        {/* AI Generation Option - Visible si hay plantilla O si es WhatsApp */}
        {showAIOption && (
          <Button
            onPress={() => {
              onSelectOption(true);
              onNext(); // Auto-advance to next step
            }}
            variant="bordered"
            color="default"
            className="p-6 h-auto bg-white border border-gray-200 hover:border-primary-500 hover:bg-gray-50 transition-all"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-primary-600">
                <IconComponent icon="solar:magic-stick-bold" className="text-white text-[32px]" />
              </div>
              <div className="text-center">
                <H4 className="mb-1">Generar con IA</H4>
                <P className="text-xs text-gray-600">
                  La IA creará el contenido por ti
                </P>
              </div>
            </div>
          </Button>
        )}

        {/* Manual Creation Option */}
        <Button
          onPress={() => {
            onSelectOption(false);
            onNext(); // Auto-advance to next step
          }}
          variant="bordered"
          color="default"
          className="p-6 h-auto bg-white border border-gray-200 hover:border-primary-500 hover:bg-gray-50 transition-all"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-teal-500 to-emerald-600">
              <IconComponent icon="solar:document-bold" className="text-white text-[32px]" />
            </div>
            <div className="text-center">
              <H4 className="mb-1">Tengo mi contenido</H4>
              <P className="text-xs text-gray-600">
                Subiré mi propio contenido
              </P>
            </div>
          </div>
        </Button>
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
      </div>
    </div>
  );
}
