import { Button, IconComponent, P } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";

interface ClientNotFoundProps {
	onGoBack: () => void;
}

/**
 * ClientNotFound Component
 *
 * Displays a user-friendly message when a client is not found
 * with an option to go back to the previous page.
 */
export const ClientNotFound: FC<ClientNotFoundProps> = ({ onGoBack }) => {
	const { t } = useTranslate();

	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6">
			<IconComponent
				icon="solar:user-cross-outline"
				className="text-4xl text-default-400"
			/>
			<P className="text-default-600">
				{t("client_not_found", "No se encontró el cliente")}
			</P>
			<Button color="primary" onPress={onGoBack}>
				{t("go_back", "Volver")}
			</Button>
		</div>
	);
};
