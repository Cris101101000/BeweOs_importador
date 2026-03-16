import {
	Card,
	CardBody,
	CardHeader,
	H3,
	IconComponent,
	P,
} from "@beweco/aurora-ui";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { LindaRecommendedActions } from "./linda-recommended-actions.component";

interface SummaryProps {
	client: IClient;
}

/**
 * Summary Component
 *
 * Displays a summary of the client's information including AI insights
 * and Linda's recommended actions
 */
export const Summary: FC<SummaryProps> = ({ client }) => {
	const { t } = useTranslate();

	// Filter tags that have descriptions (these are the AI insights)
	const clientTags =
		client.tags?.filter(
			(tag) => tag.description && tag.description.trim() !== ""
		) || [];

	// Add mock AI insights for demonstration
	const mockInsights = [
		{
			id: "mock-1",
			value: "Insight de Linda",
			description:
				"<strong>Me faltan detalles sobre este cliente</strong> que lleva más de 3 meses inactivo para generar mejores recomendaciones.",
		},
	];

	const aiInsights = [...mockInsights, ...clientTags];

	console.log("Client tags:", client.tags);
	console.log("AI Insights filtered:", aiInsights);

	return (
		<div className="flex flex-col gap-4">
			{/* AI Insights Card */}
			<Card radius="sm" className="border border-default-200">
				<CardHeader className="pb-2">
					<div className="flex items-center gap-2">
						<IconComponent
							icon="solar:stars-line-linear"
							className="text-primary"
							size={"md"}
						/>
						<H3 className="text-base font-semibold text-default-900">
							{t("ai_insights", "AI Insights")}
						</H3>
					</div>
				</CardHeader>
				<CardBody className="pt-2">
					{aiInsights.length > 0 ? (
						<div className="flex flex-col gap-3">
							{aiInsights.map((tag, index) => (
								<div key={tag.id || index} className="flex flex-col gap-1">
									<div className="flex items-start gap-2">
										<span className="text-sm font-medium text-default-700">
											{tag.value}:
										</span>
										<span
											className="text-sm text-default-600"
											dangerouslySetInnerHTML={{
												__html: tag.description ?? "",
											}}
										/>
									</div>
								</div>
							))}
						</div>
					) : (
						<P className="text-sm text-default-500">
							{t(
								"no_ai_insights_yet",
								"Linda aún no ha generado insights para este cliente."
							)}
						</P>
					)}
				</CardBody>
			</Card>

			{/* Linda Recommended Actions Card */}
			<LindaRecommendedActions client={client} />
		</div>
	);
};
