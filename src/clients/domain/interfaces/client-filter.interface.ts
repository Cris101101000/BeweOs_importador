import type { EnumCreationChannel } from "@shared/domain/enums/enum-creation-channel.enum";
import type { IPagination } from "@shared/domain/interfaces/pagination.interface";
import type { EnumBusinessCategory } from "../enums/business-category.enum";
import type { EnumClientStatus } from "../enums/client-status.enum";
import type { EnumOrder } from "../enums/order.enum";
import type { EnumPotentialClient } from "../enums/potential.enum";

export interface IClientFilter extends IPagination {
	status?: EnumClientStatus[];
	category?: EnumBusinessCategory[];
	createdChannel?: EnumCreationChannel[];
	potential?: EnumPotentialClient[];
	// Tag filters
	tags?: string[];
	// Search
	search?: string; // For name, email, business search
	// Date filters
	createdDateFrom?: Date;
	createdDateTo?: Date;
	birthdateFrom?: Date;
	birthdateTo?: Date;
	lastCommunicationFrom?: Date;
	lastCommunicationTo?: Date;
	order?: EnumOrder;
}
