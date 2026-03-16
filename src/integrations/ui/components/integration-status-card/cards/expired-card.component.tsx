import { Button } from "@beweco/aurora-ui";
import type { FC } from "react";
import type { ReauthorizableCardProps } from "../integration-status-card.types";
import BaseIntegrationCard from "./base-integration-card.component";

/**
 * Card para el estado EXPIRED
 * Muestra botón de renovar
 */
const ExpiredCard: FC<ReauthorizableCardProps> = ({
	integration,
	statusConfig,
	platformIcon,
	onReauthorize,
}) => {
	// Número de teléfono como extra en el header
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
				<Button
					color="warning"
					variant="solid"
					size="md"
					onClick={() => onReauthorize?.(integration.id)}
				>
					Renovar
				</Button>
			}
		/>
	);
};

export default ExpiredCard;
