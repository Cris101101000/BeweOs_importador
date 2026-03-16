import { Button, Card, CardBody, CardHeader, Slider } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC, ReactNode } from "react";
import { useState } from "react";

interface AddOnCardProps {
	title: string;
	description: string;
	baseQuantity: number;
	maxQuantity: number;
	recurringPrice: string;
	flexiblePrice: string;
	unit: string;
	icon?: ReactNode;
}

const AddOnCard: FC<AddOnCardProps> = ({
	title,
	description,
	baseQuantity,
	maxQuantity,
	recurringPrice,
	flexiblePrice,
	unit,
	icon,
}) => {
	const { t } = useTranslate();
	const [quantity, setQuantity] = useState(baseQuantity);

	return (
		<Card className="border-1 border-default-200 shadow-sm">
			{/* Header */}
			<CardHeader className="flex flex-row items-center gap-3 pb-4">
				{icon && (
					<div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg">
						{icon}
					</div>
				)}
				<div className="flex-1">
					<h3 className="text-lg font-semibold text-default-900">{title}</h3>
					<p className="text-sm text-default-600">{description}</p>
				</div>
			</CardHeader>

			{/* Body */}
			<CardBody className="space-y-6">
				{/* Quantity Selector */}
				<div>
					<div className="flex justify-between items-center mb-3">
						<span className="text-sm font-medium text-default-700">
							Cantidad
						</span>
						<span className="text-lg font-bold text-primary-600">
							{quantity} {unit}
						</span>
					</div>
					<Slider
						size="sm"
						step={10}
						minValue={0}
						maxValue={maxQuantity}
						value={quantity}
						onChange={(value) =>
							setQuantity(Array.isArray(value) ? value[0] : value)
						}
						className="max-w-md"
					/>
					<div className="flex justify-between text-xs text-default-500 mt-1">
						<span>0</span>
						<span>{maxQuantity}</span>
					</div>
				</div>

				{/* Pricing Options */}
				<div className="space-y-3">
					{/* Recurring Option */}
					<div className="flex justify-between items-center p-3 bg-success-50 rounded-lg border border-success-200">
						<div>
							<p className="font-medium text-success-800">Opción Recurrente</p>
							<p className="text-sm text-success-600">Precio mensual</p>
							<p className="text-xs text-success-600">
								Se renueva automáticamente cada mes
							</p>
						</div>
						<div className="text-right">
							<p className="text-lg font-bold text-success-700">
								{recurringPrice}
							</p>
							<Button
								size="sm"
								color="success"
								variant="solid"
								className="mt-2"
							>
								Añadir Recurrente
							</Button>
						</div>
					</div>

					{/* Flexible Option */}
					<div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg border border-primary-200">
						<div>
							<p className="font-medium text-primary-800">Opción Flexible</p>
							<p className="text-sm text-primary-600">Pago único</p>
							<p className="text-xs text-primary-600">
								No caduca, úsalo cuando necesites
							</p>
						</div>
						<div className="text-right">
							<p className="text-lg font-bold text-primary-700">
								{flexiblePrice}
							</p>
							<Button
								size="sm"
								color="primary"
								variant="bordered"
								className="mt-2"
							>
								Comprar Flexible
							</Button>
						</div>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default AddOnCard;
