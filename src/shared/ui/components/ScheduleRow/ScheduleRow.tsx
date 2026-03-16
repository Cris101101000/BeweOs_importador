import { ScheduleRow } from "@beweco/aurora-ui";
import type {
	DaySchedule as AuroraDaySchedule,
	ScheduleRowTranslations as AuroraScheduleRowTranslations,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";

/**
 * Representa un intervalo de tiempo con horas de inicio y fin
 */
export interface TimeSlot {
	/** Hora de inicio en formato HH:MM (ej: "09:00") */
	from: string;
	/** Hora de fin en formato HH:MM (ej: "17:00") */
	to: string;
	/** Mensaje de error cuando la validación falla (opcional) */
	error?: string;
}

/**
 * Configuración del horario para un día específico
 */
export interface DaySchedule {
	/** Indica si el día está abierto o cerrado */
	isOpen: boolean;
	/**
	 * Lista de intervalos de tiempo para el día
	 * - Mínimo: 1 slot (puede estar vacío)
	 * - Máximo: 2 slots llenos (restricción del backend para horarios de configuración)
	 * - Siempre incluye un slot vacío al final para facilitar agregar nuevos horarios
	 * - Cuando hay 2 slots llenos, el botón + del slot vacío se deshabilita automáticamente
	 */
	timeSlots: TimeSlot[];
}

/**
 * Traducciones personalizables para el componente
 */
export interface ScheduleRowTranslations {
	/** Etiqueta para la hora de inicio */
	from?: string;
	/** Etiqueta para la hora de fin */
	to?: string;
	/** Texto para el estado "Abierto" */
	open?: string;
	/** Texto para el estado "Cerrado" */
	closed?: string;
	/** Texto del botón "Copiar a todos" */
	copyToAll?: string;
	/** Texto del botón "Agregar horario" */
	addTimeSlot?: string;
	/** Mensaje de error cuando from > to */
	errorFromAfterTo?: string;
	/** Etiqueta ARIA para el switch de abrir/cerrar */
	toggleOpenAriaLabel?: string;
	/** Etiqueta ARIA para el botón de copiar a todos */
	copyToAllAriaLabel?: string;
	/** Etiqueta ARIA para el botón de agregar intervalo */
	addTimeSlotAriaLabel?: string;
	/** Etiqueta ARIA para el botón de eliminar intervalo */
	removeTimeSlotAriaLabel?: string;
}

/**
 * Props del componente ScheduleRowComponent
 */
export interface ScheduleRowComponentProps {
	/** Nombre del día de la semana a mostrar */
	day: string;
	/** Configuración del horario para este día */
	daySchedule: DaySchedule;
	/** Callback ejecutado cuando el horario cambia */
	onChange: (schedule: DaySchedule) => void;
	/** Callback ejecutado cuando se presiona "Copiar a todos" */
	onCopyToAll?: (day: string) => void;
	/** Traducciones personalizadas */
	translations?: ScheduleRowTranslations;
}

/**
 * Claves de traducción por defecto para el sistema i18n
 * Estas claves se buscarán primero en el sistema de traducciones
 */
const defaultTranslationKeys = {
	from: "schedule_from",
	to: "schedule_to",
	open: "schedule_open",
	closed: "schedule_closed",
	copyToAll: "button_copy_to_all",
	addTimeSlot: "schedule_add_time_slot",
	errorFromAfterTo: "schedule_error_from_after_to",
	toggleOpenAriaLabel: "schedule_aria_toggle_open",
	copyToAllAriaLabel: "schedule_aria_copy_to_all",
	addTimeSlotAriaLabel: "schedule_aria_add_time_slot",
	removeTimeSlotAriaLabel: "schedule_aria_remove_time_slot",
};

/**
 * Valores por defecto para cuando no hay traducciones disponibles
 */
const fallbackTranslations: Required<ScheduleRowTranslations> = {
	from: "Desde",
	to: "Hasta",
	open: "Abierto",
	closed: "Cerrado",
	copyToAll: "Copiar a todos",
	addTimeSlot: "Agregar horario",
	errorFromAfterTo: "La hora de inicio no puede ser posterior a la hora de fin",
	toggleOpenAriaLabel: "Alternar estado de abierto/cerrado",
	copyToAllAriaLabel: "Copiar este horario a todos los días",
	addTimeSlotAriaLabel: "Agregar un nuevo intervalo de tiempo",
	removeTimeSlotAriaLabel: "Eliminar este intervalo de tiempo",
};

/**
 * Componente para gestionar el horario de un único día con soporte para intervalos de tiempo
 *
 * Este componente permite la configuración completa de horarios con las siguientes características:
 * - ✅ Gestión de hasta 2 intervalos de tiempo por día (restricción del backend)
 * - ✅ Slot vacío automático al final para facilitar agregar nuevos horarios
 * - ✅ Bloqueo automático cuando se alcanza el límite de 2 slots
 * - ✅ Toggle para abrir/cerrar el día
 * - ✅ Validación automática de rangos horarios (from < to)
 * - ✅ Función de copiar horario a todos los días
 * - ✅ Traducciones completamente personalizables
 * - ✅ Soporte completo para modo oscuro
 * - ✅ Accesibilidad (ARIA labels)
 * - ✅ Estados visuales (error, validación)
 * - ✅ Diseño responsivo
 *
 * ## 🕐 Gestión de Intervalos de Tiempo
 *
 * El componente soporta hasta 2 intervalos de tiempo por día (restricción del backend para horarios de configuración):
 * - **Un intervalo**: Horario continuo (ej: 09:00 - 17:00)
 * - **Dos intervalos**: Horario partido (ej: 09:00 - 13:00 y 14:00 - 18:00)
 * - **Slot vacío automático**: Siempre se muestra un slot vacío al final para agregar nuevos horarios fácilmente
 * - **Botón de agregar (+)**: Se habilita cuando el slot vacío está completamente lleno Y hay menos de 2 slots llenos
 * - **Límite alcanzado**: Cuando hay 2 slots llenos, el botón + se deshabilita automáticamente para cumplir con la restricción del backend
 *
 * ## 📝 Configuración de Textos
 *
 * Puedes configurar los textos mediante el objeto `translations`. Si no se proporciona,
 * el componente intentará usar las traducciones del sistema i18n y, si no están disponibles,
 * usará los valores por defecto en español.
 *
 * @example
 * // Uso básico con traducciones por defecto (español)
 * // Nota: Siempre incluye un slot vacío al final para facilitar agregar nuevos horarios
 * const [schedule, setSchedule] = useState<DaySchedule>({
 *   isOpen: true,
 *   timeSlots: [
 *     { from: "09:00", to: "17:00" },
 *     { from: "", to: "" }  // Slot vacío automático
 *   ]
 * });
 *
 * <ScheduleRowComponent
 *   day="Lunes"
 *   daySchedule={schedule}
 *   onChange={setSchedule}
 *   onCopyToAll={(day) => console.log('Copiar desde', day)}
 * />
 *
 * @example
 * // Horario partido (dos intervalos) - Útil para negocios con pausa de almuerzo
 * <ScheduleRowComponent
 *   day="Martes"
 *   daySchedule={{
 *     isOpen: true,
 *     timeSlots: [
 *       { from: "09:00", to: "13:00" },
 *       { from: "14:00", to: "18:00" },
 *       { from: "", to: "" }  // Slot vacío para agregar más horarios
 *     ]
 *   }}
 *   onChange={handleChange}
 * />
 *
 * @example
 * // Día cerrado - Los intervalos de tiempo se ocultan automáticamente
 * <ScheduleRowComponent
 *   day="Domingo"
 *   daySchedule={{
 *     isOpen: false,
 *     timeSlots: [{ from: "", to: "" }]
 *   }}
 *   onChange={handleChange}
 * />
 *
 * @example
 * // Con traducciones personalizadas (inglés)
 * <ScheduleRowComponent
 *   day="Monday"
 *   daySchedule={schedule}
 *   onChange={handleChange}
 *   onCopyToAll={handleCopyToAll}
 *   translations={{
 *     from: "From",
 *     to: "To",
 *     open: "Open",
 *     closed: "Closed",
 *     copyToAll: "Copy to all",
 *     addTimeSlot: "Add time slot"
 *   }}
 * />
 *
 * @example
 * // Gestión de horario semanal completo
 * const [weekSchedule, setWeekSchedule] = useState({
 *   monday: { isOpen: true, timeSlots: [{ from: "09:00", to: "17:00" }] },
 *   tuesday: { isOpen: true, timeSlots: [{ from: "09:00", to: "17:00" }] },
 *   wednesday: { isOpen: true, timeSlots: [{ from: "09:00", to: "17:00" }] },
 *   thursday: { isOpen: true, timeSlots: [{ from: "09:00", to: "17:00" }] },
 *   friday: { isOpen: true, timeSlots: [{ from: "09:00", to: "17:00" }] },
 *   saturday: { isOpen: true, timeSlots: [{ from: "10:00", to: "14:00" }] },
 *   sunday: { isOpen: false, timeSlots: [{ from: "", to: "" }] },
 * });
 *
 * const handleCopyToAll = (sourceDay: string) => {
 *   const sourceSchedule = weekSchedule[sourceDay];
 *   const newSchedule = {};
 *   Object.keys(weekSchedule).forEach(day => {
 *     newSchedule[day] = { ...sourceSchedule };
 *   });
 *   setWeekSchedule(newSchedule);
 * };
 *
 * <div className="flex flex-col gap-2">
 *   {Object.entries(weekSchedule).map(([day, schedule]) => (
 *     <ScheduleRowComponent
 *       key={day}
 *       day={day}
 *       daySchedule={schedule}
 *       onChange={(newSchedule) => {
 *         setWeekSchedule(prev => ({ ...prev, [day]: newSchedule }));
 *       }}
 *       onCopyToAll={handleCopyToAll}
 *     />
 *   ))}
 * </div>
 *
 * @example
 * // Con manejo de errores de validación
 * const [schedule, setSchedule] = useState<DaySchedule>({
 *   isOpen: true,
 *   timeSlots: [{
 *     from: "18:00",
 *     to: "09:00",
 *     error: "La hora de inicio no puede ser posterior a la hora de fin"
 *   }]
 * });
 *
 * <ScheduleRowComponent
 *   day="Jueves"
 *   daySchedule={schedule}
 *   onChange={setSchedule}
 * />
 *
 * @example
 * // Límite alcanzado: 2 slots llenos (máximo permitido por el backend)
 * // El botón + del slot vacío estará deshabilitado
 * <ScheduleRowComponent
 *   day="Miércoles"
 *   daySchedule={{
 *     isOpen: true,
 *     timeSlots: [
 *       { from: "08:00", to: "13:00" },
 *       { from: "14:00", to: "19:00" },
 *       { from: "", to: "" }  // Slot vacío presente pero botón + deshabilitado
 *     ]
 *   }}
 *   onChange={handleChange}
 * />
 *
 * @example
 * // Playground interactivo con logs (útil para debugging)
 * const [schedule, setSchedule] = useState<DaySchedule>({
 *   isOpen: true,
 *   timeSlots: [
 *     { from: "09:00", to: "17:00" },
 *     { from: "", to: "" }
 *   ]
 * });
 *
 * const [logs, setLogs] = useState<string[]>([]);
 *
 * const handleScheduleChange = (newSchedule: DaySchedule) => {
 *   const filledSlots = newSchedule.timeSlots.filter(s => s.from && s.to).length;
 *   const totalSlots = newSchedule.timeSlots.length;
 *
 *   console.log(`Schedule updated: ${filledSlots} filled, ${totalSlots} total, ${newSchedule.isOpen ? "Open" : "Closed"}`);
 *
 *   setLogs(prev => [
 *     `[${new Date().toLocaleTimeString()}] ${filledSlots} filled slot(s), ${totalSlots} total`,
 *     ...prev.slice(0, 9)
 *   ]);
 *
 *   setSchedule(newSchedule);
 * };
 *
 * <div>
 *   <ScheduleRowComponent
 *     day="Monday"
 *     daySchedule={schedule}
 *     onChange={handleScheduleChange}
 *     onCopyToAll={(day) => {
 *       console.log(`Copy to all from: ${day}`);
 *       alert(`Schedule from ${day} would be copied to all days`);
 *     }}
 *   />
 *
 *   <div className="mt-4">
 *     <strong>Activity Log:</strong>
 *     {logs.map((log, index) => (
 *       <div key={index}>{log}</div>
 *     ))}
 *   </div>
 * </div>
 *
 * @example
 * // Integración con sistema i18n (usando @tolgee/react)
 * import { useTranslate } from "@tolgee/react";
 *
 * const MyComponent = () => {
 *   const { t } = useTranslate();
 *
 *   return (
 *     <ScheduleRowComponent
 *       day={t("day_monday")}
 *       daySchedule={schedule}
 *       onChange={handleChange}
 *       onCopyToAll={handleCopyToAll}
 *       translations={{
 *         from: t("schedule_from"),
 *         to: t("schedule_to"),
 *         open: t("schedule_open"),
 *         closed: t("schedule_closed"),
 *         copyToAll: t("button_copy_to_all"),
 *         addTimeSlot: t("schedule_add_time_slot")
 *       }}
 *     />
 *   );
 * };
 *
 * ## 💡 Notas Importantes
 *
 * ### Formato de Hora
 * - Usa formato de 24 horas: "HH:MM" (ej: "09:00", "17:30")
 * - Las horas deben estar en formato string
 *
 * ### Slot Vacío Automático
 * - **Comportamiento**: El componente siempre mantiene un slot vacío al final de la lista
 * - **Propósito**: Facilitar la adición de nuevos intervalos sin necesidad de un botón separado de "agregar"
 * - **Flujo de trabajo**:
 *   1. El usuario llena el slot vacío (ingresa both from y to)
 *   2. El botón + se habilita automáticamente
 *   3. Al hacer clic en +, se agrega un nuevo slot vacío al final
 *   4. El proceso se repite para agregar más intervalos
 * - **Eliminación**: Los slots completamente llenos pueden eliminarse usando el botón de papelera
 *
 * ### Validación Automática
 * - El componente valida automáticamente que `from < to`
 * - Si `from > to`, se muestra un mensaje de error debajo del campo
 * - La validación se aplica en tiempo real a cada intervalo de tiempo
 * - Los slots con errores se marcan visualmente con bordes rojos
 *
 * ### Gestión de Intervalos
 * - **Mínimo**: 1 intervalo de tiempo por día (puede estar vacío)
 * - **Máximo**: 2 intervalos llenos por día (restricción del backend para horarios de configuración)
 * - **Slot vacío automático**: Siempre se muestra un slot vacío al final para facilitar agregar nuevos horarios
 * - **Botón de agregar (+)**: Se habilita cuando el slot vacío está completamente lleno Y hay menos de 2 slots llenos
 * - **Botón de eliminar**: Permite eliminar slots específicos (mínimo 1 slot debe permanecer)
 * - **Flujo de trabajo**:
 *   1. Llena el slot vacío con ambos valores (from y to)
 *   2. Si hay menos de 2 slots llenos, el botón + se habilita
 *   3. Haz clic en + para agregar el segundo slot
 *   4. Una vez alcanzado el límite de 2 slots llenos, el botón + se deshabilita automáticamente
 *   5. Para agregar un tercer slot, primero debes eliminar uno de los existentes
 *
 * ### Estados del Día
 * - **Abierto** (`isOpen: true`): Muestra los intervalos de tiempo y permite editarlos
 * - **Cerrado** (`isOpen: false`): Oculta los intervalos de tiempo
 *
 * ### Función "Copiar a todos"
 * - Permite replicar el horario de un día a todos los demás días de la semana
 * - El callback `onCopyToAll` recibe el nombre del día fuente
 * - La implementación de la lógica de copia es responsabilidad del componente padre
 *
 * ### Internacionalización
 * - Las traducciones se pueden proporcionar mediante el prop `translations`
 * - Si no se proporcionan, el componente usa el sistema i18n con las claves definidas en `defaultTranslationKeys`
 * - Si no hay traducciones en el sistema i18n, usa los valores por defecto en español (`fallbackTranslations`)
 *
 * ### Accesibilidad
 * - Todos los elementos interactivos tienen etiquetas ARIA apropiadas
 * - Los switches incluyen `aria-label` para tecnologías asistivas
 * - Los botones tienen etiquetas descriptivas
 * - Los mensajes de error están asociados con los campos mediante `aria-describedby`
 *
 * ### Diseño Responsivo
 * - En pantallas grandes: Los controles se distribuyen horizontalmente
 * - En pantallas pequeñas: Los controles se apilan verticalmente
 * - Los inputs de tiempo se ajustan automáticamente al tamaño de la pantalla
 *
 * ### Estados Visuales
 * - **Normal**: Estado por defecto con controles habilitados
 * - **Error**: Bordes rojos y mensaje de error cuando la validación falla
 * - **Dark Mode**: Adaptación automática de colores para modo oscuro
 * - **Hover/Focus**: Estados visuales para interacción del usuario
 *
 * ## 🧪 Escenarios de Prueba Comunes
 *
 * ### Agregar Nuevo Intervalo (Límite: 2 slots)
 * 1. Llenar el primer slot vacío con valores válidos (from y to)
 * 2. Verificar que el botón + se habilita
 * 3. Hacer clic en + para agregar un segundo slot vacío
 * 4. Llenar el segundo slot con valores válidos
 * 5. Verificar que el botón + ahora está deshabilitado (límite de 2 slots alcanzado)
 *
 * ### Probar Restricción de Límite de 2 Slots
 * 1. Configurar 2 slots llenos: [{ from: "09:00", to: "13:00" }, { from: "14:00", to: "18:00" }, { from: "", to: "" }]
 * 2. Intentar llenar el tercer slot (vacío) con valores
 * 3. Verificar que el botón + permanece deshabilitado
 * 4. Eliminar uno de los slots llenos
 * 5. Verificar que ahora el botón + del slot vacío se habilita nuevamente
 *
 * ### Validación de Tiempo Inválido
 * 1. Ingresar hora de inicio (from): "18:00"
 * 2. Ingresar hora de fin (to): "09:00"
 * 3. Verificar que aparece mensaje de error
 * 4. Verificar que el campo muestra borde rojo
 *
 * ### Eliminar Intervalo
 * 1. Hacer clic en el icono de papelera en un slot lleno
 * 2. Verificar que el slot se elimina
 * 3. Verificar que onChange se ejecuta con el nuevo estado
 * 4. Si había 2 slots llenos, verificar que el botón + ahora se habilita
 *
 * ### Alternar Estado del Día
 * 1. Hacer clic en el switch de abierto/cerrado
 * 2. Verificar que isOpen cambia en el callback onChange
 * 3. Cuando está cerrado, los intervalos se ocultan pero se mantienen en el estado
 *
 * ### Copiar a Todos los Días
 * 1. Configurar horarios para un día específico (máximo 2 slots)
 * 2. Hacer clic en el botón "Copiar a todos"
 * 3. Implementar la lógica en onCopyToAll para replicar el horario
 *
 * ### Edge Cases
 * - **Día cerrado con solo un slot vacío**: El componente debe funcionar correctamente
 * - **2 slots llenos + slot vacío**: El botón + debe estar deshabilitado (límite alcanzado)
 * - **Edición parcial de slot**: Si solo se llena from o to, el botón + permanece deshabilitado
 * - **Eliminación del único slot lleno**: El componente mantiene al menos un slot vacío
 * - **Intentar agregar tercer slot cuando hay 2 llenos**: El componente previene la adición automáticamente
 */
export const ScheduleRowComponent = ({
	day,
	daySchedule,
	onChange,
	onCopyToAll,
	translations = {},
}: ScheduleRowComponentProps) => {
	const { t } = useTranslate();

	// Crear traducciones por defecto usando el sistema de i18n
	const defaultTranslations: Required<ScheduleRowTranslations> = {
		from: t(defaultTranslationKeys.from, fallbackTranslations.from),
		to: t(defaultTranslationKeys.to, fallbackTranslations.to),
		open: t(defaultTranslationKeys.open, fallbackTranslations.open),
		closed: t(defaultTranslationKeys.closed, fallbackTranslations.closed),
		copyToAll: t(
			defaultTranslationKeys.copyToAll,
			fallbackTranslations.copyToAll
		),
		addTimeSlot: t(
			defaultTranslationKeys.addTimeSlot,
			fallbackTranslations.addTimeSlot
		),
		errorFromAfterTo: t(
			defaultTranslationKeys.errorFromAfterTo,
			fallbackTranslations.errorFromAfterTo
		),
		toggleOpenAriaLabel: t(
			defaultTranslationKeys.toggleOpenAriaLabel,
			fallbackTranslations.toggleOpenAriaLabel
		),
		copyToAllAriaLabel: t(
			defaultTranslationKeys.copyToAllAriaLabel,
			fallbackTranslations.copyToAllAriaLabel
		),
		addTimeSlotAriaLabel: t(
			defaultTranslationKeys.addTimeSlotAriaLabel,
			fallbackTranslations.addTimeSlotAriaLabel
		),
		removeTimeSlotAriaLabel: t(
			defaultTranslationKeys.removeTimeSlotAriaLabel,
			fallbackTranslations.removeTimeSlotAriaLabel
		),
	};

	// Combinar traducciones por defecto (del sistema i18n) con las personalizadas
	const finalTranslations: AuroraScheduleRowTranslations = {
		...defaultTranslations,
		...translations,
	};

	return (
		<ScheduleRow
			day={day}
			daySchedule={daySchedule as AuroraDaySchedule}
			onChange={(newSchedule: AuroraDaySchedule) =>
				onChange(newSchedule as DaySchedule)
			}
			onCopyToAll={onCopyToAll || (() => {})}
			translations={finalTranslations}
		/>
	);
};
