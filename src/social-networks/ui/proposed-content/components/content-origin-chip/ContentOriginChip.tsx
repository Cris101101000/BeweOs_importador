import { Chip, IconComponent } from "@beweco/aurora-ui";
import {
	ContentOrigin,
	ORIGIN_CHIP_CONFIG,
} from "@shared/features/linda/content-generation";

export interface ContentOriginChipProps {
	origin: ContentOrigin;
}

/**
 * Chip que muestra el origen del contenido (generación automática, manual, banco de ideas)
 * con estilo glass, icono y color por origen.
 */
export function ContentOriginChip({ origin }: ContentOriginChipProps) {
	const config = ORIGIN_CHIP_CONFIG[origin];
	if (!config) return null;

	return (
		<Chip
			size="sm"
			variant="flat"
			className={`border border-white/30 text-white backdrop-blur-xl shadow-xl ${config.chipThemeClasses}`}
			endContent={
				<IconComponent
					icon={config.chipIcon}
					className={`shrink-0 ${config.chipIconColorClass}`}
				/>
			}
		>
			{config.label}
		</Chip>
	);
}
