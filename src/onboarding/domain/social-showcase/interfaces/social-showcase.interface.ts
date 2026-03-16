export interface IContentProposal {
	id: string;
	type: "story" | "post";
	title: string;
	description: string;
	imageUrl: string;
	lindaSpeech: string;
}
