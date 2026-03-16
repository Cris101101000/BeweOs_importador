import { Card, Select, SelectItem } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type React from "react";

const currencies = [
	{ key: "usd", label: "Dólar Estadounidense (USD)" },
	{ key: "eur", label: "Euro (EUR)" },
	{ key: "mxn", label: "Peso Mexicano (MXN)" },
	{ key: "cop", label: "Peso Colombiano (COP)" },
	{ key: "pen", label: "Sol Peruano (PEN)" },
];

interface CurrencyManagerProps {
	selectedCurrency: string;
	onCurrencyChange: (currency: string) => void;
}

export const CurrencyManager: React.FC<CurrencyManagerProps> = ({
	selectedCurrency,
	onCurrencyChange,
}) => {
	const { t } = useTranslate();

	return (
		<Card className="p-5 w-full gap-4">
			<div>
				<h2 className="font-medium text-lg">
					{t("settings_business_currency_title")}
				</h2>
				<p className="text-default-500 text-sm">
					{t("settings_business_currency_description")}
				</p>
			</div>

			<Select
				label={t("settings_business_currency_label")}
				placeholder={t("settings_business_currency_placeholder")}
				selectedKeys={[selectedCurrency]}
				onSelectionChange={(keys) => {
					const selectedKey = Array.from(keys)[0] as string;
					onCurrencyChange(selectedKey || "");
				}}
				variant="flat"
				isDisabled
			>
				{currencies.map((currency) => (
					<SelectItem key={currency.key}>{t(currency.label)}</SelectItem>
				))}
			</Select>
		</Card>
	);
};
