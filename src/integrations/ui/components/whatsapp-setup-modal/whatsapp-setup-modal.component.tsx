import { Card, CardBody } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";

interface WhatsAppSetupModalProps {
	isOpen: boolean;
	onClose: () => void;
}

interface WhatsAppSetupStep {
	id: string;
	title: string;
	videoId: string;
	icon: JSX.Element;
}

const WhatsAppSetupModal: FC<WhatsAppSetupModalProps> = ({
	isOpen,
	onClose,
}) => {
	const { t } = useTranslate();
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [expandedVideo, setExpandedVideo] = useState<string | null>(null);
	const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
	const modalRef = useRef<HTMLDivElement>(null);

	const steps: WhatsAppSetupStep[] = [
		{
			id: "verify-profile",
			title: t(
				"whatsapp_verify_profile",
				"Verifica el perfil que quieres vincular"
			),
			videoId: "dQw4w9WgXcQ",
			icon: (
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<circle cx="12" cy="12" r="10" strokeWidth={2} />
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 12l2 2 4-4"
					/>
				</svg>
			),
		},
		{
			id: "complete-company",
			title: t(
				"whatsapp_complete_company",
				"Completa la información de tu empresa"
			),
			videoId: "dQw4w9WgXcQ",
			icon: (
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<rect
						x="3"
						y="3"
						width="18"
						height="18"
						rx="2"
						ry="2"
						strokeWidth={2}
					/>
					<rect x="7" y="7" width="3" height="3" strokeWidth={2} />
					<rect x="14" y="7" width="3" height="3" strokeWidth={2} />
					<rect x="7" y="14" width="3" height="3" strokeWidth={2} />
					<rect x="14" y="14" width="3" height="3" strokeWidth={2} />
				</svg>
			),
		},
		{
			id: "create-account",
			title: t(
				"whatsapp_create_account",
				"Crea o selecciona tu cuenta de WhatsApp Business"
			),
			videoId: "dQw4w9WgXcQ",
			icon: (
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<circle cx="12" cy="12" r="10" strokeWidth={2} />
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 8v8m-4-4h8"
					/>
				</svg>
			),
		},
		{
			id: "create-profile",
			title: t(
				"whatsapp_create_profile",
				"Crea un perfil de WhatsApp Business"
			),
			videoId: "dQw4w9WgXcQ",
			icon: (
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
						d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
					/>
				</svg>
			),
		},
		{
			id: "add-phone",
			title: t(
				"whatsapp_add_phone",
				"Agrega tu número de teléfono de WhatsApp"
			),
			videoId: "dQw4w9WgXcQ",
			icon: (
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
						d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
					/>
				</svg>
			),
		},
		{
			id: "verify-phone",
			title: t("whatsapp_verify_phone", "Verifica tu número de teléfono"),
			videoId: "dQw4w9WgXcQ",
			icon: (
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
						d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
					/>
				</svg>
			),
		},
	];

	const stepsWithCompletion = steps.map((step) => ({
		...step,
		completed: completedSteps.has(step.id),
	}));

	const completedCount = completedSteps.size;
	const totalSteps = steps.length;
	const progressPercentage = (completedCount / totalSteps) * 100;

	const getProgressEmoji = (percentage: number): string => {
		if (percentage === 100) return "🎉";
		if (percentage >= 80) return "🚀";
		if (percentage >= 60) return "💪";
		if (percentage >= 40) return "👍";
		if (percentage >= 20) return "😊";
		return "🌟";
	};

	const getProgressMessage = (percentage: number): string => {
		if (percentage === 100)
			return t(
				"whatsapp_all_set",
				"¡Todo listo! Has completado la configuración"
			);
		if (percentage >= 80)
			return t(
				"whatsapp_almost_there",
				"¡Casi terminamos! Solo faltan algunos pasos"
			);
		if (percentage >= 60)
			return t("whatsapp_great_progress", "¡Excelente progreso! Vas muy bien");
		if (percentage >= 40)
			return t("whatsapp_halfway", "¡Vas por la mitad! Sigue así");
		if (percentage >= 20)
			return t("whatsapp_good_start", "¡Buen comienzo! Continúa paso a paso");
		return t(
			"whatsapp_lets_start",
			"¡Empecemos! Completa cada paso para configurar WhatsApp"
		);
	};

	const toggleVideo = (stepId: string) => {
		setExpandedVideo(expandedVideo === stepId ? null : stepId);
	};

	const canCompleteStep = (stepIndex: number): boolean => {
		// El primer paso siempre se puede completar
		if (stepIndex === 0) return true;

		// Para los demás pasos, verificar que todos los anteriores estén completados
		for (let i = 0; i < stepIndex; i++) {
			if (!completedSteps.has(steps[i].id)) {
				return false;
			}
		}
		return true;
	};

	const toggleStepCompletion = (stepId: string, stepIndex: number) => {
		const newCompletedSteps = new Set(completedSteps);

		if (completedSteps.has(stepId)) {
			// Si se desmarca un paso, desmarcar también todos los posteriores
			newCompletedSteps.delete(stepId);
			for (let i = stepIndex + 1; i < steps.length; i++) {
				newCompletedSteps.delete(steps[i].id);
			}
		} else {
			// Solo permitir marcar si se puede completar
			if (canCompleteStep(stepIndex)) {
				newCompletedSteps.add(stepId);
			}
		}

		setCompletedSteps(newCompletedSteps);
	};

	// Posicionar el modal completamente visible al abrir
	useEffect(() => {
		if (isOpen) {
			// Usar timeout para asegurar que el modal esté completamente renderizado
			const positionModal = () => {
				if (modalRef.current) {
					// Obtener dimensiones reales del modal
					const modalRect = modalRef.current.getBoundingClientRect();
					const modalWidth = modalRect.width || 500; // usar ancho real o fallback
					const modalHeight = modalRect.height || 700; // usar alto real o fallback
					const margin = 20; // margen desde los bordes

					// Posicionar hacia la derecha pero asegurar que esté completamente visible
					const rightX = window.innerWidth - modalWidth - margin; // Posición derecha
					const centerY = (window.innerHeight - modalHeight) / 2; // Centrado verticalmente

					// Ajustar si se sale de los bordes
					const x = Math.max(
						margin,
						Math.min(rightX, window.innerWidth - modalWidth - margin)
					);
					const y = Math.max(
						margin,
						Math.min(centerY, window.innerHeight - modalHeight - margin)
					);

					setPosition({ x, y });
				}
			};

			// Posicionar inmediatamente y después de un pequeño delay para asegurar renderizado completo
			positionModal();
			const timeoutId = setTimeout(positionModal, 10);

			return () => clearTimeout(timeoutId);
		}
	}, [isOpen]);

	// Eventos de arrastre
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!isDragging) return;

			const newX = e.clientX - dragStart.x;
			const newY = e.clientY - dragStart.y;

			// Constrain to viewport
			const modalWidth = modalRef.current?.offsetWidth || 500;
			const modalHeight = modalRef.current?.offsetHeight || 600;
			const margin = 10;

			const constrainedX = Math.max(
				margin,
				Math.min(window.innerWidth - modalWidth - margin, newX)
			);
			const constrainedY = Math.max(
				margin,
				Math.min(window.innerHeight - modalHeight - margin, newY)
			);

			setPosition({ x: constrainedX, y: constrainedY });
		};

		const handleMouseUp = () => {
			setIsDragging(false);
		};

		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging, dragStart]);

	const handleMouseDown = (e: React.MouseEvent) => {
		if (modalRef.current) {
			const rect = modalRef.current.getBoundingClientRect();
			setDragStart({
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			});
			setIsDragging(true);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 pointer-events-none">
			<Card
				ref={modalRef}
				className="absolute w-[500px] pointer-events-auto shadow-2xl"
				style={{
					left: `${position.x}px`,
					top: `${position.y}px`,
				}}
			>
				{/* Header - Draggable */}
				<div
					className="flex items-center justify-between p-3 bg-white hover:bg-default-25 cursor-grab active:cursor-grabbing transition-colors group"
					onMouseDown={handleMouseDown}
				>
					<div className="flex items-center gap-3">
						{/* Drag indicator - grip pattern */}
						<div className="flex flex-col gap-0.5 opacity-60 group-hover:opacity-80 transition-opacity">
							<div className="flex gap-0.5">
								<div className="w-1 h-1 bg-default-400 rounded-full"></div>
								<div className="w-1 h-1 bg-default-400 rounded-full"></div>
								<div className="w-1 h-1 bg-default-400 rounded-full"></div>
							</div>
							<div className="flex gap-0.5">
								<div className="w-1 h-1 bg-default-400 rounded-full"></div>
								<div className="w-1 h-1 bg-default-400 rounded-full"></div>
								<div className="w-1 h-1 bg-default-400 rounded-full"></div>
							</div>
						</div>
						<span className="text-xs text-default-500 opacity-60 group-hover:opacity-80 transition-opacity">
							{t("drag_modal", "Mover ventana")}
						</span>
					</div>

					<button
						onClick={onClose}
						className="p-1 hover:bg-default-100 rounded-md transition-colors"
					>
						<svg
							className="w-3.5 h-3.5"
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
				</div>

				{/* Title, Description and Progress Section */}
				<div className="bg-gradient-to-br from-white via-blue-100/60 via-purple-100/50 to-indigo-100/40 border border-gray-200/50 mx-4 mt-2 p-4 rounded-xl shadow-sm">
					<div className="text-left mb-4">
						<h2 className="text-lg font-semibold text-default-800 mb-1">
							{t("whatsapp_setup_title", "Configurar WhatsApp Business")}
						</h2>
						<p className="text-sm text-default-600">
							{t(
								"whatsapp_setup_subtitle",
								"Sigue estos pasos para conectar tu cuenta de WhatsApp Business y empezar a comunicarte con tus clientes."
							)}
						</p>
					</div>

					{/* Progress Bar */}
					<div className="mt-6 pt-4 pb-3 px-3 bg-white/50 border border-purple-200/30 rounded-lg shadow-sm">
						<div className="flex items-center gap-3 mb-2">
							<span className="text-xl animate-bounce">
								{getProgressEmoji(progressPercentage)}
							</span>
							<div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
								<div
									className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-700 ease-out"
									style={{ width: `${progressPercentage}%` }}
								></div>
							</div>
							<span className="text-sm font-bold text-white bg-purple-600 px-2 py-1 rounded-full text-xs">
								{completedCount}/{totalSteps}
							</span>
						</div>
						<span className="text-sm font-medium text-default-700">
							{getProgressMessage(progressPercentage)}
						</span>
					</div>
				</div>

				<CardBody className="flex-1 min-h-0 px-4 pb-2 mt-4 h-[500px]">
					{/* Steps List */}
					<div
						className="h-full overflow-y-auto space-y-2 pr-2"
						style={{ maxHeight: "256px" }}
					>
						{stepsWithCompletion.map((step, index) => {
							const canComplete = canCompleteStep(index);
							const isBlocked = !canComplete && !step.completed;

							return (
								<div
									key={step.id}
									className={`p-4 border rounded-lg transition-all ${
										step.completed
											? "bg-success-50 border-success-200"
											: isBlocked
												? "bg-default-50 border-default-200 opacity-50"
												: "bg-white border-default-200 hover:border-primary-200"
									}`}
								>
									{/* Fixed Header Row */}
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3 flex-1">
											<div
												className={`flex-shrink-0 p-2 rounded-lg ${
													step.completed
														? "bg-success-100 text-success-600"
														: "bg-primary-100 text-primary-600"
												}`}
											>
												{step.icon}
											</div>
											<div className="flex-1 min-w-0">
												<h3
													className={`font-medium text-sm transition-all ${
														step.completed
															? "line-through text-default-500"
															: "text-default-800"
													}`}
												>
													{step.title}
												</h3>

												{/* Video Button */}
												<button
													onClick={() => toggleVideo(step.id)}
													className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-default-50 hover:bg-primary-50 border border-default-200 hover:border-primary-200 rounded-lg transition-colors text-xs font-medium text-default-700 hover:text-primary-700"
												>
													<svg
														className="w-3 h-3"
														fill="currentColor"
														viewBox="0 0 24 24"
													>
														<path d="M8 5v14l11-7z" />
													</svg>
													{t("watch_tutorial", "Ver tutorial")}
												</button>
											</div>
										</div>

										{/* Status Icon - Interactive - Fixed Position */}
										<button
											onClick={() => toggleStepCompletion(step.id, index)}
											disabled={isBlocked}
											className={`flex-shrink-0 w-6 h-6 rounded-full border-2 border-dashed flex items-center justify-center transition-all group ${
												step.completed
													? "bg-success-100 border-success-300 group-hover:bg-success-200"
													: isBlocked
														? "bg-default-50 border-default-300 opacity-50 cursor-not-allowed"
														: "bg-default-100 border-default-300 hover:bg-success-100 hover:border-success-300 cursor-pointer"
											}`}
											title={
												isBlocked
													? t(
															"complete_previous_steps",
															"Completa los pasos anteriores primero"
														)
													: step.completed
														? t("mark_incomplete", "Marcar como incompleto")
														: t("mark_complete", "Marcar como completado")
											}
										>
											{step.completed ? (
												<svg
													className="w-3 h-3 text-success-600"
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
											) : isBlocked ? (
												<svg
													className="w-3 h-3 text-default-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
													/>
												</svg>
											) : (
												<div className="w-2 h-2 bg-default-400 rounded-full group-hover:bg-success-500 transition-colors"></div>
											)}
										</button>
									</div>

									{/* Expandable Video Section - Outside the header flex */}
									{expandedVideo === step.id && (
										<div className="mt-4 p-4 bg-default-50 rounded-lg border-l-4 border-primary-500 shadow-lg">
											<div className="flex items-center justify-between mb-2">
												<div className="flex items-center gap-2">
													<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
													<span className="text-sm font-medium text-default-700">
														{t("video_tutorial", "Tutorial en video")}
													</span>
												</div>
												<button
													onClick={() => toggleVideo(step.id)}
													className="flex items-center gap-1 px-2 py-1 text-xs text-default-600 hover:text-default-800 hover:bg-default-100 rounded transition-colors"
												>
													<svg
														className="w-3 h-3"
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
													{t("close_video", "Cerrar video")}
												</button>
											</div>
											<div className="aspect-video bg-default-100 rounded-lg overflow-hidden">
												<iframe
													src={`https://www.youtube.com/embed/${step.videoId}`}
													title={step.title}
													className="w-full h-full"
													frameBorder="0"
													allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
													allowFullScreen
												/>
											</div>
										</div>
									)}
								</div>
							);
						})}
					</div>
				</CardBody>

				{/* Footer */}
				<div className="flex-shrink-0 p-4 border-t border-default-100">
					<button className="w-full px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg transition-colors text-sm font-medium">
						{t("whatsapp_view_guide", "Abrir en una nueva ventana")}
					</button>
				</div>
			</Card>

			<style>{`
				@keyframes shimmer {
					0% { transform: translateX(-100%); }
					100% { transform: translateX(100%); }
				}
				.animate-shimmer {
					animation: shimmer 2s infinite;
				}
			`}</style>
		</div>
	);
};

export default WhatsAppSetupModal;
