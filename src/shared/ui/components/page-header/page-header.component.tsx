import { Button, Chip, H1, IconComponent } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";

import type { PageHeaderProps } from "./page-header.types";

export const PageHeader: FC<PageHeaderProps> = ({
	onBack,
	title,
	metadata,
	actions,
}) => {
	const { t } = useTranslate();

	return (
		<>
			{onBack && (
				<Button
					variant="light"
					color="primary"
					size="sm"
					onPress={onBack}
					startContent={
						<IconComponent
							icon="solar:alt-arrow-left-linear"
							className="text-primary"
							size="sm"
						/>
					}
					className="w-fit font-medium hover:bg-primary-50 transition-all duration-200"
				>
					{t("go_back", "Volver")}
				</Button>
			)}
			<header className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
				<div className="flex items-center gap-3">
					<H1 className="text-2xl font-bold text-default-900">{title}</H1>
					{metadata?.map((item) => (
						<Chip
							key={item.key}
							size="sm"
							variant={item.variant ?? "flat"}
							color={item.color ?? "default"}
							className="text-xs"
						>
							{item.label}
						</Chip>
					))}
				</div>
				{actions && (
					<div className="flex flex-col gap-2 sm:flex-row sm:gap-3 sm:justify-end">
						{actions}
					</div>
				)}
			</header>
		</>
	);
};
