import { Switch } from "@beweco/aurora-ui";
import type { FC } from "react";
import type { ToggleableCardProps } from "../integration-status-card.types";
import BaseIntegrationCard from "./base-integration-card.component";

/**
 * Card para el estado ENABLED
 * Muestra switch activo, número de teléfono y estadísticas
 */
const EnabledCard: FC<ToggleableCardProps> = ({
	integration,
	statusConfig,
	platformIcon,
	onToggle,
}) => {
	// Construir la descripción con estadísticas
	const description = (
		<>
			{statusConfig.description}
			{integration.metadata?.messages24h !== undefined && (
				<span className="ml-1">
					{integration.metadata.messages24h} mensajes en 24h.
				</span>
			)}
		</>
	);

	// Número de teléfono como extra en el header
	const headerExtra = integration.config?.phoneNumber ? (
		<span className="text-sm text-green-600 font-medium">
			{integration.config.phoneNumber}
		</span>
	) : null;

	return (
		<BaseIntegrationCard
			platformIcon={platformIcon}
			name={integration.name}
			description={description}
			statusConfig={statusConfig}
			showStatusChip={true}
			headerExtra={headerExtra}
			action={
				<Switch
					isSelected={true}
					color="success"
					size="md"
					onValueChange={(checked) => onToggle?.(integration.id, checked)}
				/>
			}
		/>
	);
};

export default EnabledCard;
