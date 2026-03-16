// TODO: component not used yet
import { useState, useMemo, useCallback } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Pagination,
	type SortDescriptor,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { INotificationHistory } from "../../../domain/interfaces/notification-history.interface";
import { NotificationHistoryStatus, NotificationChannel } from "../../../domain/interfaces/notification-history.interface";
import { mockNotificationHistory } from "../../../infrastructure/mocks/notification-history.mock";

interface NotificationHistoryModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const columns = [
	{ uid: "type", name: "Tipo", sortable: true },
	{ uid: "title", name: "Título", sortable: true },
	{ uid: "recipient", name: "Destinatario", sortable: true },
	{ uid: "channel", name: "Canal", sortable: true },
	{ uid: "status", name: "Estado", sortable: true },
	{ uid: "isAiGenerated", name: "Generado con AI", sortable: true },
	{ uid: "sentAt", name: "Fecha de envío", sortable: true },
	{ uid: "actions", name: "Acciones", sortable: false },
];

export function NotificationHistoryModal({ isOpen, onClose }: NotificationHistoryModalProps) {
	const { t } = useTranslate();
	const [page, setPage] = useState(1);
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "sentAt",
		direction: "descending",
	});

	const rowsPerPage = 10;

	const sortedItems = useMemo(() => {
		return [...mockNotificationHistory].sort((a, b) => {
			const first = a[sortDescriptor.column as keyof INotificationHistory];
			const second = b[sortDescriptor.column as keyof INotificationHistory];
			const cmp = first < second ? -1 : first > second ? 1 : 0;

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [sortDescriptor]);

	const paginatedItems = useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;
		return sortedItems.slice(start, end);
	}, [sortedItems, page]);

	const pages = Math.ceil(mockNotificationHistory.length / rowsPerPage);

	const renderCell = useCallback((item: INotificationHistory, columnKey: React.Key) => {
		const cellValue = item[columnKey as keyof INotificationHistory];

		switch (columnKey) {
			case "type":
				return (
					<div className="flex items-center">
						<span className="text-sm font-medium">{cellValue}</span>
					</div>
				);
			case "title":
				return (
					<div className="flex flex-col">
						<span className="text-sm font-medium">{cellValue}</span>
					</div>
				);
			case "recipient":
				return (
					<div className="flex items-center">
						<span className="text-sm">{cellValue}</span>
					</div>
				);
			case "channel":
				const getChannelIcon = (channel: NotificationChannel) => {
					switch (channel) {
						case NotificationChannel.EMAIL:
							return "📧";
						case NotificationChannel.SMS:
							return "📱";
						case NotificationChannel.WHATSAPP:
							return "💬";
						case NotificationChannel.PUSH:
							return "🔔";
						default:
							return "📤";
					}
				};
				return (
					<div className="flex items-center space-x-2">
						<span>{getChannelIcon(cellValue as NotificationChannel)}</span>
						<span className="text-sm capitalize">{cellValue}</span>
					</div>
				);
			case "status":
				const getStatusColor = (status: NotificationHistoryStatus) => {
					switch (status) {
						case NotificationHistoryStatus.DELIVERED:
							return "bg-green-100 text-green-800";
						case NotificationHistoryStatus.SENT:
							return "bg-blue-100 text-blue-800";
						case NotificationHistoryStatus.PENDING:
							return "bg-yellow-100 text-yellow-800";
						case NotificationHistoryStatus.FAILED:
							return "bg-red-100 text-red-800";
						default:
							return "bg-gray-100 text-gray-800";
					}
				};
				const getStatusText = (status: NotificationHistoryStatus) => {
					switch (status) {
						case NotificationHistoryStatus.DELIVERED:
							return "Entregado";
						case NotificationHistoryStatus.SENT:
							return "Enviado";
						case NotificationHistoryStatus.PENDING:
							return "Pendiente";
						case NotificationHistoryStatus.FAILED:
							return "Fallido";
						default:
							return "Desconocido";
					}
				};
				return (
					<span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(cellValue as NotificationHistoryStatus)}`}>
						{getStatusText(cellValue as NotificationHistoryStatus)}
					</span>
				);
			case "isAiGenerated":
				return (
					<div className="flex items-center">
						{cellValue ? (
							<span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 flex items-center space-x-1">
								<span>🤖</span>
								<span>AI</span>
							</span>
						) : (
							<span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
								Manual
							</span>
						)}
					</div>
				);
			case "sentAt":
				return (
					<span className="text-sm text-gray-600">
						{new Date(cellValue as string).toLocaleDateString('es-ES', {
							year: 'numeric',
							month: 'short',
							day: 'numeric',
							hour: '2-digit',
							minute: '2-digit'
						})}
					</span>
				);
			case "actions":
				return (
					<div className="flex items-center space-x-2">
						<button className="text-blue-600 hover:text-blue-800 text-sm">
							Ver
						</button>
						{item.status === NotificationHistoryStatus.FAILED && (
							<button className="text-orange-600 hover:text-orange-800 text-sm">
								Reintentar
							</button>
						)}
						<button className="text-red-600 hover:text-red-800 text-sm">
							Eliminar
						</button>
					</div>
				);
			default:
				return cellValue;
		}
	}, []);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto">
			<div className="flex min-h-screen items-center justify-center p-4">
				{/* Backdrop */}
				<div 
					className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
					onClick={onClose}
				/>
				
				{/* Modal */}
				<div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full p-6 max-h-[90vh] overflow-y-auto">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-xl font-semibold text-gray-900">
							{t("notifications_history_title", "Historial de Notificaciones")}
						</h3>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-600 transition-colors"
						>
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					{/* Filters and Search Bar */}
					<div className="mb-4 flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<input
								type="text"
								placeholder={t("notifications_history_search_placeholder", "Buscar notificaciones...")}
								className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
								<option value="">{t("notifications_history_all_types", "Todos los tipos")}</option>
								<option value="Recordatorio de cita">Recordatorio de cita</option>
								<option value="Confirmación de cita">Confirmación de cita</option>
								<option value="Pregunta pendiente">Pregunta pendiente</option>
								<option value="Cancelación de cita">Cancelación de cita</option>
								<option value="Bienvenida">Bienvenida</option>
								<option value="Promoción especial">Promoción especial</option>
								<option value="Encuesta de satisfacción">Encuesta de satisfacción</option>
							</select>
							<select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
								<option value="">{t("notifications_history_all_statuses", "Todos los estados")}</option>
								<option value={NotificationHistoryStatus.DELIVERED}>Entregado</option>
								<option value={NotificationHistoryStatus.SENT}>Enviado</option>
								<option value={NotificationHistoryStatus.PENDING}>Pendiente</option>
								<option value={NotificationHistoryStatus.FAILED}>Fallido</option>
							</select>
						</div>
						<div className="text-sm text-gray-600">
							{t("notifications_history_total_count", "{{count}} notificaciones en total", { count: mockNotificationHistory.length })}
						</div>
					</div>

					{/* Table */}
					<Table
						aria-label={t("notifications_history_table_aria", "Tabla de historial de notificaciones")}
						sortDescriptor={sortDescriptor}
						onSortChange={setSortDescriptor}
						bottomContent={
							<div className="flex w-full justify-center">
								<Pagination
									isCompact
									showControls
									showShadow
									color="primary"
									page={page}
									total={pages}
									onChange={setPage}
								/>
							</div>
						}
						classNames={{
							wrapper: "min-h-[400px]",
						}}
					>
						<TableHeader columns={columns}>
							{(column) => (
								<TableColumn
									key={column.uid}
									align="start"
									allowsSorting={column.sortable}
								>
									{column.name}
								</TableColumn>
							)}
						</TableHeader>
						<TableBody items={paginatedItems}>
							{(item) => (
								<TableRow key={item.id}>
									{(columnKey) => (
										<TableCell>{renderCell(item, columnKey)}</TableCell>
									)}
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
