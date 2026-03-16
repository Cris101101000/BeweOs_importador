/**
 * CollapsibleConfigSection Component
 * A generic collapsible section with customizable header, icon, and content.
 * All text content must be provided via the translations prop from the parent component.
 * 
 * @example
 * // Basic usage with translations from parent
 * const { t } = useTranslate();
 * 
 * <CollapsibleConfigSection
 *   isOpen={isOpen}
 *   onToggle={() => setIsOpen(!isOpen)}
 *   hasConfig={hasConfiguration}
 *   icon="solar:palette-bold"
 *   translations={{
 *     title: t("campaigns_brand_config_title"),
 *     description: t("campaigns_brand_config_description"),
 *     badge: t("badge_optional"),
 *     tipMessage: t("campaigns_brand_config_tip"),
 *     tipPrefix: t("tip_prefix"),
 *     configuredLabel: t("status_configured"),
 *   }}
 * >
 *   <YourContentHere />
 * </CollapsibleConfigSection>
 */

import { useId } from "react";
import { Card, IconComponent, Chip, H4, P } from "@beweco/aurora-ui";
import type { CollapsibleConfigSectionProps } from './CollapsibleConfigSection.types';

const colorSchemeClasses = {
  primary: {
    card: 'border-primary-200 dark:border-primary-800 bg-gradient-to-br from-primary-50/50 to-secondary-50/50 dark:from-primary-950/20 dark:to-secondary-950/20',
    iconBg: 'bg-primary-100 dark:bg-primary-900/40',
    iconColor: 'text-primary-600 dark:text-primary-400',
    border: 'border-primary-200 dark:border-primary-800',
    tipBg: 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800',
  },
  secondary: {
    card: 'border-secondary-200 dark:border-secondary-800 bg-gradient-to-br from-secondary-50/50 to-gray-50/50 dark:from-secondary-950/20 dark:to-gray-950/20',
    iconBg: 'bg-secondary-100 dark:bg-secondary-900/40',
    iconColor: 'text-secondary-600 dark:text-secondary-400',
    border: 'border-secondary-200 dark:border-secondary-800',
    tipBg: 'bg-secondary-50 dark:bg-secondary-900/20 border-secondary-200 dark:border-secondary-800',
  },
  success: {
    card: 'border-success-200 dark:border-success-800 bg-gradient-to-br from-success-50/50 to-green-50/50 dark:from-success-950/20 dark:to-green-950/20',
    iconBg: 'bg-success-100 dark:bg-success-900/40',
    iconColor: 'text-success-600 dark:text-success-400',
    border: 'border-success-200 dark:border-success-800',
    tipBg: 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800',
  },
  warning: {
    card: 'border-warning-200 dark:border-warning-800 bg-gradient-to-br from-warning-50/50 to-orange-50/50 dark:from-warning-950/20 dark:to-orange-950/20',
    iconBg: 'bg-warning-100 dark:bg-warning-900/40',
    iconColor: 'text-warning-600 dark:text-warning-400',
    border: 'border-warning-200 dark:border-warning-800',
    tipBg: 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800',
  },
  danger: {
    card: 'border-danger-200 dark:border-danger-800 bg-gradient-to-br from-danger-50/50 to-red-50/50 dark:from-danger-950/20 dark:to-red-950/20',
    iconBg: 'bg-danger-100 dark:bg-danger-900/40',
    iconColor: 'text-danger-600 dark:text-danger-400',
    border: 'border-danger-200 dark:border-danger-800',
    tipBg: 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800',
  },
};

export function CollapsibleConfigSection({
  isOpen,
  onToggle,
  hasConfig = false,
  icon = "solar:settings-bold",
  colorScheme = 'primary',
  badgeVariant = 'flat',
  badgeColor = 'primary',
  showTip = true,
  children,
  translations,
  className = '',
}: CollapsibleConfigSectionProps) {
  const colors = colorSchemeClasses[colorScheme];
  const contentId = useId();
  const headerId = useId();

  return (
    <Card className={`shadow-md border-2 ${colors.card} ${className}`}>
      {/* Clickable Header */}
      <div
        id={headerId}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        className="w-full p-6 flex items-center justify-between hover:bg-white/50 dark:hover:bg-gray-900/30 transition-colors duration-200 rounded-t-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <div className="flex items-center gap-3">
          <div 
            className={`w-10 h-10 rounded-lg ${colors.iconBg} flex items-center justify-center`}
            aria-hidden="true"
          >
            <IconComponent icon={icon} className={`text-xl ${colors.iconColor}`} />
          </div>
          <div className="text-left">
            <H4 className="flex items-center gap-2">
              {translations.title}
              {translations.badge && (
                <Chip size="sm" color={badgeColor} variant={badgeVariant}>
                  {translations.badge}
                </Chip>
              )}
            </H4>
            <P className="text-xs text-default-500 dark:text-default-400 mt-0.5">
              {translations.description}
            </P>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasConfig && (
            <Chip 
              size="sm" 
              color="success" 
              variant="flat"
              aria-label={translations.configuredLabel}
            >
              <IconComponent icon="solar:check-circle-bold" className="text-xs" />
            </Chip>
          )}
          <IconComponent 
            icon="solar:alt-arrow-down-bold" 
            className={`text-lg text-gray-600 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Collapsible Content with Animation */}
      <div
        id={contentId}
        role="region"
        aria-labelledby={headerId}
        className={`
          grid transition-all duration-300 ease-in-out
          ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
        `}
      >
        <div className="overflow-hidden">
          <div className={`px-6 pb-6 space-y-6 border-t ${colors.border} pt-6 bg-white dark:bg-gray-950/50 rounded-b-lg`}>
            {showTip && translations.tipMessage && (
              <div 
                className={`flex items-start gap-2 ${colors.tipBg} border rounded-lg p-3`}
                role="note"
              >
                <IconComponent 
                  icon="solar:lightbulb-bold" 
                  className={`${colors.iconColor} text-lg flex-shrink-0 mt-0.5`}
                  aria-hidden="true"
                />
                <P className="text-xs text-default-700 dark:text-default-300">
                  {translations.tipPrefix && <strong>{translations.tipPrefix}</strong>} {translations.tipMessage}
                </P>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </Card>
  );
}
