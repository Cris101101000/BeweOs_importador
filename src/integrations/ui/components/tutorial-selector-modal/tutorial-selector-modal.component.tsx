import { Button, Card, CardBody, CardHeader } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { useState } from "react";

// Función para obtener el icono SVG según el tipo de tutorial
const getTutorialIcon = (tutorialId: string) => {
	switch (tutorialId) {
		case "whatsapp_setup":
			return (
				<div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-xl">
					<svg
						className="w-6 h-6 text-green-600"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<title>WhatsApp</title>
						<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.063" />
					</svg>
				</div>
			);
		case "instagram_setup":
			return (
				<div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
					<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
						<title>Instagram</title>
						<defs>
							<linearGradient
								id="instagram-gradient-tutorial"
								x1="0%"
								y1="0%"
								x2="100%"
								y2="100%"
							>
								<stop offset="0%" stopColor="#833ab4" />
								<stop offset="50%" stopColor="#fd1d1d" />
								<stop offset="100%" stopColor="#fcb045" />
							</linearGradient>
						</defs>
						<path
							d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
							fill="url(#instagram-gradient-tutorial)"
						/>
					</svg>
				</div>
			);
		case "facebook_pages":
			return (
				<div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl">
					<svg
						className="w-6 h-6 text-blue-600"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<title>Facebook</title>
						<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
					</svg>
				</div>
			);
		case "telegram_business":
			return (
				<div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl">
					<svg
						className="w-6 h-6 text-blue-500"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<title>Telegram</title>
						<path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
					</svg>
				</div>
			);
		default:
			return (
				<div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-xl">
					<svg
						className="w-6 h-6 text-gray-500"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
					>
						<title>Tutorial</title>
						<circle cx="12" cy="12" r="3" />
						<path d="M12 1v6m0 8v6m11-7h-6m-8 0H1" />
					</svg>
				</div>
			);
	}
};

interface TutorialOption {
	id: string;
	title: string;
	description: string;
	icon: string;
	category: string;
	estimatedTime: string;
}

interface TutorialSelectorModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSelectTutorial: (tutorialId: string) => void;
	availableTutorials: TutorialOption[];
}

const TutorialSelectorModal: FC<TutorialSelectorModalProps> = ({
	isOpen,
	onClose,
	onSelectTutorial,
	availableTutorials = [],
}) => {
	const { t } = useTranslate();
	const [selectedTutorial, setSelectedTutorial] = useState<string | null>(null);

	const handleContinue = () => {
		if (selectedTutorial) {
			onSelectTutorial(selectedTutorial);
			onClose();
		}
	};

	const groupedTutorials = availableTutorials.reduce(
		(groups, tutorial) => {
			const category = tutorial.category;
			if (!groups[category]) {
				groups[category] = [];
			}
			groups[category].push(tutorial);
			return groups;
		},
		{} as Record<string, TutorialOption[]>
	);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
			<Card className="w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
				<CardHeader className="flex justify-between items-center pb-4">
					<div>
						<h2 className="text-xl font-semibold text-gray-900">
							{t("select_tutorial", "Selecciona un Tutorial")}
						</h2>
						<p className="text-sm text-gray-600 mt-1">
							{t(
								"select_tutorial_description",
								"Elige el tutorial que mejor se adapte a lo que necesitas aprender"
							)}
						</p>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</CardHeader>

				<CardBody className="space-y-6 max-h-[60vh] overflow-y-auto">
					{Object.entries(groupedTutorials).map(([category, tutorials]) => (
						<div key={category} className="space-y-3">
							<h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
								{category}
							</h3>
							<div className="grid gap-3">
								{tutorials.map((tutorial) => (
									<div
										key={tutorial.id}
										className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
											selectedTutorial === tutorial.id
												? "border-blue-500 bg-blue-50 shadow-md"
												: "border-gray-200 hover:border-blue-300 hover:bg-blue-25"
										}`}
										onClick={() => setSelectedTutorial(tutorial.id)}
									>
										<div className="flex items-center gap-4">
											{getTutorialIcon(tutorial.id)}
											<div className="flex-1 min-w-0">
												<div className="flex items-center justify-between">
													<div className="flex-1">
														<h4 className="font-semibold text-gray-900">
															{tutorial.title}
														</h4>
													</div>
													<div
														className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
															selectedTutorial === tutorial.id
																? "border-blue-500 bg-blue-500"
																: "border-gray-300"
														}`}
													>
														{selectedTutorial === tutorial.id && (
															<svg
																className="w-3 h-3 text-white"
																fill="none"
																stroke="currentColor"
																viewBox="0 0 24 24"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={2}
																	d="M5 13l4 4L19 7"
																/>
															</svg>
														)}
													</div>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</CardBody>

				<div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
					<Button
						color="default"
						variant="light"
						onClick={onClose}
						className="flex-1"
					>
						{t("cancel", "Cancelar")}
					</Button>
					<Button
						color="primary"
						variant="solid"
						onClick={handleContinue}
						disabled={!selectedTutorial}
						className="flex-1"
					>
						{t("continue_tutorial", "Continuar con Tutorial")}
					</Button>
				</div>
			</Card>
		</div>
	);
};

export default TutorialSelectorModal;
