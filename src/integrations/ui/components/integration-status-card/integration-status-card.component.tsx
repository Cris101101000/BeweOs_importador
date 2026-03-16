import type { FC } from "react";
import { INTEGRATION_STATUS_CONFIG } from "../../../domain";
import { getCardComponent } from "./cards";
import type { IntegrationStatusCardProps } from "./integration-status-card.types";
import { getPlatformIcon } from "./platform-icons";

const IntegrationStatusCard: FC<IntegrationStatusCardProps> = ({
	integration,
	onToggle,
	onConnect,
	onReauthorize,
}) => {
	const statusConfig = INTEGRATION_STATUS_CONFIG[integration.status];
	const platformIcon = getPlatformIcon(integration.platform);
	const CardComponent = getCardComponent(integration.status);

	return (
		<CardComponent
			integration={integration}
			statusConfig={statusConfig}
			platformIcon={platformIcon}
			onToggle={onToggle}
			onConnect={onConnect}
			onReauthorize={onReauthorize}
		/>
	);
};

export default IntegrationStatusCard;
