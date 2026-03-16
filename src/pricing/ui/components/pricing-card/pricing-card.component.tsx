import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Chip,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import type {
	IPricingFrequency,
	IPricingPlan,
} from "../../../domain/interfaces/pricing.interface";

interface PricingCardProps {
	plan: IPricingPlan;
	selectedFrequency: IPricingFrequency;
	onSelectPlan: (planId: string) => void;
}

const PricingCard: FC<PricingCardProps> = ({
	plan,
	selectedFrequency,
	onSelectPlan,
}) => {
	const { t } = useTranslate();

	const getPrice = () => {
		if (typeof plan.price === "string") {
			return plan.price;
		}
		return plan.price[selectedFrequency.key] || plan.price.monthly;
	};

	const getPriceSuffix = () => {
		if (typeof plan.price === "string") {
			return plan.priceSuffix;
		}
		return plan.priceSuffix
			? `/${plan.priceSuffix}/${selectedFrequency.priceSuffix}`
			: `/${selectedFrequency.priceSuffix}`;
	};

	const getCardClasses = () => {
		if (plan.mostPopular) {
			return "relative h-full border-2 border-primary-400 bg-gradient-to-b from-primary-50/30 to-background shadow-xl transform scale-105 z-10";
		}
		return "relative h-full border border-default-200 bg-background shadow-sm";
	};

	const getTagColor = () => {
		if (plan.mostPopular) return "primary";
		if (plan.key === "free") return "success";
		if (plan.key === "enterprise") return "warning";
		return "default";
	};

	const getButtonColor = () => {
		if (plan.mostPopular) return "primary";
		if (plan.key === "free") return "default";
		return "default";
	};

	const getButtonVariant = () => {
		if (plan.mostPopular) return "solid";
		if (plan.key === "free") return "bordered";
		return "bordered";
	};

	return (
		<Card className={getCardClasses()}>
			{/* Popular Tag */}
			{plan.tag && (
				<Chip
					className="absolute top-4 right-4 z-20 font-medium"
					color={getTagColor()}
					variant="solid"
					size="sm"
				>
					{plan.tag}
				</Chip>
			)}

			{/* Header */}
			<CardHeader className="flex flex-col items-start gap-3 pb-4 pt-8 px-6">
				<h3 className="text-2xl font-bold text-default-900">{plan.title}</h3>
				<p className="text-sm text-default-600 leading-relaxed">
					{plan.description}
				</p>
			</CardHeader>

			{/* Body */}
			<CardBody className="flex-1 py-0 px-6">
				{/* Price */}
				<div className="mb-8">
					<div className="flex items-baseline gap-1 mb-2">
						<span className="text-2xl font-bold text-default-900 leading-none">
							{getPrice()}
						</span>
						{typeof plan.price !== "string" && (
							<span className="text-sm text-default-500 ml-1 self-end mb-2">
								{getPriceSuffix()}
							</span>
						)}
					</div>
				</div>

				{/* Features */}
				<ul className="space-y-4 mb-8">
					{plan.features.map((feature) => (
						<li key={feature} className="flex items-start gap-3">
							<div className="flex-shrink-0 w-5 h-5 mt-0.5">
								<svg
									className="w-5 h-5 text-success-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Incluido</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2.5}
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
							<span className="text-sm text-default-700 leading-relaxed">
								{feature}
							</span>
						</li>
					))}
				</ul>
			</CardBody>

			{/* Footer */}
			<CardFooter className="pt-0 pb-8 px-6">
				<Button
					fullWidth
					color={getButtonColor()}
					variant={getButtonVariant()}
					size="lg"
					className={`font-semibold ${
						plan.mostPopular
							? "bg-primary-600 text-white hover:bg-primary-700 border-0"
							: plan.key === "free"
								? "bg-default-100 text-default-700 border-default-300"
								: "text-primary-600 border-primary-200 hover:bg-primary-50"
					}`}
					onClick={() => onSelectPlan(plan.id)}
				>
					{plan.buttonText}
				</Button>
			</CardFooter>
		</Card>
	);
};

export default PricingCard;
