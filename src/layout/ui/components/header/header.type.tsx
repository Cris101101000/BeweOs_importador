import type {
	BreadcrumbItemComponentProps,
	HeaderOptions,
} from "@beweco/aurora-ui";

export type HeaderProps = {
	onMenuClick: () => void;
	onLogout: () => void;
	onOptionSelect?: (href: string) => void;
	onBreadcrumbClick?: (href: string) => void;
	options: HeaderOptions[];
	breadcrumbs?: BreadcrumbItemComponentProps[];
};
