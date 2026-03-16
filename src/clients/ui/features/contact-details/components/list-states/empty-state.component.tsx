import { Button, IconComponent, P } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { memo } from "react";

interface EmptyStateProps {
	icon: string;
	title: string;
	description: string;
	buttonText?: string;
	onAction?: () => void;
}

export const EmptyState: FC<EmptyStateProps> = memo(
	({ icon, title, description, buttonText, onAction }) => {
		const { t } = useTranslate();
		const showButton = Boolean(buttonText && onAction);

		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<IconComponent icon={icon} className="text-4xl text-default-400 mb-2" />
				<P>{t(title, title)}</P>
				<P className="text-xs text-default-400 mb-4">
					{t(description, description)}
				</P>
				{showButton && (
					<Button color="primary" size="sm" onPress={onAction}>
						{t(buttonText!, buttonText)}
					</Button>
				)}
			</div>
		);
	}
);
