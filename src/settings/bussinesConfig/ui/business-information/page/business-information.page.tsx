import { Card } from "@beweco/aurora-ui";
import type React from "react";
import { useState } from "react";
import { BusinessInformationForm } from "../components/bussines-information-form/business-information-form";
import { CurrencyManager } from "../components/currency-manager/currency-manager.component";
import { LogoManager } from "../components/logo-manager/logo-manager.component";
import { useLogoManagement } from "../hooks/use-logo-management.hook";
import type { BusinessInformationPageProps } from "../interfaces/business-information-page.interface";

export const BusinessInformationPage: React.FC<
	BusinessInformationPageProps
> = ({ businessInformation, onDataUpdated }) => {
	const [selectedCurrency, setSelectedCurrency] = useState<string>(
		(businessInformation?.businessInfo.currency.code || "mxn").toLowerCase()
	);

	const { displayLogo, isUploading, handleLogoUpload, handleRemoveLogo } =
		useLogoManagement(businessInformation?.brandConfig.logo, onDataUpdated);

	return (
		<div className="pt-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
			{/* Información de negocio */}
			<Card className="p-5 w-full gap-4">
				<BusinessInformationForm
					initialData={businessInformation}
					onDataUpdated={onDataUpdated}
				/>
			</Card>

			{/* Columna derecha */}
			<div className="flex flex-col gap-4">
				{/* Logo */}
				<LogoManager
					logo={displayLogo}
					isUploading={isUploading}
					onLogoUpload={handleLogoUpload}
					onLogoRemove={handleRemoveLogo}
				/>

				{/* Moneda */}
				<CurrencyManager
					selectedCurrency={selectedCurrency}
					onCurrencyChange={(currency) => setSelectedCurrency(currency)}
				/>
			</div>
		</div>
	);
};

export default BusinessInformationPage;
