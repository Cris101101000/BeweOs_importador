/**
 * Format Step (Step 1)
 * Allows user to select the content format (Post or Story)
 */

import { H3, H4, P, Button, IconComponent } from "@beweco/aurora-ui";
import { StepContainer } from "@shared/ui/components/StepContainer";

interface ContentType {
	id: string;
	name: string;
	description: string;
	icon: string;
	aspectRatio: string;
	color: string;
}

interface FormatStepProps {
	selectedContentType: string;
	onContentTypeSelect: (typeId: string) => void;
	onNext: () => void;
}

const contentTypes: ContentType[] = [
	{
		id: "instagram-post",
		name: "Post",
		description: "Imagen cuadrada para el feed principal",
		icon: "solar:gallery-bold",
		aspectRatio: "1:1",
		color: "from-primary-500 to-primary-600",
	},
	{
		id: "instagram-story",
		name: "Story",
		description: "Formato vertical para historias",
		icon: "solar:video-frame-bold",
		aspectRatio: "9:16",
		color: "from-orange-500 to-red-500",
	},
];

export function FormatStep({
	selectedContentType,
	onContentTypeSelect,
	onNext,
}: FormatStepProps) {
	const handleSelect = (typeId: string) => {
		onContentTypeSelect(typeId);
		onNext();
	};

	return (
		<StepContainer
			header={
				<div className="text-center">
					<H3>Selecciona el formato</H3>
					<P className="text-center mt-2">
						Elige el tipo de contenido que deseas crear
					</P>
				</div>
			}
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{contentTypes.map((type) => (
					<Button
						key={type.id}
						onPress={() => handleSelect(type.id)}
						variant={selectedContentType === type.id ? "flat" : "bordered"}
						color={selectedContentType === type.id ? "primary" : "default"}
						className="p-4 h-auto"
					>
						<div className="flex flex-col items-center gap-2">
							<div
								className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r ${type.color}`}
							>
								<IconComponent
									icon="solar:gallery-bold"
									className="text-white text-[24px]"
								/>
							</div>
							<H4>{type.name}</H4>
						</div>
					</Button>
				))}
			</div>
		</StepContainer>
	);
}
