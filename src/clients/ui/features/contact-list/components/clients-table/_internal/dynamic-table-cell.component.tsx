import { Chip } from "@beweco/aurora-ui";
import type { IAiTag } from "@clients/domain/interfaces/ai-tag.interface";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import { EnumFieldType } from "@clients/domain/types/data-type.type";
import {
	formatDateForDisplay,
	formatISODateForDisplay,
} from "@shared/utils/date-formatter.utils";
import type { FC } from "react";

interface DynamicTableCellProps {
	client: IClient;
	fieldKey: string;
	dataType: EnumFieldType;
	value?: unknown;
}

/**
 * Dynamic table cell component that renders content based on data type
 */
export const DynamicTableCell: FC<DynamicTableCellProps> = ({
	client,
	fieldKey,
	dataType,
	value,
}) => {
	// Get the value from client based on fieldKey if not provided
	const cellValue = value ?? getValueByKey(client, fieldKey);

	switch (dataType) {
		case EnumFieldType.Text:
		case EnumFieldType.Number:
			return (
				<span className="text-sm text-default-600">
					{cellValue ? String(cellValue) : "-"}
				</span>
			);

		case EnumFieldType.Date: {
			const dateString = cellValue as string;
			if (!dateString)
				return <span className="text-sm text-default-600">-</span>;

			// Check if it's ISO format (contains 'T' and 'Z' or ends with 'Z')
			const isISOFormat = dateString.includes("T") || dateString.endsWith("Z");

			return (
				<span className="text-sm text-default-600">
					{isISOFormat
						? formatISODateForDisplay(dateString)
						: formatDateForDisplay(dateString)}
				</span>
			);
		}

		case EnumFieldType.MultiSelect: {
			const tags = cellValue as IAiTag[] | undefined;
			return (
				<div className="flex flex-wrap gap-1">
					{tags?.slice(0, 2).map((tag: IAiTag) => (
						<Chip
							key={tag.value}
							size="sm"
							variant="flat"
							color="default"
							radius="sm"
						>
							{tag.value}
						</Chip>
					))}
					{(tags?.length || 0) > 2 && (
						<Chip size="sm" variant="flat" color="default" radius="sm">
							+{(tags?.length || 0) - 2}
						</Chip>
					)}
				</div>
			);
		}

		default:
			return (
				<span className="text-sm text-default-600">
					{String(cellValue) || "-"}
				</span>
			);
	}
};

/**
 * Helper function to get value from client object by field key
 */
function getValueByKey(client: IClient, key: string): unknown {
	switch (key) {
		case "email":
			return client.email;
		case "birthdate":
			return client.birthdate;
		case "ai_tags":
			return client.tags;
		case "last_communication":
			return client.lastCommunication;
		case "createdAt":
			return client.createdAt;
		default:
			// For other dynamic fields, try to access the property directly
			return (client as unknown as Record<string, unknown>)[key];
	}
}
