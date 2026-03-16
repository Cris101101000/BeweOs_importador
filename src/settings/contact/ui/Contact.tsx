import type { IContactInfo } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import type React from "react";
import {
	DigitalContactForm,
	PhoneForm,
	SocialMediaForm,
	WhatsAppBusinessForm,
} from "./components";

/**
 * Main component for the contact settings page.
 * It renders the different contact forms in a two-column layout.
 *
 * @returns {React.FC} The rendered contact page.
 */
const Contact: React.FC<{
	contactInfo: IContactInfo | undefined;
	webDomain: string | undefined;
	onDataUpdated?: () => void;
}> = ({ contactInfo, webDomain, onDataUpdated }) => {
	console.log("contactInfo", contactInfo);
	return (
		<>
			<div className="pt-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:items-start">
				<div className="flex flex-col gap-4">
					<PhoneForm
						phones={contactInfo?.phones || []}
						onDataUpdated={onDataUpdated}
					/>
					{/* ///TODO Validar por que debe usarse en es integraciones */}
					{/* <WhatsAppBusinessForm phones={contactInfo?.phonesWhatsapp || []} /> */}
				</div>
				<div className="flex flex-col gap-4">
					<DigitalContactForm
						emails={contactInfo?.emails || []}
						webDomain={webDomain}
						onDataUpdated={onDataUpdated}
					/>
					<SocialMediaForm
						socialNetwork={contactInfo?.socialNetwork || {}}
						onDataUpdated={onDataUpdated}
					/>
				</div>
			</div>
		</>
	);
};

export default Contact;
