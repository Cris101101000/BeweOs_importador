import type { FC, ReactNode } from "react";
import { createContext, useContext, useState } from "react";

interface CategoryDropdownContextType {
	isAnyDropdownOpen: boolean;
	setDropdownOpen: (isOpen: boolean) => void;
	isUnitDropdownOpen: boolean;
	setUnitDropdownOpen: (isOpen: boolean) => void;
}

const CategoryDropdownContext = createContext<
	CategoryDropdownContextType | undefined
>(undefined);

export const useCategoryDropdownContext = () => {
	const context = useContext(CategoryDropdownContext);
	if (!context) {
		throw new Error(
			"useCategoryDropdownContext must be used within CategoryDropdownProvider"
		);
	}
	return context;
};

interface CategoryDropdownProviderProps {
	children: ReactNode;
}

export const CategoryDropdownProvider: FC<CategoryDropdownProviderProps> = ({
	children,
}) => {
	const [isAnyDropdownOpen, setIsAnyDropdownOpen] = useState(false);
	const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);

	const setDropdownOpen = (isOpen: boolean) => {
		setIsAnyDropdownOpen(isOpen);
	};

	const setUnitDropdownOpen = (isOpen: boolean) => {
		setIsUnitDropdownOpen(isOpen);
	};

	// Update isAnyDropdownOpen when either dropdown state changes
	const anyDropdownOpen = isAnyDropdownOpen || isUnitDropdownOpen;

	return (
		<CategoryDropdownContext.Provider
			value={{
				isAnyDropdownOpen: anyDropdownOpen,
				setDropdownOpen,
				isUnitDropdownOpen,
				setUnitDropdownOpen,
			}}
		>
			{children}
		</CategoryDropdownContext.Provider>
	);
};
