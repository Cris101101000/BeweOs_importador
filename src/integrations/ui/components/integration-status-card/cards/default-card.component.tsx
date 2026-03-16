import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import type { BaseIntegrationCardProps } from "../integration-status-card.types";
import BaseIntegrationCard from "./base-integration-card.component";

/**
 * Card por defecto para estados no manejados
 */
const DefaultCard: FC<BaseIntegrationCardProps> = ({
	integration,
	platformIcon,
}) => {
	const { t } = useTranslate();

	return (
		<BaseIntegrationCard
			platformIcon={platformIcon}
			name={t(integration.nameKey)}
			description={t(integration.descriptionKey)}
			showStatusChip={false}
		/>
	);
};

export default DefaultCard;
