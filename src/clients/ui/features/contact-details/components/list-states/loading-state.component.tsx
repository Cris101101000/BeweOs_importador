import { Spinner } from "@beweco/aurora-ui";
import type { FC } from "react";
import { memo } from "react";

export const LoadingState: FC = memo(() => (
	<div className="flex justify-center py-8">
		<Spinner size="md" />
	</div>
));
