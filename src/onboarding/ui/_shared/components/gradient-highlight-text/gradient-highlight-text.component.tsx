import type { ReactNode } from "react";

const GRADIENT_HIGHLIGHT_BASE_CLASS =
	"text-primary-600 font-serif italic font-normal";

interface GradientHighlightTextProps {
	children: ReactNode;
	className?: string;
}

export const GradientHighlightText = ({
	children,
	className = "",
}: GradientHighlightTextProps) => {
	return (
		<span className={`${GRADIENT_HIGHLIGHT_BASE_CLASS} ${className}`.trim()}>
			{children}
		</span>
	);
};
