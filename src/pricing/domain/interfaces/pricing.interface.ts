export interface IPricingPlan {
	id: string;
	key: string;
	title: string;
	description: string;
	price: string | IPricingPrice;
	priceSuffix?: string;
	features: string[];
	buttonText: string;
	buttonVariant:
		| "solid"
		| "bordered"
		| "light"
		| "flat"
		| "faded"
		| "shadow"
		| "ghost";
	href: string;
	mostPopular?: boolean;
	tag?: string;
	highlighted?: boolean;
}

export interface IPricingPrice {
	monthly: string;
	quarterly?: string;
	yearly: string;
}

export interface IPricingFrequency {
	key: FrequencyEnum;
	label: string;
	priceSuffix: string;
	discount?: string;
}

export enum FrequencyEnum {
	Monthly = "monthly",
	Quarterly = "quarterly",
	Yearly = "yearly",
}

export interface IPricingConfig {
	title: string;
	subtitle: string;
	description: string;
	frequencies: IPricingFrequency[];
	plans: IPricingPlan[];
	footerText?: string;
	footerLink?: {
		text: string;
		href: string;
	};
}
