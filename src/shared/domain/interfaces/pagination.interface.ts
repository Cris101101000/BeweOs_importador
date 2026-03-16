export interface IPagination {
	limit?: number; // min 1
	offset?: number; // min 0
	order?: string; // campo en base de datos, para negativo '-' (ej. '-createdAt')
}

export interface IPaginationResult<T> {
	data: T[];
	total: number; // depende de filtros (si existe)
}
