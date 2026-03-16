import { Select, SelectItem } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { useCallback, useMemo } from "react";
import type { EnumCatalogType } from "../../../domain/enums/catalog-type.enum";
import type { ICatalogCategory } from "../../../domain/interfaces/catalog-category.interface";
import { mapApiCategoriesToCatalogCategories } from "../../../infrastructure/mappers/category-enums.mapper";
import { catalogCategoriesMock } from "../../../infrastructure/mocks/catalog-response.mock";
import { useCatalogEnums } from "../../hooks/use-catalog-enums.hook";

export interface CategorySelectorProps {
	value?: string;
	onChange: (categoryId: string) => void;
	onCreateCategory?: (
		categoryName: string,
		type: EnumCatalogType
	) => Promise<string>;
	type: EnumCatalogType;
	categories?: ICatalogCategory[]; // Optional custom categories
	label?: string;
	placeholder?: string;
	isRequired?: boolean;
	isInvalid?: boolean;
	errorMessage?: string;
}

export const CategorySelector: FC<CategorySelectorProps> = ({
	value,
	onChange,
	type,
	categories: customCategories,
	label,
	placeholder,
	isRequired = false,
	isInvalid = false,
	errorMessage,
}) => {
	const { t } = useTranslate();

	// Get catalog enums from API
	const {
		categories: apiCategories,
		isLoading: isLoadingEnums,
		error: enumsError,
	} = useCatalogEnums();

	// Get categories for the specific type
	const categories = useMemo(() => {
		if (customCategories) {
			return customCategories;
		}

		// If we have API categories, use them
		if (apiCategories.length > 0) {
			return mapApiCategoriesToCatalogCategories(apiCategories, type, t);
		}

		// Always fallback to mock data to ensure categories are available
		const mockCategories = catalogCategoriesMock.filter(
			(category) => category.type === type
		);

		return mockCategories;
	}, [type, customCategories, apiCategories, t, isLoadingEnums, enumsError]);

	// Use all categories (Select handles filtering internally)
	const filteredCategories = categories;

	const handleSelectionChange = useCallback(
		(keys: any) => {
			const selectedKey = Array.from(keys)[0] as string;
			if (selectedKey && selectedKey !== "create-category") {
				onChange(selectedKey);
			}
		},
		[onChange]
	);

	// Note: Create category functionality would need to be handled differently
	// as Select doesn't support custom search. This is a simplified version.

	return (
		<Select
			label={label}
			placeholder={placeholder || t("select_category", "Seleccionar categoría")}
			selectedKeys={value ? [value] : []}
			onSelectionChange={handleSelectionChange}
			isRequired={isRequired}
			isInvalid={isInvalid}
			errorMessage={errorMessage}
			isDisabled={isLoadingEnums}
			selectionMode="single"
			classNames={{
				trigger: "z-10",
				popoverContent: "z-[9999]",
			}}
		>
			{filteredCategories.map((category) => (
				<SelectItem key={category.id} textValue={category.name}>
					{category.name}
				</SelectItem>
			))}
		</Select>
	);
};

export default CategorySelector;
