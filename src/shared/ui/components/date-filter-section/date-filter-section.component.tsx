import { DateSelector, H4, IconComponent } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import type { DateFilterSectionProps } from "./date-filter-section.types";

/**
 * DateFilterSection Component
 * Componente reutilizable para mostrar una sección de filtro de fechas
 * con icono, título y DateSelector
 */
export const DateFilterSection: FC<DateFilterSectionProps> = ({
	icon,
	translationKey,
	defaultTitle,
	onChange,
	initialType = "singleDay",
	initialDate,
	initialRange,
	className = "",
}) => {
	const { t } = useTranslate();

	return (
		<section className={`flex flex-col gap-2 ${className}`}>
			<div className="flex items-center gap-2">
				<IconComponent icon={icon} size="sm" />
				<H4>{t(translationKey, defaultTitle)}</H4>
			</div>
			<div className="ml-2">
				<DateSelector
					initialType={initialType}
					className="flex flex-col !gap-2 !items-start text-[10px]"
					onChange={onChange}
					initialDate={initialDate || undefined}
					initialDateRange={initialRange || undefined}
					radioItemProps={{
						classNames: {
							label: "text-tiny",
						},
					}}
				/>
			</div>
		</section>
	);
};
