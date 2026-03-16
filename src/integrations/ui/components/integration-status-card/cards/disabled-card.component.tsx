import { Switch } from "@beweco/aurora-ui";
import type { FC } from "react";
import type { ToggleableCardProps } from "../integration-status-card.types";
import BaseIntegrationCard from "./base-integration-card.component";

/**
 * Card para el estado DISABLED
 * Muestra switch inactivo y número de teléfono
 */
const DisabledCard: FC<ToggleableCardProps> = ({
	integration,
	statusConfig,
	platformIcon,
	onToggle,
}) => {
	// Número de teléfono como extra en el header (gris porque está desactivado)
	const headerExtra = integration.config?.phoneNumber ? (
		<span className="text-sm text-gray-500">
			{integration.config.phoneNumber}
		</span>
	) : null;

	return (
		<BaseIntegrationCard
			platformIcon={platformIcon}
			name={integration.name}
			description={statusConfig.description}
			statusConfig={statusConfig}
			showStatusChip={true}
			headerExtra={headerExtra}
			action={
				<Switch
					isSelected={false}
					color="success"
					size="md"
					onValueChange={(checked) => onToggle?.(integration.id, checked)}
				/>
			}
		/>
	);
};

export default DisabledCard;
