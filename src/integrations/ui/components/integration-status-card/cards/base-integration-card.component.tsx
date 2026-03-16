import { Chip } from "@beweco/aurora-ui";
import type { FC, ReactNode } from "react";
import type { IntegrationStatusConfig } from "../../../../domain";

interface BaseIntegrationCardProps {
	platformIcon: ReactNode;
	name: string;
	description: ReactNode;
	statusConfig?: IntegrationStatusConfig;
	showStatusChip?: boolean;
	headerExtra?: ReactNode;
	action?: ReactNode;
	containerClassName?: string;
	borderClassName?: string;
}

/**
 * Componente base para las cards de integración
 * Proporciona la estructura común: icono | contenido | acción
 */
const BaseIntegrationCard: FC<BaseIntegrationCardProps> = ({
	platformIcon,
	name,
	description,
	statusConfig,
	showStatusChip = true,
	headerExtra,
	action,
	containerClassName = "",
	borderClassName = "border-gray-200",
}) => {
	return (
		<div
			className={`flex items-center gap-4 p-4 bg-white border rounded-xl h-[120px] shadow-sm ${borderClassName} ${containerClassName}`}
		>
			{/* Icono de plataforma */}
			<div className="flex-shrink-0">{platformIcon}</div>

			{/* Contenido principal */}
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 mb-1 flex-wrap">
					<h3 className="text-base font-semibold text-zinc-700 truncate">
						{name}
					</h3>
					{showStatusChip && statusConfig && (
						<Chip size="sm" color={statusConfig.color} variant="flat">
							{statusConfig.defaultLabel}
						</Chip>
					)}
					{headerExtra}
				</div>
				<div className="text-sm text-zinc-600 leading-relaxed line-clamp-2">
					{description}
				</div>
			</div>

			{/* Acción */}
			{action && <div className="flex-shrink-0">{action}</div>}
		</div>
	);
};

export default BaseIntegrationCard;
