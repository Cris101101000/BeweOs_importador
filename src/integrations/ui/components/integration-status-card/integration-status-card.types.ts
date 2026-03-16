import type { ReactNode } from "react";
import type { IIntegration, IntegrationStatusConfig } from "../../../domain";

/**
 * Props base para todas las cards de integración
 */
export interface BaseIntegrationCardProps {
	integration: IIntegration;
	statusConfig: IntegrationStatusConfig;
	platformIcon: ReactNode;
}

/**
 * Props para cards que tienen toggle (enabled/disabled)
 */
export interface ToggleableCardProps extends BaseIntegrationCardProps {
	onToggle?: (integrationId: string, isActive: boolean) => void;
}

/**
 * Props para cards que tienen acción de conectar
 */
export interface ConnectableCardProps extends BaseIntegrationCardProps {
	onConnect?: (integrationId: string) => void;
}

/**
 * Props para cards que tienen acción de reautorizar
 */
export interface ReauthorizableCardProps extends BaseIntegrationCardProps {
	onReauthorize?: (integrationId: string) => void;
}

/**
 * Props del componente principal IntegrationStatusCard
 */
export interface IntegrationStatusCardProps {
	integration: IIntegration;
	onToggle?: (integrationId: string, isActive: boolean) => void;
	onConnect?: (integrationId: string) => void;
	onReauthorize?: (integrationId: string) => void;
}

/**
 * Props unificadas que pueden recibir las cards del registry
 */
export interface UnifiedCardProps {
	integration: IIntegration;
	statusConfig: IntegrationStatusConfig;
	platformIcon: ReactNode;
	onToggle?: (integrationId: string, isActive: boolean) => void;
	onConnect?: (integrationId: string) => void;
	onReauthorize?: (integrationId: string) => void;
}
