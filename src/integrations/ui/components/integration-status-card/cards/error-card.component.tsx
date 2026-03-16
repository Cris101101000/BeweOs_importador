import { Button, Tooltip } from "@beweco/aurora-ui";
import type { FC } from "react";
import type { ReauthorizableCardProps } from "../integration-status-card.types";
import BaseIntegrationCard from "./base-integration-card.component";

/**
 * Card para el estado ERROR
 * Muestra descripción con tooltip de ayuda y botón de reautorizar
 */
const ErrorCard: FC<ReauthorizableCardProps> = ({
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

	// Descripción con tooltip de ayuda
	const description = (
		<div className="flex items-center gap-1">
			<span>{statusConfig.description}</span>
			<Tooltip
				content={
					<div className="max-w-xs">
						<p className="font-medium mb-2">Detalles del error:</p>
						<ul className="text-sm space-y-1">
							<li>• Token de acceso expirado</li>
							<li>• Requiere reautorización</li>
						</ul>
						<p className="text-sm mt-2 font-medium">Solución:</p>
						<p className="text-sm">
							Haz clic en "Reautorizar" para renovar los permisos.
						</p>
					</div>
				}
				placement="top"
			>
				<span className="inline-flex items-center justify-center w-4 h-4 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full cursor-help text-xs">
					?
				</span>
			</Tooltip>
		</div>
	);

	return (
		<BaseIntegrationCard
			platformIcon={platformIcon}
			name={integration.name}
			description={description}
			statusConfig={statusConfig}
			showStatusChip={true}
			headerExtra={headerExtra}
			action={
				<Button
					color="danger"
					variant="solid"
					size="md"
					onClick={() => onReauthorize?.(integration.id)}
				>
					Reautorizar
				</Button>
			}
		/>
	);
};

export default ErrorCard;
