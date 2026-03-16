import type { FC } from "react";
import type { BaseIntegrationCardProps } from "../integration-status-card.types";
import BaseIntegrationCard from "./base-integration-card.component";

/**
 * Card para el estado REGISTERING
 * Solo muestra información sin acciones
 */
const RegisteringCard: FC<BaseIntegrationCardProps> = ({
	integration,
	statusConfig,
	platformIcon,
}) => {
	return (
		<BaseIntegrationCard
			platformIcon={platformIcon}
			name={integration.name}
			description={statusConfig.description}
			statusConfig={statusConfig}
			showStatusChip={true}
		/>
	);
};

export default RegisteringCard;
