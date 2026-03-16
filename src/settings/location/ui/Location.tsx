import type { IAddress } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import type React from "react";
import { LocationForm } from "./components/location-form.component";

/**
 * Main component for the location settings page.
 * Renders a single form for physical address and Google Maps URL.
 *
 * @returns The rendered location page.
 */
const Location: React.FC<{
	location: IAddress | undefined;
	onDataUpdated?: () => void;
}> = ({ location, onDataUpdated }) => {
	return (
		<div className="pt-1 w-full">
			<LocationForm location={location} onDataUpdated={onDataUpdated} />
		</div>
	);
};

export default Location;
