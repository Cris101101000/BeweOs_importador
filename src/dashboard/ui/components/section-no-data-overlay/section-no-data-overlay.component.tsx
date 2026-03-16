import { P, IconComponent } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";


export const SectionNoDataOverlay: FC = () => {
	const { t } = useTranslate();

	return (
		<div
			className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[0.5px] bg-white/25 rounded-lg min-h-[200px]"
			aria-live="polite"
		>
			<div className="flex flex-col items-center gap-3 px-8 py-6 rounded-3xl bg-slate-50 shadow-md shadow-slate-200/40 border border-slate-200/80">
				<IconComponent
					icon="solar:diagram-down-bold-duotone"
					className="size-20 text-blue-500 shrink-0"
				/>
				<div className="flex flex-col items-center gap-1 text-center max-w-xs">
					<P className="text-base font-semibold text-blue-600 m-0">
						{t("dashboard_no_data_ready_title", "¡Todo listo para empezar!")}
					</P>
					<P className="text-sm font-medium text-slate-600 m-0">
						{t("dashboard_no_data_ready_description", "En cuanto registres tus primeras actividades, verás tus gráficos cobrar vida.")}
					</P>
				</div>
			</div>
		</div>
	);
};
