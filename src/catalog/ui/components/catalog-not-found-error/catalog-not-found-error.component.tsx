import { Button, H2, IconComponent, P } from "@beweco/aurora-ui";
import type { FC } from "react";

interface CatalogNotFoundErrorProps {
	title: string;
	description: string;
	buttonText: string;
	onBack: () => void;
}

export const CatalogNotFoundError: FC<CatalogNotFoundErrorProps> = ({
	title,
	description,
	buttonText,
	onBack,
}) => {
	return (
		<div className="flex items-center justify-center min-h-[400px]">
			<div className="text-center">
				<div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<IconComponent
						icon="solar:danger-circle-linear"
						className="w-8 h-8 text-danger-600"
					/>
				</div>
				<H2 className="text-xl font-semibold text-default-900 mb-2">
					{title}
				</H2>
				<P className="text-default-600 mb-6">{description}</P>
				<Button color="primary" onPress={onBack}>
					{buttonText}
				</Button>
			</div>
		</div>
	);
};

