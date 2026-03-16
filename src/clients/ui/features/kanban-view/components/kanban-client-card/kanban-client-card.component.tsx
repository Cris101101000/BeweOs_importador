import {
	Avatar,
	Button,
	Card,
	CardBody,
	CardHeader,
	H4,
	IconComponent,
	P,
	Tooltip,
} from "@beweco/aurora-ui";
import { useAuraToast } from "@beweco/aurora-ui";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import { getClientFullName } from "@clients/domain/utils/client-name.utils";
import { TagsList } from "@clients/ui/_shared/components/tags-list";
import type { TagItem } from "@clients/ui/_shared/components/tags-list";
import { copyToClipboard } from "@shared/utils/clipboard.utils";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { useCallback } from "react";

interface KanbanClientCardProps {
	client: IClient;
	onClick?: (client: IClient) => void;
}

/**
 * KanbanClientCard Component
 *
 * Individual client card for the Kanban board.
 * Shows client information including name, business, and contact details.
 */
export const KanbanClientCard: FC<KanbanClientCardProps> = ({
	client,
	onClick,
}) => {
	const { showToast } = useAuraToast();
	const { t } = useTranslate();
	const handleClick = () => {
		onClick?.(client);
	};

	// Get primary phone number
	const primaryPhone = client.phones?.[0]?.number || "";

	// Handle copy to clipboard with feedback
	const handleCopyPhone = useCallback(async () => {
		if (!primaryPhone) return;
		const result = await copyToClipboard(primaryPhone);
		if (result.success) {
			showToast({
				color: "success",
				title: t("copied_phone", "Teléfono copiado"),
				description: result.value,
			});
		} else {
			showToast({
				color: "danger",
				title: t("copy_failed", "No se pudo copiar"),
			});
		}
	}, [primaryPhone, showToast, t]);

	const handleCopyEmail = useCallback(async () => {
		if (!client.email) return;
		const result = await copyToClipboard(client.email);
		if (result.success) {
			showToast({
				color: "success",
				title: t("copied_email", "Email copiado"),
				description: result.value,
			});
		} else {
			showToast({
				color: "danger",
				title: t("copy_failed", "No se pudo copiar"),
			});
		}
	}, [client.email, showToast, t]);

	return (
		<Card shadow="sm" radius="lg" className="w-full px-4 py-3">
			<CardHeader className="p-0 mb-3">
				<div className="flex items-center justify-between w-full gap-3 min-w-0">
					<div className="flex items-center gap-3 max-w-52">
						<Avatar
							color="primary"
							src={client.avatarUrl}
							name={getClientFullName(client)}
							size="sm"
							className="flex-shrink-0"
						/>
						<div className="flex flex-col justify-start flex-1 min-w-0 overflow-hidden">
							<Tooltip
								content={getClientFullName(client)}
								placement="top"
								isDisabled={getClientFullName(client).length <= 25}
							>
								<H4 className="text-start truncate text-sm font-semibold cursor-default">
									{getClientFullName(client)}
								</H4>
							</Tooltip>
							{client.bussines && (
								<P className="truncate text-start text-xs text-default-500">
									{client.bussines}
								</P>
							)}
						</div>
					</div>
					<Button
						isIconOnly
						size="sm"
						variant="light"
						color="default"
						onPress={handleClick}
						startContent={<IconComponent icon="solar:eye-outline" size="sm" />}
						aria-label="Ver detalles del cliente"
						className="min-w-8 w-8 h-8 rounded-full"
					/>
				</div>
			</CardHeader>
			<CardBody className="p-0">
				{/* AI Tags */}
				{client.tags && client.tags.length > 0 && (
					<div className="mb-2">
						<TagsList
							tags={
								client.tags?.map(
									(tag): TagItem => ({
										id: tag.id,
										label: tag.value,
										color: tag.color,
									})
								) || []
							}
							maxVisible={2}
							showEditButton={false}
							variant="inline"
						/>
					</div>
				)}

				{/* Contact Info */}
				{(primaryPhone || client.email) && (
					<div className="flex flex-col text-xs gap-1">
						{primaryPhone && (
							<div className="flex items-center gap-2 min-w-0">
								<P className="truncate flex-1 text-xs text-default-600">
									{primaryPhone}
								</P>
								<Button
									isIconOnly
									variant="flat"
									color="default"
									size="sm"
									className="cursor-pointer h-4 w-4 min-w-0 hover:bg-default-200 bg-transparent"
									onClick={handleCopyPhone}
									startContent={
										<IconComponent icon="solar:copy-outline" size="sm" />
									}
								/>
							</div>
						)}
						{client.email && (
							<div className="flex items-center gap-2 min-w-0">
								<P className="truncate flex-1 text-xs text-default-600">
									{client.email}
								</P>
								<Button
									isIconOnly
									variant="flat"
									color="default"
									size="sm"
									className="cursor-pointer h-4 w-4 min-w-0 hover:bg-default-200 bg-transparent"
									onClick={handleCopyEmail}
									startContent={
										<IconComponent icon="solar:copy-outline" size="sm" />
									}
								/>
							</div>
						)}
					</div>
				)}
			</CardBody>
		</Card>
	);
};
