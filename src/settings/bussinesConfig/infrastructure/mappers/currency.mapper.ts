import type { ICurrency } from "@shared/domain/interfaces/currency.interface";

export const mapToCurrency = (currencyCode: string): ICurrency => {
	// a futuro esto deberia venir de un catalogo de monedas
	const currencyCatalog: Record<string, { name: string; symbol: string }> = {
		usd: { name: "US Dollar", symbol: "$" },
		eur: { name: "Euro", symbol: "€" },
		cop: { name: "Colombian Peso", symbol: "$" },
	};

	const currency = currencyCatalog[currencyCode];

	return {
		code: currencyCode,
		name: currency?.name ?? "",
		symbol: currency?.symbol ?? "",
	};
};
