/**
 * Types for CollapsibleConfigSection Component
 * Generic collapsible section with customizable header.
 * All text content must be provided via translations from the parent component.
 */

import type { ReactNode } from 'react';

export interface CollapsibleConfigSectionTranslations {
  /** Title text displayed in the header */
  title: string;
  /** Description text displayed below the title */
  description: string;
  /** Optional badge/chip text (e.g., "Opcional", "Requerido") */
  badge?: string;
  /** Optional tip message shown at the top of content */
  tipMessage?: string;
  /** Prefix for the tip message (defaults to showing before tipMessage) */
  tipPrefix?: string;
  /** Aria label for the configured indicator chip */
  configuredLabel?: string;
}

export interface CollapsibleConfigSectionProps {
  /** Whether the section is currently open */
  isOpen: boolean;
  /** Callback when the section is toggled */
  onToggle: () => void;
  /** Whether the section has been configured (shows success indicator) */
  hasConfig?: boolean;
  /** Icon name from solar-icons (e.g., "solar:palette-bold") */
  icon?: string;
  /** Color scheme for the section */
  colorScheme?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  /** Badge variant */
  badgeVariant?: 'flat' | 'solid' | 'bordered' | 'light' | 'faded' | 'shadow';
  /** Badge color */
  badgeColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default';
  /** Show tip message box at the top of content */
  showTip?: boolean;
  /** Content to render inside the collapsible section */
  children: ReactNode;
  /** Translation strings */
  translations: CollapsibleConfigSectionTranslations;
  /** Additional className for the card */
  className?: string;
}
