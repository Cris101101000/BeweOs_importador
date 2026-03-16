import type {
	IShareLinkParams,
	ShareChannelType,
} from "src/lindaConfig/domain/share/types";


/**
 * Genera el link de compartir según el tipo de canal
 */
export const generateShareLink = (params: IShareLinkParams): string => {
	const { channelType, businessId, phoneNumber, instagramHandle } = params;

	switch (channelType) {
		case "web":
			return `${process.env.REACT_APP_CHATBOT_BASE_URL}/${businessId}`;

		case "whatsapp": {
			if (!phoneNumber) return "";
			const formattedNumber = phoneNumber.replace(/\D/g, "");
			return `https://wa.me/${formattedNumber}`;
		}

		case "instagram":
			if (!instagramHandle) return "";
			return `https://ig.me/m/${instagramHandle}`;

		default:
			return "";
	}
};

/**
 * Obtiene el link de compartir para un canal específico usando la sesión del usuario
 */
export const getShareLinkForChannel = (
	channelType: ShareChannelType,
	channelAccounts?: { whatsapp?: string; instagram?: string }
): string => {
	const businessId = window.USER_SESSION?.pk || "";

	return generateShareLink({
		channelType,
		businessId,
		phoneNumber: channelAccounts?.whatsapp,
		instagramHandle: channelAccounts?.instagram,
	});
};
