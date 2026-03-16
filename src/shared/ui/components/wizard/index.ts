/**
 * Wizard Component - Barrel Export
 *
 * Exporta el componente Wizard y todos sus tipos.
 * Este archivo facilita las importaciones limpias desde otros módulos.
 *
 * @example
 * ```tsx
 * import { Wizard, type WizardStep } from "@/shared/ui/components/wizard";
 * ```
 *
 * @todo Este componente será migrado a @beweco/aurora-ui en el futuro
 */

export {
	Wizard,
	type WizardProps,
	type WizardStep,
	type WizardStepValidation,
	type WizardNavigationConfig,
	type WizardStepChangeEvent,
	type WizardTranslations,
} from "./Wizard";
