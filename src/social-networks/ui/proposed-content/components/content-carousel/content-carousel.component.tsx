import { Button, H3, IconComponent, P } from "@beweco/aurora-ui";
import { ContentPreviewModal } from "@shared/ui/components";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
	CarouselItem,
	ContentCarouselProps,
} from "./content-carousel.types";

// Inject CSS animations for microinteractions
const style = document.createElement("style");
style.textContent = `
  @keyframes pulse-subtle {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.95;
    }
  }
  
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateX(-5px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slide-bounce {
    0% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(4px);
    }
    100% {
      transform: translateX(0);
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
`;
if (
	typeof document !== "undefined" &&
	!document.head.querySelector("#carousel-animations")
) {
	style.id = "carousel-animations";
	document.head.appendChild(style);
}

export function ContentCarousel({
	items,
	onItemClick,
	onEdit,
	onDelete,
	onPublish,
	className = "",
	emptyStateRedirectPath = "/contenidos-ai/crear-contenido",
	emptyStateButtonText = "Crear contenido nuevo",
	compactHeader = false,
}: ContentCarouselProps) {
	const navigate = useNavigate();
	const [activeIndex, setActiveIndex] = useState(items.length >= 3 ? 1 : 0);

	// Preview modal states
	const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
	const [selectedItemForPreview, setSelectedItemForPreview] =
		useState<CarouselItem | null>(null);

	// Reset to show 3 images when items change
	useEffect(() => {
		setActiveIndex(items.length >= 3 ? 1 : 0);
	}, [items.length]);

	const handleNext = useCallback(() => {
		setActiveIndex((prev) => Math.min(prev + 1, items.length - 1));
	}, [items.length]);

	const handlePrev = useCallback(() => {
		setActiveIndex((prev) => Math.max(prev - 1, 0));
	}, []);

	// Get position of card relative to active index
	const getPosition = (index: number) => {
		if (index === activeIndex) return "center";
		if (index === activeIndex - 1) return "left";
		if (index === activeIndex + 1) return "right";
		return "hidden";
	};

	const handleItemClick = useCallback(
		(item: CarouselItem) => {
			if (onItemClick) {
				onItemClick(item);
			}
		},
		[onItemClick]
	);

	const handleEdit = useCallback(
		(item: CarouselItem) => {
			console.log("Editar:", item);
			if (onEdit) {
				onEdit(item);
			}
		},
		[onEdit]
	);

	const handleDelete = useCallback(
		(item: CarouselItem) => {
			console.log("Eliminar:", item);
			if (onDelete) {
				onDelete(item);
			}
		},
		[onDelete]
	);

	const handlePublish = useCallback(
		(item: CarouselItem) => {
			console.log("Publicar:", item);
			if (onPublish) {
				onPublish(item);
			}
		},
		[onPublish]
	);

	// Open preview modal handler
	const handleOpenPreview = useCallback((item: CarouselItem) => {
		setSelectedItemForPreview(item);
		setIsPreviewModalOpen(true);
	}, []);

	// Close preview modal handler
	const handleClosePreview = useCallback(() => {
		setIsPreviewModalOpen(false);
		setSelectedItemForPreview(null);
	}, []);

	// Empty state cuando no hay items
	if (items.length === 0) {
		return (
			<div
				className={`flex flex-col items-center justify-center py-16 px-6 gap-6 ${className}`}
			>
				<P>No hay más contenido propuesto</P>

				<Button
					color="primary"
					variant="solid"
					size="md"
					onPress={() => navigate(emptyStateRedirectPath)}
					startContent={<IconComponent icon="solar:add-circle-bold" />}
				>
					{emptyStateButtonText}
				</Button>
			</div>
		);
	}

	return (
		<div className={`relative w-full ${className}`}>
			{/* Carousel Container */}
			<div className="relative w-full pt-4 pb-8">
				{/* Carousel Cards - Center card with side cards */}
				<div className="relative h-[450px] flex items-center justify-center overflow-hidden">
					{/* Navigation Buttons */}
					{items.length > 1 && (
						<>
							<div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 ml-4">
								<Button
									isIconOnly
									variant="bordered"
									onPress={handlePrev}
									isDisabled={activeIndex === 0}
									className="rounded-full bg-white/95 backdrop-blur-md border-gray-200 shadow-xl hover:bg-white hover:border-gray-300 hover:scale-110 hover:-translate-x-1 disabled:opacity-20 disabled:hover:scale-100 disabled:hover:translate-x-0 transition-all duration-300 w-12 h-12"
									aria-label="Anterior"
								>
									<IconComponent
										icon="solar:alt-arrow-left-outline"
										className="w-6 h-6"
									/>
								</Button>
							</div>

							<div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 mr-4">
								<Button
									isIconOnly
									variant="bordered"
									onPress={handleNext}
									isDisabled={activeIndex === items.length - 1}
									className="rounded-full bg-white/95 backdrop-blur-md border-gray-200 shadow-xl hover:bg-white hover:border-gray-300 hover:scale-110 hover:translate-x-1 disabled:opacity-20 disabled:hover:scale-100 disabled:hover:translate-x-0 transition-all duration-300 w-12 h-12"
									aria-label="Siguiente"
								>
									<IconComponent
										icon="solar:alt-arrow-right-outline"
										className="w-6 h-6"
									/>
								</Button>
							</div>
						</>
					)}
					{items.map((item, index) => {
						const position = getPosition(index);
						if (position === "hidden") return null;

						return (
							<CarouselItemComponent
								key={item.id}
								item={item}
								position={position}
								onClick={() => handleItemClick(item)}
								onEdit={() => handleEdit(item)}
								onDelete={() => handleDelete(item)}
								onPublish={() => handlePublish(item)}
								onPreview={() => handleOpenPreview(item)}
								compactHeader={compactHeader}
							/>
						);
					})}
				</div>

				{/* Navigation Indicators */}
				{items.length > 1 && (
					<div className="flex justify-center mt-4">
						{/* Page Dots */}
						<div className="flex justify-center gap-2">
							{items.map((_, index) => (
								<button
									key={index}
									type="button"
									onClick={() => setActiveIndex(index)}
									className={`rounded-full transition-all duration-300 hover:scale-110 ${
										index === activeIndex
											? "w-8 h-2 bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg shadow-primary-500/50"
											: "w-2 h-2 bg-gray-300 hover:bg-gray-400 hover:w-3"
									}`}
									aria-label={`Ir al item ${index + 1}`}
								/>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Preview Modal */}
			{selectedItemForPreview && (
				<ContentPreviewModal
					isOpen={isPreviewModalOpen}
					onClose={handleClosePreview}
					platform="instagram"
					imageUrl={selectedItemForPreview.imageUrl || ""}
					caption={
						selectedItemForPreview.caption || selectedItemForPreview.title
					}
					title={selectedItemForPreview.title}
					variant={
						selectedItemForPreview.type === "instagram-story" ? "story" : "full"
					}
					showHeader={true}
				/>
			)}
		</div>
	);
}

interface CarouselItemComponentProps {
	item: CarouselItem;
	position: "center" | "left" | "right" | "hidden";
	onClick: () => void;
	onEdit: () => void;
	onDelete: () => void;
	onPublish: () => void;
	onPreview: () => void;
	compactHeader: boolean;
}

function CarouselItemComponent({
	item,
	position,
	onClick,
	onEdit,
	onDelete,
	onPublish,
	onPreview,
	compactHeader,
}: CarouselItemComponentProps) {
	const [isHovered, setIsHovered] = useState(false);
	const isStory = item.type === "instagram-story";
	const captionText = item.caption || item.title;

	// Get styles based on position
	const getPositionStyles = () => {
		const baseStyles = {
			minHeight: "400px",
			maxHeight: "400px",
			boxShadow:
				"0 10px 40px -5px rgba(255, 255, 255, 0.15), 0 8px 25px -8px rgba(255, 255, 255, 0.1)",
		};

		if (position === "center") {
			return {
				...baseStyles,
				width: "500px",
				transform: "scale(1)",
				opacity: 1,
				zIndex: 10,
			};
		}
		if (position === "left") {
			return {
				...baseStyles,
				width: "350px",
				transform: "translateX(-115%) scale(0.75)",
				opacity: 0.7,
				zIndex: 5,
			};
		}
		if (position === "right") {
			return {
				...baseStyles,
				width: "350px",
				transform: "translateX(115%) scale(0.75)",
				opacity: 0.7,
				zIndex: 5,
			};
		}
		return baseStyles;
	};

	return (
		<div
			className="absolute rounded-3xl shadow-lg transition-all duration-500 ease-in-out flex flex-col overflow-hidden"
			style={getPositionStyles()}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Background Image */}
			{item.imageUrl ? (
				<div
					className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ease-in-out ${
						isHovered ? "scale-110 blur-sm" : "scale-100 blur-0"
					}`}
					style={{
						backgroundImage: `url(${item.imageUrl})`,
					}}
				/>
			) : (
				<div
					className={`absolute inset-0 transition-all duration-500 ease-in-out ${
						isHovered ? "scale-110 blur-sm" : "scale-100 blur-0"
					}`}
					style={{
						background: item.gradient,
					}}
				/>
			)}

			{/* Dark overlay for better text readability - darkens on hover */}
			<div
				className={`absolute inset-0 bg-gradient-to-b transition-all duration-500 ease-in-out ${
					isHovered
						? "from-black/70 via-black/60 to-black/80"
						: "from-black/40 via-black/20 to-black/50"
				}`}
			/>

			{/* Action buttons overlay - Only show on hover */}
			<div
				className={`absolute bottom-4 right-4 z-20 flex items-center gap-2 transition-opacity duration-500 ease-in-out ${
					isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
			>
				<Button
					isIconOnly
					variant="flat"
					size="sm"
					onPress={onEdit}
					className="bg-white/90 hover:bg-white text-gray-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95"
					aria-label="Editar"
				>
					<IconComponent
						icon="solar:pen-outline"
						className="w-4 h-4 transition-transform duration-200 hover:rotate-12"
					/>
				</Button>
				<Button
					isIconOnly
					variant="flat"
					size="sm"
					onPress={onDelete}
					className="bg-white/90 hover:bg-white text-gray-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95"
					aria-label="Eliminar"
				>
					<IconComponent
						icon="solar:trash-bin-minimalistic-outline"
						className="w-4 h-4 transition-transform duration-200 hover:scale-110"
					/>
				</Button>
				<Button
					variant="solid"
					color="primary"
					size="sm"
					onPress={onPublish}
					endContent={
						<IconComponent
							icon="solar:plain-3-bold"
							className="w-3.5 h-3.5 transition-transform duration-200"
						/>
					}
					aria-label="Publicar"
					className="text-xs shadow-md transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
				>
					Publicar
				</Button>
			</div>

			{/* Social Network Tag - Bottom left */}
			<div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
				<div
					className="backdrop-blur-xl border border-white/30 rounded-full px-3 py-1.5 shadow-xl flex items-center gap-2"
					style={{
						background:
							"linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(200, 200, 255, 0.25) 100%)",
					}}
				>
					{item.type === "instagram-post" && (
						<>
							<IconComponent
								icon="mdi:instagram"
								className="w-4 h-4 text-pink-400"
							/>
							<span className="text-xs font-medium text-white">Instagram</span>
						</>
					)}
					{item.type === "instagram-story" && (
						<>
							<IconComponent
								icon="mdi:instagram"
								className="w-4 h-4 text-purple-400"
							/>
							<span className="text-xs font-medium text-white">Story</span>
						</>
					)}
					{item.type === "tiktok-video" && (
						<>
							<IconComponent
								icon="ic:baseline-tiktok"
								className="w-4 h-4 text-white"
							/>
							<span className="text-xs font-medium text-white">TikTok</span>
						</>
					)}
					{item.type === "whatsapp" && (
						<>
							<IconComponent
								icon="mdi:whatsapp"
								className="w-4 h-4 text-green-400"
							/>
							<span className="text-xs font-medium text-white">WhatsApp</span>
						</>
					)}
				</div>
				{/* Preview Button */}
				{item.imageUrl && (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onPreview();
						}}
						className="backdrop-blur-xl border border-white/30 rounded-lg w-8 h-8 shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-200"
						style={{
							background:
								"linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(200, 200, 255, 0.25) 100%)",
						}}
						aria-label="Ver vista previa"
					>
						<IconComponent
							icon="solar:eye-bold"
							className="w-4 h-4 text-white"
						/>
					</button>
				)}
			</div>

			{/* Card Content - Text overlay */}
			<button
				type="button"
				onClick={onClick}
				className="relative w-full h-full cursor-pointer flex flex-col justify-between p-6 z-10"
				aria-label={item.title}
			>
				{/* Title at top */}
				<div>
					<H3 className="text-white text-3xl font-semibold mb-2 text-left drop-shadow-lg">
						{item.title}
					</H3>
				</div>

				{/* Description at bottom */}
				<div className="space-y-3 overflow-hidden">
					<P
						className={`text-white text-sm text-left drop-shadow-md transition-all duration-500 ease-in-out ${
							!isHovered && "line-clamp-2"
						}`}
					>
						{captionText}
					</P>
				</div>
			</button>
		</div>
	);
}
