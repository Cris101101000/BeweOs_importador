import { useEffect, useRef } from "react";
import { IconComponent } from "@beweco/aurora-ui";
import type { ILogEntry } from "@clients/domain/interfaces/import-contact.interface";
import { EnumLogEntryType } from "@clients/domain/interfaces/import-contact.interface";

interface ImportProgressLogProps {
	entries: ILogEntry[];
}

const LOG_ICON_MAP: Record<string, { icon: string; color: string }> = {
	[EnumLogEntryType.SUCCESS]: {
		icon: "solar:check-circle-outline",
		color: "text-success",
	},
	[EnumLogEntryType.ERROR]: {
		icon: "solar:close-circle-outline",
		color: "text-danger",
	},
	[EnumLogEntryType.LOADING]: {
		icon: "solar:refresh-circle-outline",
		color: "text-primary",
	},
	[EnumLogEntryType.INFO]: {
		icon: "solar:info-circle-outline",
		color: "text-default-400",
	},
};

/**
 * Formatea timestamp a HH:mm:ss
 */
const formatTimestamp = (date: Date): string => {
	return date.toLocaleTimeString("es", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
};

/**
 * ImportProgressLog
 *
 * Lista scrollable de entradas de log con auto-scroll al último elemento.
 * Cada entrada muestra timestamp, icono según tipo y mensaje.
 */
export const ImportProgressLog = ({ entries }: ImportProgressLogProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [entries.length]);

	return (
		<div
			ref={containerRef}
			className="max-h-64 overflow-y-auto rounded-lg border border-default-200 bg-default-50 p-3 dark:border-default-100 dark:bg-default-50/5"
		>
			{entries.length === 0 ? (
				<p className="text-center text-sm text-default-400">
					Sin entradas de log
				</p>
			) : (
				<div className="flex flex-col gap-1">
					{entries.map((entry, index) => {
						const config = LOG_ICON_MAP[entry.type] || LOG_ICON_MAP[EnumLogEntryType.INFO];
						return (
							<div
								key={`${entry.type}-${index}`}
								className="flex items-start gap-2 py-1"
							>
								<span className="shrink-0 font-mono text-xs text-default-400">
									{formatTimestamp(entry.timestamp)}
								</span>
								<IconComponent
									icon={config.icon}
									className={`shrink-0 ${config.color}`}
									size="sm"
								/>
								<span
									className={`text-sm ${
										entry.type === EnumLogEntryType.ERROR
											? "text-danger"
											: "text-default-700 dark:text-default-300"
									}`}
								>
									{entry.message}
								</span>
							</div>
						);
					})}
					<div ref={bottomRef} />
				</div>
			)}
		</div>
	);
};
