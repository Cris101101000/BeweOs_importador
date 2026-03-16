import type {
	ICreateFAQInput,
	IFAQ,
	IFAQFilters,
	IFAQListResponse,
	IUpdateFAQInput,
} from "./interface";

export interface IFAQRepository {
	getFAQs(filters?: IFAQFilters): Promise<IFAQListResponse>;
	createFAQ(faq: ICreateFAQInput): Promise<IFAQ>;
	updateFAQ(id: string, faq: IUpdateFAQInput): Promise<IFAQ>;
	deleteFAQ(id: string): Promise<void>;
}
