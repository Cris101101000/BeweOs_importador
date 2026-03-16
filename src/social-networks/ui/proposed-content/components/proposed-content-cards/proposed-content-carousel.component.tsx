import { Button, IconComponent } from "@beweco/aurora-ui";
import { type FC, useState } from "react";
import { ProposedContentCardItem } from "./proposed-content-card-item.component";
import type { ProposedContentItem } from "./proposed-content-cards.component";

export interface ProposedContentCarouselProps {
	items: ProposedContentItem[];
	onApprove: (id: string) => void;
	onDiscard: (id: string) => void;
	onPreview: (id: string) => void;
	isLoading?: boolean;
}

export const ProposedContentCarousel: FC<ProposedContentCarouselProps> = ({
	items,
	onApprove,
	onDiscard,
	onPreview,
	isLoading = false,
}) => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isHovered, setIsHovered] = useState(false);

	if (items.length === 0) {
		return null;
	}

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % items.length);
	};

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + items.length) % items.length);
	};

	const goToSlide = (index: number) => {
		setCurrentSlide(index);
	};

	return (
		<div
			className="relative w-full"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Carousel Container with External Navigation */}
			<div className="flex items-center gap-3">
				{/* Previous Button - External */}
				{items.length > 1 && (
					<div
						className={`transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
					>
						<Button
							isIconOnly
							size="sm"
							variant="flat"
							color="primary"
							className="flex-shrink-0 bg-primary-50 hover:bg-primary-100 shadow-sm hover:shadow transition-all duration-200"
							onPress={prevSlide}
							aria-label="Anterior"
						>
							<IconComponent
								icon="solar:alt-arrow-left-bold"
								className="w-4 h-4 text-primary-600"
							/>
						</Button>
					</div>
				)}

				{/* Slides Container */}
				<div className="flex-1 overflow-hidden rounded-lg">
					<div
						className="flex transition-transform duration-500 ease-in-out"
						style={{ transform: `translateX(-${currentSlide * 100}%)` }}
					>
						{items.map((item) => (
							<div key={item.id} className="min-w-full">
								<ProposedContentCardItem
									item={item}
									onApprove={() => onApprove(item.id)}
									onDiscard={() => onDiscard(item.id)}
									onPreview={() => onPreview(item.id)}
									isLoading={isLoading}
								/>
							</div>
						))}
					</div>
				</div>

				{/* Next Button - External */}
				{items.length > 1 && (
					<div
						className={`transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
					>
						<Button
							isIconOnly
							size="sm"
							variant="flat"
							color="primary"
							className="flex-shrink-0 bg-primary-50 hover:bg-primary-100 shadow-sm hover:shadow transition-all duration-200"
							onPress={nextSlide}
							aria-label="Siguiente"
						>
							<IconComponent
								icon="solar:alt-arrow-right-bold"
								className="w-4 h-4 text-primary-600"
							/>
						</Button>
					</div>
				)}
			</div>

			{/* Dots Indicator */}
			{items.length > 1 && (
				<div className="flex justify-center items-center gap-2 mt-4">
					{items.map((_, index) => (
						<button
							key={index}
							type="button"
							onClick={() => goToSlide(index)}
							className={`transition-all duration-300 rounded-full ${
								index === currentSlide
									? "w-8 h-2 bg-primary-500"
									: "w-2 h-2 bg-gray-300 hover:bg-gray-400"
							}`}
							aria-label={`Ir al slide ${index + 1}`}
						/>
					))}
				</div>
			)}

			{/* Counter */}
			{items.length > 1 && (
				<div className="text-center mt-2">
					<span className="text-xs text-gray-500">
						{currentSlide + 1} de {items.length}
					</span>
				</div>
			)}
		</div>
	);
};
