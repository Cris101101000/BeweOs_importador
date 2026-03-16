import { Tab, Tabs } from "@beweco/aurora-ui";
import { PageHeader } from "@shared/ui/components/page-header";
import { ViewSkeleton } from "@shared/ui/components";

import { useTranslate } from "@tolgee/react";
import React, { Suspense, useEffect, useState } from "react";
import { GetBusinessInformationUseCase } from "../bussinesConfig/application/get-business-information.usecase";
import type { IBusinessInformation } from "../bussinesConfig/domain/interfaces/business-information.interface";
import { BusinessInformationAdapter } from "../bussinesConfig/infrastructure/adapters/business-information.adapter";

const Shedules = React.lazy(() => import("../schedules/ui/Shedules"));
const Users = React.lazy(() => import("../users/ui/Users"));
const Contact = React.lazy(() => import("../contact/ui/Contact"));
const Location = React.lazy(() => import("../location/ui/Location"));
const Widgets = React.lazy(() => import("../widgets/ui/Widgets"));
const BussinesConfig = React.lazy(
	() =>
		import(
			"../bussinesConfig/ui/business-information/page/business-information.page"
		)
);

const Settings: React.FC = () => {
	const { t } = useTranslate();
	const [businessInformation, setBusinessInformation] =
		useState<IBusinessInformation | null>(null);

	const refreshBusinessInformation = async () => {
		const adapter = new BusinessInformationAdapter();
		const useCase = new GetBusinessInformationUseCase(adapter);
		const data = await useCase.execute();
		setBusinessInformation(data);
	};

	useEffect(() => {
		refreshBusinessInformation();
	}, []);

	return (
		<div className="w-full flex flex-col gap-4 max-w-7xl">
			<PageHeader title={t("settings_main_title")} />
			<Tabs
				aria-label={t("settings_main_title")}
				className="w-full"
				classNames={{
					tabList: "overflow-x-auto flex-nowrap justify-start",
					base: "w-full",
					panel: "w-full p-0",
				}}
			>
				<Tab key="negocio" title={t("settings_tab_business_config")}>
					<Suspense fallback={<ViewSkeleton variant="split" />}>
						<BussinesConfig
							businessInformation={businessInformation}
							onDataUpdated={refreshBusinessInformation}
						/>
					</Suspense>
				</Tab>
				<Tab key="contact" title={t("settings_tab_contact_info")}>
					<Suspense fallback={<ViewSkeleton variant="split" />}>
						<Contact
							contactInfo={businessInformation?.contactInfo}
							webDomain={businessInformation?.basicInfo.webDomain}
							onDataUpdated={refreshBusinessInformation}
						/>
					</Suspense>
				</Tab>
				<Tab key="horarios" title={t("settings_tab_schedules")}>
					<Suspense fallback={<ViewSkeleton variant="split" />}>
						<Shedules
							schedule={businessInformation?.schedule}
							holidays={businessInformation?.holidays}
						/>
					</Suspense>
				</Tab>
				<Tab key="usuarios" title={t("settings_tab_users")}>
					<Suspense fallback={<ViewSkeleton variant="table" />}>
						<Users />
					</Suspense>
				</Tab>
				<Tab key="ubicacion" title={t("settings_tab_location")}>
					<Suspense fallback={<ViewSkeleton variant="split" />}>
						<Location
							location={businessInformation?.contactInfo?.address}
							onDataUpdated={refreshBusinessInformation}
						/>
					</Suspense>
				</Tab>

				{/* TODO: Add widgets tab when it is implemented */}
				{/* <Tab key="widgets" title={t("settings_tab_widgets")}>
					<Suspense fallback={<ViewSkeleton variant="form" />}>
						<Widgets />
					</Suspense>
				</Tab> */}
			</Tabs>
		</div>
	);
};

export default Settings;
