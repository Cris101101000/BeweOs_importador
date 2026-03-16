import type { FC } from "react";
import { ProposedContentCardItem } from "./proposed-content-card-item.component";

export interface ProposedContentItem {
	id: string;
	imageUrl: string;
	text: string;
	contentType: "instagram-post" | "instagram-story" | "tiktok-video";
}

export interface ProposedContentCardsProps {
	items: ProposedContentItem[];
	onApprove: (id: string) => void;
	onDiscard: (id: string) => void;
	onPreview: (id: string) => void;
	isLoading?: boolean;
}

export const ProposedContentCards: FC<ProposedContentCardsProps> = ({
	items,
	onApprove,
	onDiscard,
	onPreview,
	isLoading = false,
}) => {
	if (items.length === 0) {
		return (
			<div className="text-center py-12">
				<div className="text-gray-400 mb-2">
					<svg
						className="w-16 h-16 mx-auto"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1.5}
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
				</div>
				<p className="text-gray-500 text-sm">
					No hay contenido propuesto disponible
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			{items.map((item) => (
				<ProposedContentCardItem
					key={item.id}
					item={item}
					onApprove={() => onApprove(item.id)}
					onDiscard={() => onDiscard(item.id)}
					onPreview={() => onPreview(item.id)}
					isLoading={isLoading}
				/>
			))}
		</div>
	);
};
