import { useCallback, useEffect, useRef, useState } from "react";
import {
	ContentGenerationAdapter,
	extractCaptionFromBlocks,
	extractImageFromBlocks,
	toCarouselItemsFromContentGenerations,
} from "@shared/features/linda/content-generation";
import { getContentGenerations } from "@shared/features/linda/content-generation";
import type {
	IContentGeneration,
} from "@shared/features/linda/content-generation";
import type { SocialMediaCarouselItem } from "@beweco/aurora-ui";
import type { IContentProposal } from "src/onboarding/domain/social-showcase";
import { useOnboardingContentStore } from "../store/use-onboarding-content.store";

const repository = new ContentGenerationAdapter();

const POLLING_INTERVAL_MS = 5000;
const MAX_POLLING_ATTEMPTS = 12;

function toContentProposal(content: IContentGeneration): IContentProposal {
	const caption = extractCaptionFromBlocks(content.blocks);
	const imageUrl = extractImageFromBlocks(content.blocks);
	const firstAssetUrl =
		content.generatedAssets?.length > 0
			? content.generatedAssets[0].url
			: "";

	const lowerType = content.contentType?.toLowerCase() ?? "";
	const type: "story" | "post" = lowerType.includes("story")
		? "story"
		: "post";

	return {
		id: content.id,
		type,
		title: content.name,
		description: caption,
		imageUrl: imageUrl || firstAssetUrl,
		lindaSpeech:
			type === "story"
				? "Prepare este Story para tus clientes."
				: "Y este Post para tu feed.",
	};
}

function filterWhatsAppContent(contents: IContentGeneration[]): IContentGeneration[] {
	return contents.filter((c) => {
		const ct = c.contentType?.toLowerCase() ?? "";
		return ct.includes("whatsapp") || ct.includes('message')
	});
}

function filterInstagramContent(contents: IContentGeneration[]): IContentGeneration[] {
	return contents.filter((c) => {
		const ct = c.contentType?.toLowerCase() ?? "";
		return ct.includes("story") || ct.includes("post") || ct.includes("instagram");
	});
}

interface UseOnboardingContentReturn {
	isLoading: boolean;
	error: string | null;
	whatsappItems: SocialMediaCarouselItem[];
	instagramProposals: IContentProposal[];
	allContents: IContentGeneration[];
	refetch: () => Promise<void>;
}

export function useOnboardingContent(): UseOnboardingContentReturn {
	const {
		contents,
		isLoaded,
		error: storeError,
		setContents,
		setError,
	} = useOnboardingContentStore();

	const [isLoading, setIsLoading] = useState(!isLoaded);
	const pollingRef = useRef<number | null>(null);
	const attemptsRef = useRef(0);

	const fetchContent = useCallback(async () => {
		try {
			const response = await getContentGenerations(repository, {
				origins: ["auto_content_generation"],
				limit: 20,
			});

			if (response.data.length > 0) {
				setContents(response.data);
				setIsLoading(false);
				if (pollingRef.current) {
					window.clearInterval(pollingRef.current);
					pollingRef.current = null;
				}
				return true;
			}
			return false;
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Error al cargar contenido";
			setError(message);
			setIsLoading(false);
			if (pollingRef.current) {
				window.clearInterval(pollingRef.current);
				pollingRef.current = null;
			}
			return false;
		}
	}, [setContents, setError]);

	useEffect(() => {
		if (isLoaded && contents.length > 0) {
			setIsLoading(false);
			return;
		}

		let mounted = true;

		const startPolling = async () => {
			const hasContent = await fetchContent();
			if (hasContent || !mounted) return;

			attemptsRef.current = 0;
			pollingRef.current = window.setInterval(async () => {
				attemptsRef.current += 1;
				const found = await fetchContent();

				if (found || attemptsRef.current >= MAX_POLLING_ATTEMPTS) {
					if (pollingRef.current) {
						window.clearInterval(pollingRef.current);
						pollingRef.current = null;
					}
					if (!found && mounted) {
						setIsLoading(false);
					}
				}
			}, POLLING_INTERVAL_MS);
		};

		startPolling();

		return () => {
			mounted = false;
			if (pollingRef.current) {
				window.clearInterval(pollingRef.current);
				pollingRef.current = null;
			}
		};
	}, [isLoaded, contents.length, fetchContent]);

	const whatsappContents = filterWhatsAppContent(contents);
	const instagramContents = filterInstagramContent(contents);

	const whatsappItems = toCarouselItemsFromContentGenerations(whatsappContents);
	const instagramProposals = instagramContents.map(toContentProposal);

	const refetch = useCallback(async () => {
		setIsLoading(true);
		await fetchContent();
	}, [fetchContent]);

	return {
		isLoading,
		error: storeError,
		whatsappItems,
		instagramProposals,
		allContents: contents,
		refetch,
	};
}
