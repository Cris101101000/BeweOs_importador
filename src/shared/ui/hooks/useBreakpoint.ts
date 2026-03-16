import { useElementWidth } from "./useElementWidth";

const breakpoints = {
	xs: "320px",
	sm: "640px",
	md: "768px",
	lg: "1024px",
	xl: "1280px",
	"2xl": "1536px",
};

type BreakpointKey = keyof typeof breakpoints;

export const useBreakpoint = (breakpointKey: BreakpointKey): boolean => {
	const width = useElementWidth();
	const breakpointValue = Number.parseInt(
		breakpoints[breakpointKey].replace("px", ""),
		10
	);

	return width >= breakpointValue;
};
