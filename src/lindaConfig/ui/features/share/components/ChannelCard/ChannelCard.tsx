import { Button, Card, Chip, IconComponent } from "@beweco/aurora-ui";
import type React from "react";
import type { ChannelCardProps } from "./ChannelCard.types";

export const ChannelCard: React.FC<ChannelCardProps> = ({
	title,
	icon,
	iconBgColor,
	iconActiveColor,
	isIntegrated,
	isActive,
	accountInfo,
	onShare,
	onIntegrate,
}) => {
	const handlePress = () => {
		if (isIntegrated) {
			onShare();
		} else {
			onIntegrate();
		}
	};

	return (
		<Card
			className="p-4 h-full transition-all duration-200 border-2 cursor-pointer hover:shadow-lg border-transparent hover:border-primary-300 relative"
			isPressable
			onPress={handlePress}
		>
			<div className="flex flex-col items-center text-center space-y-3 h-full justify-center">
				{/* Badges de estado - Parte superior */}
				<div className="w-full flex justify-end gap-2 absolute top-4 right-4">
					<Chip
						size="sm"
						variant="flat"
						color={isIntegrated ? "success" : "warning"}
						className="h-5"
					>
						{isIntegrated ? "Integrado" : "No integrado"}
					</Chip>
					{isIntegrated && (
						<Chip
							size="sm"
							variant="flat"
							color={isActive ? "primary" : "warning"}
							className="h-5"
						>
							{isActive ? "Activo" : "Inactivo"}
						</Chip>
					)}
				</div>

				{/* Icono circular */}
				<div
					className={`w-12 h-12 rounded-full ${
						isIntegrated ? iconBgColor : "bg-gray-200"
					} flex items-center justify-center`}
				>
					<IconComponent
						icon={icon}
						className={`w-6 h-6 ${
							isIntegrated ? iconActiveColor : "text-gray-400"
						}`}
					/>
				</div>

				{/* Título y cuenta */}
				<div>
					<h3 className="text-lg font-semibold text-gray-900">{title}</h3>
					{isIntegrated && accountInfo && (
						<p className="text-xs text-gray-500 mt-1">{accountInfo}</p>
					)}
				</div>

				{/* Botón de acción */}
				<div className="flex justify-center">
					<Button
						color="primary"
						variant="light"
						size="sm"
						onPress={handlePress}
					>
						{isIntegrated ? "Compartir" : "Integrar"}
					</Button>
				</div>
			</div>
		</Card>
	);
};
