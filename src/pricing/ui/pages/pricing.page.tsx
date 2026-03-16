import { Chip, H1, P, Tab, Tabs } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { useState } from "react";
import { FrequencyEnum } from "../../domain/interfaces/pricing.interface";
import {
	addOns,
	pricingConfig,
} from "../../infrastructure/mocks/pricing-plans.mock";
import AddOnCard from "../components/addon-card/addon-card.component";
import PricingCard from "../components/pricing-card/pricing-card.component";

const PricingPage: FC = () => {
	const { t } = useTranslate();
	const [selectedFrequency, setSelectedFrequency] = useState(
		pricingConfig.frequencies[0]
	);

	const onFrequencyChange = (selectedKey: string | number) => {
		const frequency = pricingConfig.frequencies.find(
			(f) => f.key === selectedKey
		);
		if (frequency) {
			setSelectedFrequency(frequency);
		}
	};

	const handleSelectPlan = (planId: string) => {
		// TODO: Implementar navegación a registro con plan seleccionado
		console.log("Selected plan:", planId);
	};

	return (
		<div className="relative flex max-w-6xl mx-auto flex-col items-center py-16">
			{/* Background Decoration */}
			<div
				aria-hidden="true"
				className="absolute inset-x-0 top-3 z-0 h-full w-full transform-gpu overflow-hidden blur-3xl opacity-30"
			>
				<div
					className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-primary-400 to-secondary-400"
					style={{
						clipPath:
							"polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
					}}
				/>
			</div>

			{/* Header Section */}
			<div className="relative z-10 flex max-w-2xl flex-col text-center mb-12">
				<p className="text-primary-600 font-medium mb-2">
					{t("pricing_section_label", "Pricing")}
				</p>
				<H1 className="text-4xl font-bold tracking-tight mb-4">
					{t("pricing_title", pricingConfig.title)}
				</H1>
				<P className="text-lg text-default-600">
					{t("pricing_subtitle", pricingConfig.subtitle)}
				</P>
			</div>

			{/* Frequency Selector */}
			<div className="relative z-10 mb-12">
				<Tabs
					selectedKey={selectedFrequency.key}
					onSelectionChange={onFrequencyChange}
					variant="bordered"
					radius="full"
					classNames={{
						tabList: "bg-default-100/80 backdrop-blur-sm",
						cursor: "bg-background shadow-sm",
						tab: "data-[hover-unselected=true]:opacity-90",
					}}
				>
					{pricingConfig.frequencies.map((frequency) => (
						<Tab
							key={frequency.key}
							title={
								<div className="flex items-center gap-2">
									<span>{frequency.label}</span>
									{frequency.discount && (
										<Chip color="secondary" variant="flat" size="sm">
											{frequency.discount}
										</Chip>
									)}
								</div>
							}
						/>
					))}
				</Tabs>
			</div>

			{/* Pricing Plans Grid */}
			<div className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16 max-w-7xl mx-auto pt-8 px-4">
				{pricingConfig.plans.map((plan) => (
					<div key={plan.id} className="flex">
						<PricingCard
							plan={plan}
							selectedFrequency={selectedFrequency}
							onSelectPlan={handleSelectPlan}
						/>
					</div>
				))}
			</div>

			{/* Add-ons Section */}
			<div className="relative z-10 w-full max-w-4xl">
				<div className="text-center mb-8">
					<H1 className="text-2xl font-bold mb-2">
						{t("pricing_addons_title", "Add-ons Configurables")}
					</H1>
					<P className="text-default-600">
						{t(
							"pricing_addons_subtitle",
							"Amplía tu capacidad según tus necesidades exactas"
						)}
					</P>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
					{addOns.map((addon) => (
						<AddOnCard
							key={addon.id}
							title={addon.title}
							description={addon.description}
							baseQuantity={addon.baseQuantity}
							maxQuantity={addon.maxQuantity}
							recurringPrice={addon.recurringPrice}
							flexiblePrice={addon.flexiblePrice}
							unit={addon.unit}
							icon={
								addon.id === "conversations" ? (
									<svg
										className="w-6 h-6 text-primary-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<title>Conversaciones</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
										/>
									</svg>
								) : (
									<svg
										className="w-6 h-6 text-primary-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<title>Notificaciones</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 17h5l-5 5v-5zM4 19h6l6-6H4v6zM20 4v6l-6 6h-6l6-6V4h6z"
										/>
									</svg>
								)
							}
						/>
					))}
				</div>
			</div>

			{/* Footer */}
			{pricingConfig.footerText && pricingConfig.footerLink && (
				<div className="relative z-10 text-center">
					<P className="text-default-500">
						{pricingConfig.footerText}{" "}
						<a
							href={pricingConfig.footerLink.href}
							className="text-primary-600 hover:text-primary-700 underline"
						>
							{pricingConfig.footerLink.text}
						</a>
					</P>
				</div>
			)}
		</div>
	);
};

export default PricingPage;
