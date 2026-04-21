import { IconComponent } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import { type FC, useCallback, useEffect, useRef, useState } from "react";
import "./ai-analyzing-overlay.css";

const AI_STEP_KEYS = [
	"import_upload_ai_reading",
	"import_upload_ai_detecting",
	"import_upload_ai_extracting",
	"import_upload_ai_organizing",
] as const;

const PROGRESS_STOPS = [22, 48, 74, 96];
const STEP_INTERVAL = 2500;

export const AIAnalyzingOverlay: FC = () => {
	const { t } = useTranslate();
	const [activeIndex, setActiveIndex] = useState(0);
	const [exitingIndex, setExitingIndex] = useState<number | null>(null);
	const [progress, setProgress] = useState(0);
	const timerRef = useRef<ReturnType<typeof setInterval>>(null);

	const advance = useCallback(() => {
		setActiveIndex((prev) => {
			const next = (prev + 1) % AI_STEP_KEYS.length;
			setExitingIndex(prev);
			setTimeout(() => {
				setExitingIndex(null);
			}, 180);
			setProgress(PROGRESS_STOPS[next]);
			return next;
		});
	}, []);

	useEffect(() => {
		requestAnimationFrame(() => {
			setProgress(PROGRESS_STOPS[0]);
		});
		timerRef.current = setInterval(advance, STEP_INTERVAL);
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [advance]);

	return (
		<div className="ai-stage">
			{/* Orbe */}
			<div className="ai-orb-wrap">
				<div className="ai-ping" />
				<div className="ai-ping ai-ping--d2" />
				<div className="ai-halo" />
				<div className="ai-orb" />
				<div className="ai-orb-icon">
					<IconComponent
						icon="solar:users-group-rounded-bold"
						className="text-white drop-shadow-md"
						style={{ fontSize: "30px" }}
					/>
				</div>
			</div>

			{/* Mensajes rotativos */}
			<div className="ai-message-wrap">
				{AI_STEP_KEYS.map((key, i) => {
					const isActive = i === activeIndex && i !== exitingIndex;
					const isExiting = i === exitingIndex;
					const className = [
						"ai-message",
						isActive ? "ai-message--active" : "",
						isExiting ? "ai-message--exiting" : "",
					].filter(Boolean).join(" ");

					return (
						<div key={key} className={className}>
							{t(key)}
						</div>
					);
				})}
			</div>

			{/* Barra de progreso */}
			<div className="ai-progress">
				<div
					className="ai-progress__fill"
					style={{ width: `${progress}%` }}
				/>
			</div>

			{/* Contador de pasos */}
			<div className="ai-step-count">
				<strong>{activeIndex + 1}</strong> de {AI_STEP_KEYS.length} · Linda {t("import_upload_ai_working")}
			</div>
		</div>
	);
};
