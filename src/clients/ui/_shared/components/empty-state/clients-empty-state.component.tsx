import { Button, H3, IconComponent, P } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";

interface ClientsEmptyStateProps {
	onCreate: () => void;
}

export const ClientsEmptyState: FC<ClientsEmptyStateProps> = ({ onCreate }) => {
	const { t } = useTranslate();

	return (
		<div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
			<div className="flex h-16 w-16 items-center justify-center rounded-full bg-default-100 text-default-600">
				<IconComponent
					icon="solar:users-group-rounded-linear"
					className="text-3xl"
					aria-hidden="true"
				/>
			</div>
			<div className="max-w-md">
				<H3>{t("clients_empty_title", "Aún no tienes contactos")}</H3>
				<P className="text-default-500 mt-1">
					{t(
						"clients_empty_description",
						"Comienza creando tu primer contacto para gestionar tus campañas."
					)}
				</P>
			</div>
			<Button color="primary" variant="solid" onPress={onCreate}>
				{t("button_new_contact", "Nuevo contacto")}
			</Button>
		</div>
	);
};
