import {
	type FC,
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useState,
} from "react";

type StepValidities = { [key: number]: boolean };

interface WizardValidationContextType {
	stepValidities: StepValidities;
	updateStepValidity: (stepIndex: number, isValid: boolean) => void;
	resetValidities: () => void;
}

const WizardValidationContext = createContext<
	WizardValidationContextType | undefined
>(undefined);

interface WizardValidationProviderProps {
	children: ReactNode;
}

export const WizardValidationProvider: FC<WizardValidationProviderProps> = ({
	children,
}) => {
	const [stepValidities, setStepValidities] = useState<StepValidities>({});

	const updateStepValidity = useCallback(
		(stepIndex: number, isValid: boolean) => {
			setStepValidities((prev) => {
				const newValidities = { ...prev };
				newValidities[stepIndex] = isValid;
				return newValidities;
			});
		},
		[]
	);

	const resetValidities = useCallback(() => {
		setStepValidities({});
	}, []);

	const value: WizardValidationContextType = {
		stepValidities,
		updateStepValidity,
		resetValidities,
	};

	return (
		<WizardValidationContext.Provider value={value}>
			{children}
		</WizardValidationContext.Provider>
	);
};

export const useWizardValidation = (): WizardValidationContextType => {
	const context = useContext(WizardValidationContext);
	if (!context) {
		throw new Error(
			"useWizardValidation must be used within a WizardValidationProvider"
		);
	}
	return context;
};
