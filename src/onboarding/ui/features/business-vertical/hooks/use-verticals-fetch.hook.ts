import { useEffect, useState } from "react";
import { GetVerticals } from "../DependencyInjection";

export const useVerticalsFetch = () => {
	const [verticals, setVerticals] = useState<string[]>([]);
	const [isFetching, setIsFetching] = useState(true);

	useEffect(() => {
		let cancelled = false;

		const loadVerticals = async () => {
			setIsFetching(true);

			const result = await GetVerticals();
			if (cancelled) return;

			if (result.isSuccess && result.value) {
				setVerticals(result.value);
			}

			setIsFetching(false);
		};

		loadVerticals();

		return () => {
			cancelled = true;
		};
	}, []);

	return { verticals, isFetching };
};
