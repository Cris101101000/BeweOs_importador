import { Button, IconComponent, P } from "@beweco/aurora-ui";
import { HISTORY_CONFIG } from "@clients/domain/constants/history.constants";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { memo } from "react";

interface ErrorStateProps {
	errorKey: string;
	defaultMessage: string;
	onRetry: () => void;
}

export const ErrorState: FC<ErrorStateProps> = memo(
	({ errorKey, defaultMessage, onRetry }) => {
		const { t } = useTranslate();

		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<IconComponent
					icon={HISTORY_CONFIG.icons.error}
					className="text-4xl text-danger mb-2"
				/>
				<P className="text-danger">{t(errorKey, defaultMessage)}</P>
				<Button
					color="primary"
					size="sm"
					variant="light"
					onPress={onRetry}
					className="mt-2"
				>
					{t("retry", "Reintentar")}
				</Button>
			</div>
		);
	}
);
