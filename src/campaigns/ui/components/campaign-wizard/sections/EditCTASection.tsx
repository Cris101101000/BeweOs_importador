/**
 * Edit CTA Section
 * Collapsible section for adding Call-To-Action buttons
 */

import { H4, P, Card, IconComponent, Select, SelectItem, Input } from "@beweco/aurora-ui";
import type { CTAConfig } from '../types';

interface WhatsAppCtaType {
  key: string;
  label: string;
  requiresPhone: boolean;
}

interface EditCTASectionProps {
  isOpen: boolean;
  onToggle: () => void;
  ctaConfig: CTAConfig;
  onCTAChange: (config: Partial<CTAConfig>) => void;
  whatsappCtaTypes: WhatsAppCtaType[];
}

export function EditCTASection({
  isOpen,
  onToggle,
  ctaConfig,
  onCTAChange,
  whatsappCtaTypes,
}: EditCTASectionProps) {
  const selectedCtaType = whatsappCtaTypes.find(c => c.key === ctaConfig.type);

  return (
    <Card className="shadow-sm">
      {/* Header clickeable */}
      <button
        onClick={onToggle}
        className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
        type="button"
      >
        <div className="flex items-center gap-2">
          <IconComponent icon="solar:link-circle-bold" className="text-lg text-primary-600" />
          <H4 className="text-sm">Añadir Acción</H4>
        </div>
        <IconComponent 
          icon="solar:alt-arrow-down-bold" 
          className={`text-lg text-gray-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Collapsible content */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-200 dark:border-gray-800 pt-3">
          <P className="text-sm text-gray-600 dark:text-gray-400">
            Añade un botón de acción para que los usuarios puedan interactuar directamente
          </P>

          {/* CTA Type Select */}
          <Select
            label="Tipo de acción"
            placeholder="Selecciona una acción"
            selectedKeys={ctaConfig.type ? [ctaConfig.type] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              onCTAChange({ type: selected || "", value: "" });
            }}
          >
            {whatsappCtaTypes.map((cta) => (
              <SelectItem key={cta.key}>
                {cta.label}
              </SelectItem>
            ))}
          </Select>

          {/* CTA Value Input */}
          {ctaConfig.type && (
            <>
              <Input
                label={
                  selectedCtaType?.requiresPhone
                    ? "Número de teléfono"
                    : "URL de destino"
                }
                placeholder={
                  selectedCtaType?.requiresPhone
                    ? "Ej: +57 300 123 4567"
                    : "Ej: https://tusitio.com/oferta"
                }
                value={ctaConfig.value}
                onValueChange={(value) => onCTAChange({ value })}
                startContent={
                  selectedCtaType?.requiresPhone ? (
                    <IconComponent icon="solar:phone-outline" className="text-default-400" />
                  ) : (
                    <IconComponent icon="solar:link-outline" className="text-default-400" />
                  )
                }
              />
              {ctaConfig.value && (
                <P className="text-xs text-success-600 dark:text-success-400 mt-2">
                  ✓ El botón CTA se mostrará en la preview de WhatsApp
                </P>
              )}
            </>
          )}
        </div>
      )}
    </Card>
  );
}
