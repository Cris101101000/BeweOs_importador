export enum ClientViewMode {
	Table = "table",
	Kanban = "kanban",
}

export const CLIENT_VIEW_PATHS = {
	[ClientViewMode.Table]: "/clients/table",
	[ClientViewMode.Kanban]: "/clients/kanban",
};
