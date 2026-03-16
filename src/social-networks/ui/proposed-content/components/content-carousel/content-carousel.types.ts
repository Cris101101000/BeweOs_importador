import type { ContentOrigin } from "@shared/features/linda/content-generation";

export interface CarouselItem {
	id: string;
	title: string;
	caption?: string; // Texto completo del post
	imageUrl?: string;
	gradient: string;
	type:
		| "instagram-post"
		| "instagram-story"
		| "tiktok-video"
		| "whatsapp-message"
		| "whatsapp";

	// Extended fields from Content Generation API
	name?: string;
	category?: string;
	language?: string;
	variables?: Record<string, any>;
	blocks?: any[];
	generatedAssets?: any[];
	status?: string;
	origin?: ContentOrigin;
	createdAt?: Date;
	updatedAt?: Date;
	publishedAt?: Date;
}

export interface ContentCarouselProps {
	items: CarouselItem[];
	onItemClick?: (item: CarouselItem) => void;
	onEdit?: (item: CarouselItem) => void;
	onDelete?: (item: CarouselItem) => void;
	onPublish?: (item: CarouselItem) => void;
	className?: string;
	emptyStateRedirectPath?: string;
	emptyStateButtonText?: string;
	compactHeader?: boolean; // Si true, muestra el contador de personas en la misma línea que los botones
}

export interface CarouselItemProps {
	item: CarouselItem;
	position: number; // -2, -1, 0, 1, 2
	onClick?: () => void;
}
