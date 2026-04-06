import { useEffect, useRef } from "react";
import { IconComponent } from "@beweco/aurora-ui";
import type { ILogEntry } from "@clients/domain/interfaces/import-contact.interface";
import { EnumLogEntryType } from "@clients/domain/interfaces/import-contact.interface";

interface ImportProgressLogProps {
	entries: ILogEntry[];
}

/**
 * ImportProgressLog
 *
 * Stepper vertical con 3 estados:
 * - Completado: check verde
 * - En progreso: punto azul pulsante
 * - Pendiente: círculo vacío gris (entradas futuras no se muestran aquí, se definen fuera)
 */
export const ImportProgressLog = ({ entries }: ImportProgressLogProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [entries.length]);

	if (entries.length === 0) return null;

	return (
		<div
			ref={containerRef}
			className="max-h-72 overflow-y-auto"
		>
			<div className="flex flex-col">
				{entries.map((entry, index) => {
					const isLast = index === entries.length - 1;
					const isCompleted = entry.type === EnumLogEntryType.SUCCESS;
					const isError = entry.type === EnumLogEntryType.ERROR;
					const isActive = isLast && entry.type === EnumLogEntryType.LOADING;

					return (
						<div
							key={`step-${index}`}
							className="flex items-start gap-3"
						>
							{/* Línea + indicador */}
							<div className="flex flex-col items-center">
								{/* Indicador de estado */}
								{isCompleted ? (
									<div className="flex items-center justify-center w-6 h-6 rounded-full bg-success-100 dark:bg-success-900/30">
										<IconComponent
											icon="solar:check-circle-bold"
											size="sm"
											className="text-success"
										/>
									</div>
								) : isError ? (
									<div className="flex items-center justify-center w-6 h-6 rounded-full bg-danger-100 dark:bg-danger-900/30">
										<IconComponent
											icon="solar:close-circle-bold"
											size="sm"
											className="text-danger"
										/>
									</div>
								) : isActive ? (
									<div className="flex items-center justify-center w-6 h-6">
										<div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
									</div>
								) : (
									<div className="flex items-center justify-center w-6 h-6">
										<IconComponent
											icon="solar:check-circle-outline"
											size="sm"
											className="text-success-400"
										/>
									</div>
								)}

								{/* Línea conectora */}
								{!isLast && (
									<div className={`w-px h-6 ${
										isCompleted || (!isActive && !isError)
											? "bg-success-200 dark:bg-success-800/30"
											: isError
												? "bg-danger-200 dark:bg-danger-800/30"
												: "bg-default-200 dark:bg-default-100"
									}`} />
								)}
							</div>

							{/* Contenido */}
							<div className={`pb-4 ${isLast ? "pb-0" : ""}`}>
								<p className={`text-sm ${
									isError
										? "text-danger"
										: isActive
											? "text-default-700 dark:text-default-400 font-medium"
											: "text-default-500 dark:text-default-400"
								}`}>
									{entry.message}
								</p>
							</div>
						</div>
					);
				})}
				<div ref={bottomRef} />
			</div>
		</div>
	);
};
