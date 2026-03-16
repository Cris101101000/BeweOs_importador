import type { FC } from "react";
import { useTranslate } from "@tolgee/react";
import { CollapsibleHeader, DashboardStatsCard, SectionNoDataOverlay } from "../";
import type { IContactsStats } from "../../../domain/interfaces/dashboard.interface";

export interface ContactsSectionProps {
	isExpanded: boolean;
	onToggle: () => void;
	data: IContactsStats;
}

export const ContactsSection: FC<ContactsSectionProps> = ({
	isExpanded,
	onToggle,
	data,
}) => {
	const { t } = useTranslate();

	const hasNoData =
		data.totalContacts === 0 &&
		data.newContacts === 0 &&
		data.contactsGeneratedByLinda === 0;

	return (
		<div className="bg-white rounded-lg shadow-sm border">
			<CollapsibleHeader
				title={t("dashboard_contacts", "Contactos")}
				isExpanded={isExpanded}
				onToggle={onToggle}
			/>

			{isExpanded && (
				<div className="px-4 pb-4 relative">
					{hasNoData && <SectionNoDataOverlay />}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<DashboardStatsCard
							title={t("dashboard_total_contacts", "Total Contactos")}
							value={data.totalContacts.toLocaleString()}
							description={t(
								"dashboard_contacts_active",
								"Contactos activos"
							)}
							icon="solar:users-group-rounded-linear"
							color="blue"
							trend={data.totalContactsTrend ?? undefined}
						/>
						<DashboardStatsCard
							title={t("dashboard_new_contacts", "Nuevos Contactos")}
							value={data.newContacts.toLocaleString()}
							description={t(
								"dashboard_contacts_this_period",
								"Este periodo"
							)}
							icon="solar:user-plus-linear"
							color="green"
							trend={data.newContactsTrend ?? undefined}
						/>
						<DashboardStatsCard
							title={t(
								"dashboard_contacts_generated_by_linda",
								"Contactos generados por Linda"
							)}
							value={data.contactsGeneratedByLinda.toLocaleString()}
							description={t(
								"dashboard_contacts_this_period",
								"Este periodo"
							)}
							icon="solar:chat-round-dots-linear"
							color="purple"
							trend={data.contactsGeneratedByLindaTrend ?? undefined}
						/>
					</div>
				</div>
			)}
		</div>
	);
};
