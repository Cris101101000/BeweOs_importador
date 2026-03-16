import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
	Slider,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { EnumCatalogType } from "../../../domain/enums/catalog-type.enum";
import {
	catalogCategoriesMock,
	catalogServicesMock,
} from "../../../infrastructure/mocks/catalog-response.mock";

interface ServiceFilterModalProps {
	isOpen: boolean;
	onClose: () => void;
	onApplyFilter: (
		categoryId: string | null,
		minPrice?: number | null,
		maxPrice?: number | null,
		status?: string | null
	) => void;
	currentCategoryId?: string | null;
	currentMinPrice?: number | null;
	currentMaxPrice?: number | null;
	currentStatus?: string | null;
}

const ServiceFilterModal: FC<ServiceFilterModalProps> = ({
	isOpen,
	onClose,
	onApplyFilter,
	currentCategoryId = null,
	currentMinPrice = null,
	currentMaxPrice = null,
	currentStatus = null,
}) => {
	const { t } = useTranslate();
	const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
		currentCategoryId || ""
	);
	const [selectedStatus, setSelectedStatus] = useState<string>(
		currentStatus || ""
	);

	// Obtener solo las categorías de servicios
	const serviceCategories = catalogCategoriesMock.filter(
		(category) => category.type === EnumCatalogType.Service
	);

	// Opciones de estado
	const statusOptions = [
		{ key: "active", label: t("catalog_status_active", "Activo") },
		{ key: "inactive", label: t("catalog_status_inactive", "Inactivo") },
	];

	// Calcular rango de precios de los servicios
	const servicePrices = catalogServicesMock.map((service) => service.price);
	const minPossiblePrice = Math.min(...servicePrices);
	const maxPossiblePrice = Math.max(...servicePrices);

	// Estado para el slider de rango de precios
	const [priceRange, setPriceRange] = useState<number[]>([
		currentMinPrice || minPossiblePrice,
		currentMaxPrice || maxPossiblePrice,
	]);

	// Sincronizar con los filtros actuales cuando cambien
	useEffect(() => {
		setSelectedCategoryId(currentCategoryId || "");
		setSelectedStatus(currentStatus || "");
		setPriceRange([
			currentMinPrice || minPossiblePrice,
			currentMaxPrice || maxPossiblePrice,
		]);
	}, [
		currentCategoryId,
		currentStatus,
		currentMinPrice,
		currentMaxPrice,
		minPossiblePrice,
		maxPossiblePrice,
	]);

	const handleApplyFilter = () => {
		const [minPriceValue, maxPriceValue] = priceRange;

		onApplyFilter(
			selectedCategoryId || null,
			minPriceValue === minPossiblePrice ? null : minPriceValue,
			maxPriceValue === maxPossiblePrice ? null : maxPriceValue,
			selectedStatus || null
		);
		onClose();
	};

	const handleClearFilter = () => {
		setSelectedCategoryId("");
		setSelectedStatus("");
		setPriceRange([minPossiblePrice, maxPossiblePrice]);
		onApplyFilter(null, null, null, null);
		onClose();
	};

	// Función para formatear precios
	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("es-CO", {
			style: "currency",
			currency: "COP",
			minimumFractionDigits: 0,
		}).format(price);
	};

	// Generar datos para el histograma
	const generateHistogram = () => {
		const bins = 20; // Número de barras en el histograma
		const binWidth = (maxPossiblePrice - minPossiblePrice) / bins;
		const histogram = new Array(bins).fill(0);

		// Contar servicios en cada rango de precio
		servicePrices.forEach((price) => {
			const binIndex = Math.min(
				Math.floor((price - minPossiblePrice) / binWidth),
				bins - 1
			);
			histogram[binIndex]++;
		});

		return histogram.map((count, index) => {
			const binStart = minPossiblePrice + index * binWidth;
			const binEnd = minPossiblePrice + (index + 1) * binWidth;
			const binMidPoint = (binStart + binEnd) / 2;

			// Calcular altura basada en el precio (a mayor precio, mayor altura)
			// Normalizar el precio medio del bin respecto al rango total
			const priceRatio =
				(binMidPoint - minPossiblePrice) /
				(maxPossiblePrice - minPossiblePrice);

			// La altura va de 20% (precio mínimo) a 100% (precio máximo)
			// Todas las barras mantienen altura visual, independiente de si tienen servicios
			const heightPercentage = Math.max(20, priceRatio * 80 + 20);

			return {
				height: heightPercentage,
				binStart,
				binEnd,
				count,
				priceRange: `${formatPrice(binStart)} - ${formatPrice(binEnd)}`,
				midPrice: binMidPoint,
			};
		});
	};

	const histogramData = generateHistogram();

	// Función para determinar si una barra está en el rango seleccionado
	const isBarInRange = (binStart: number, binEnd: number) => {
		const [selectedMin, selectedMax] = priceRange;
		return binEnd > selectedMin && binStart < selectedMax;
	};

	// Calcular estadísticas del rango seleccionado
	const getSelectedRangeStats = () => {
		const [selectedMin, selectedMax] = priceRange;
		const servicesInRange = catalogServicesMock.filter(
			(service) => service.price >= selectedMin && service.price <= selectedMax
		);

		return {
			count: servicesInRange.length,
			total: catalogServicesMock.length,
			percentage: Math.round(
				(servicesInRange.length / catalogServicesMock.length) * 100
			),
		};
	};

	const rangeStats = getSelectedRangeStats();

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="md" scrollBehavior="inside">
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<h2 className="text-xl font-semibold">
						{t("catalog_filters_title", "Filtros de Servicios")}
					</h2>
					<p className="text-sm text-default-500">
						{t(
							"catalog_filters_description",
							"Filtra los servicios por categoría y rango de precio"
						)}
					</p>
				</ModalHeader>

				<ModalBody className="gap-6">
					{/* Filtro por Categoría */}
					<div className="flex flex-col gap-2">
						<label className="text-sm font-medium text-default-700">
							{t("catalog_filter_category", "Categoría")}
						</label>
						<Select
							placeholder={t(
								"catalog_filter_category_placeholder",
								"Selecciona una categoría"
							)}
							selectedKeys={selectedCategoryId ? [selectedCategoryId] : []}
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0] as string;
								setSelectedCategoryId(selected || "");
							}}
							variant="bordered"
						>
							{serviceCategories.map((category) => (
								<SelectItem key={category.id} value={category.id}>
									{category.name}
								</SelectItem>
							))}
						</Select>
					</div>

					{/* Filtro por Estado */}
					<div className="flex flex-col gap-2">
						<label className="text-sm font-medium text-default-700">
							{t("catalog_filter_status", "Estado")}
						</label>
						<Select
							placeholder={t(
								"catalog_filter_status_placeholder",
								"Selecciona un estado"
							)}
							selectedKeys={selectedStatus ? [selectedStatus] : []}
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0] as string;
								setSelectedStatus(selected || "");
							}}
							variant="bordered"
						>
							{statusOptions.map((status) => (
								<SelectItem key={status.key} value={status.key}>
									{status.label}
								</SelectItem>
							))}
						</Select>
					</div>

					{/* Filtro por Rango de Precio */}
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-1">
							<label className="text-sm font-medium text-default-700">
								{t("catalog_filter_price_range", "Rango de precio")}
							</label>
							<p className="text-xs text-default-500">
								{t(
									"catalog_filter_price_description",
									"Precio del servicio (incluye todas las tarifas)"
								)}
							</p>
						</div>

						{/* Histograma Visual */}
						<div className="relative h-16 bg-default-50 rounded-lg p-2">
							<div className="flex items-end h-full" style={{ gap: "1px" }}>
								{histogramData.map((bar, index) => {
									const inRange = isBarInRange(bar.binStart, bar.binEnd);

									return (
										<div
											key={index}
											className={`flex-1 rounded-t-sm transition-all duration-200 group relative ${
												inRange ? "bg-primary-400" : "bg-default-300"
											}`}
											style={{
												height: `${bar.height}%`,
												alignSelf: "flex-end",
												opacity: inRange ? 1 : 0.4,
											}}
										title={bar.priceRange}
									>
										{/* Tooltip hover */}
										<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-default-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
											<div className="text-center">
												<div className="font-medium">
													{formatPrice(bar.midPrice)}
												</div>
											</div>
										</div>
										</div>
									);
								})}
							</div>
						</div>

						{/* Slider de Rango */}
						<div className="px-2">
							<Slider
								size="sm"
								step={10000}
								minValue={minPossiblePrice}
								maxValue={maxPossiblePrice}
								value={priceRange}
								onChange={setPriceRange}
								className="w-full"
								classNames={{
									track: "border-s-primary-100",
									filler: "bg-primary-400",
								}}
							/>
						</div>

						{/* Valores Mínimo y Máximo */}
						<div className="flex justify-between items-center text-sm">
							<div className="flex flex-col items-start">
								<span className="text-xs text-default-500">
									{t("catalog_filter_min_price", "Mínimo")}
								</span>
								<span className="font-medium text-default-700">
									{formatPrice(priceRange[0])}
								</span>
							</div>
							<div className="flex flex-col items-end">
								<span className="text-xs text-default-500">
									{t("catalog_filter_max_price", "Máximo")}
								</span>
								<span className="font-medium text-default-700">
									{formatPrice(priceRange[1])}
								</span>
							</div>
						</div>
					</div>
				</ModalBody>

				<ModalFooter>
					<Button variant="light" onPress={handleClearFilter}>
						{t("catalog_filters_clear", "Limpiar filtro")}
					</Button>
					<Button variant="bordered" onPress={onClose}>
						{t("catalog_filters_cancel", "Cancelar")}
					</Button>
					<Button color="primary" onPress={handleApplyFilter}>
						{t("catalog_filters_apply", "Aplicar filtro")}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default ServiceFilterModal;
