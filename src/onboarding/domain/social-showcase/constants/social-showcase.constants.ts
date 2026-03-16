import type { IContentProposal } from "../interfaces/social-showcase.interface";

export const PROPOSALS: IContentProposal[] = [
	{
		id: "story-1",
		type: "story",
		title: "Story: Quinceaneras",
		description:
			"Celebra tus 15 anos con un evento inolvidable. #quinceanera #15anos",
		imageUrl:
			"https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
		lindaSpeech: "Prepare este Story para tus clientes.",
	},
	{
		id: "post-1",
		type: "post",
		title: "Post: Bodas de ensueno",
		description:
			"Convierte tu dia especial en un momento inolvidable. #bodas #wedding",
		imageUrl:
			"https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=800&q=80",
		lindaSpeech: "Y este Post para tu feed.",
	},
];
