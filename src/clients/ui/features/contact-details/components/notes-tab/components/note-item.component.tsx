import { Button, IconComponent, P, Tooltip } from "@beweco/aurora-ui";
import { HISTORY_CONFIG } from "@clients/domain/constants/history.constants";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import type { INote } from "@clients/domain/interfaces/note.interface";
import { formatDateObjectToDisplay } from "@shared/utils/date-formatter.utils";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { memo } from "react";

interface NoteItemProps {
	note: INote;
	client: IClient;
	onEdit: (client: IClient, note: INote) => void;
	onDelete: (note: INote) => void;
}

export const NoteItem: FC<NoteItemProps> = memo(
	({ note, client, onEdit, onDelete }) => {
		const { t } = useTranslate();

		return (
			<div className="flex items-start justify-between p-4 border border-default-100 rounded-lg transition-colors bg-default-50">
				<div className="flex-1">
					<div className="flex items-center justify-between gap-2 mb-2">
						{/* Mostrar quién creó la nota si está disponible */}
						{note.createdBy && (
							<div className="flex items-center gap-1">
								<P className="text-xs text-default-600">
									{t("note_created_by", "Creado por")}: {note.createdBy}
								</P>
							</div>
						)}
						<P className="text-xs text-default-500 flex-shrink-0">
							{formatDateObjectToDisplay(note.createdAt)}
						</P>
					</div>
					<P className="text-small font-medium text-default-900 truncate flex-1 mr-2">
						{note.title}
					</P>

					{/* Descripción limitada a 2 líneas con ellipsis */}
					<P className="text-sm text-default-700 line-clamp-2 leading-relaxed">
						{note.description}
					</P>
				</div>
				<div className="flex items-center gap-2 ml-4">
					<Tooltip content={t("tooltip_edit_note", "Editar nota")}>
						<Button
							variant="light"
							size="sm"
							color="default"
							isIconOnly
							onPress={() => onEdit(client, note)}
							startContent={
								<IconComponent
									icon={HISTORY_CONFIG.icons.edit}
									size="sm"
									className="text-default-400"
								/>
							}
						/>
					</Tooltip>
					<Button
						variant="light"
						size="sm"
						color="danger"
						isIconOnly
						onPress={() => onDelete(note)}
						startContent={
							<IconComponent icon={HISTORY_CONFIG.icons.delete} size="sm" />
						}
					/>
				</div>
			</div>
		);
	}
);

NoteItem.displayName = "NoteItem";
