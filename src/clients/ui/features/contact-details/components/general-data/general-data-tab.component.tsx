import type { IClient } from "@clients/domain/interfaces/client.interface";
import type { EditContactFormData } from "../../types/edit-contact-form-data";
import type { FC } from "react";
import { GeneralData } from "./general-data.component";

export interface GeneralDataTabProps {
	client: IClient;
	onSave: (data: EditContactFormData) => void | Promise<void>;
	lastCommunicationDisplay: string;
	/** Increment to refresh tags in ClientTagsCard (e.g. after modal save) */
	tagsRefreshKey?: number;
}

/**
 * Tab "Información Básica": muestra cardInfo, etiquetas y telefonos (GeneralData).
 */
export const GeneralDataTab: FC<GeneralDataTabProps> = ({
	client,
	onSave,
	lastCommunicationDisplay,
	tagsRefreshKey,
}) => {
	return (
		<div className="flex flex-col gap-4">
			<GeneralData
				client={client}
				onSave={onSave}
				lastCommunicationDisplay={lastCommunicationDisplay}
				tagsRefreshKey={tagsRefreshKey}
			/>
		</div>
	);
};
