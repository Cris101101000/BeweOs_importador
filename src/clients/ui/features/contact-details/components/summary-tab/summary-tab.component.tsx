import type { IClient } from "@clients/domain/interfaces/client.interface";
import { Summary } from "./summary.component";
import type { FC } from "react";

export interface SummaryTabProps {
	client: IClient;
}

/**
 * Contenido del tab "Resumen Linda": insights de IA y acciones recomendadas.
 */
export const SummaryTab: FC<SummaryTabProps> = ({ client }) => {
	return (
		<div className="flex flex-col gap-4">
			<Summary client={client} />
		</div>
	);
};
