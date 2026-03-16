import { Button } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import type { ConnectableCardProps } from "../integration-status-card.types";
import BaseIntegrationCard from "./base-integration-card.component";

/**
 * Card para el estado NOT_CONFIGURED
 * Muestra botón de "Configurar ahora"
 */
const NotConfiguredCard: FC<ConnectableCardProps> = ({
	integration,
	platformIcon,
	onConnect,
}) => {
	const { t } = useTranslate();

	return (
		<BaseIntegrationCard
			platformIcon={platformIcon}
			name={t(integration.nameKey)}
			description={t(integration.descriptionKey)}
			showStatusChip={false}
			borderClassName="border-orange-200"
			containerClassName="shadow-[0_0_0_2px_#FEF3E8]"
			action={
				<Button
					color="primary"
					variant="solid"
					size="md"
					className="h-10 px-4"
					onClick={() => onConnect?.(integration.id)}
				>
					{t("integrations_configure")}
				</Button>
			}
		/>
	);
};

export default NotConfiguredCard;
