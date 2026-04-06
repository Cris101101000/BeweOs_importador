import type { GetClientResponseDto } from "../dtos/get-client.dto";

const STORAGE_KEY = "bewe_local_contacts";

/**
 * Servicio de persistencia local para contactos.
 * Usa localStorage como almacenamiento mientras no hay backend/base de datos.
 */
export class LocalContactsStorageService {
	private static instance: LocalContactsStorageService;

	static getInstance(): LocalContactsStorageService {
		if (!this.instance) {
			this.instance = new LocalContactsStorageService();
		}
		return this.instance;
	}

	getAll(): GetClientResponseDto[] {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return [];
			return JSON.parse(raw) as GetClientResponseDto[];
		} catch {
			return [];
		}
	}

	getById(id: string): GetClientResponseDto | undefined {
		return this.getAll().find((c) => c.id === id);
	}

	/**
	 * Retorna contactos paginados con filtros básicos
	 */
	getByFilters(params: {
		limit?: number;
		offset?: number;
		search?: string;
		status?: string;
	}): { items: GetClientResponseDto[]; total: number } {
		let contacts = this.getAll();

		if (params.search) {
			const term = params.search.toLowerCase();
			contacts = contacts.filter(
				(c) =>
					c.firstname?.toLowerCase().includes(term) ||
					c.lastname?.toLowerCase().includes(term) ||
					c.email?.toLowerCase().includes(term) ||
					c.phones?.some((p) => p.number?.includes(term)),
			);
		}

		if (params.status) {
			contacts = contacts.filter(
				(c) => c.status?.toLowerCase() === params.status?.toLowerCase(),
			);
		}

		const total = contacts.length;
		const offset = params.offset || 0;
		const limit = params.limit || 20;
		const items = contacts.slice(offset, offset + limit);

		return { items, total };
	}

	/**
	 * Guarda múltiples contactos. Retorna { created, updated, failed }
	 */
	bulkSave(
		contacts: GetClientResponseDto[],
		onProgress?: (progress: number, log: string) => void,
	): { created: number; updated: number; failed: number } {
		const existing = this.getAll();
		const emailIndex = new Map<string, number>();
		for (let i = 0; i < existing.length; i++) {
			const email = existing[i].email?.toLowerCase();
			if (email) emailIndex.set(email, i);
		}

		let created = 0;
		let updated = 0;
		let failed = 0;
		const batchSize = 500;
		const total = contacts.length;

		for (let i = 0; i < contacts.length; i++) {
			try {
				const contact = contacts[i];
				const email = contact.email?.toLowerCase();
				const existingIndex = email ? emailIndex.get(email) : undefined;

				if (existingIndex !== undefined) {
					existing[existingIndex] = {
						...existing[existingIndex],
						...contact,
						id: existing[existingIndex].id,
						updatedAt: new Date().toISOString(),
					};
					updated++;
				} else {
					const newContact: GetClientResponseDto = {
						...contact,
						id: contact.id || crypto.randomUUID(),
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
						isActive: true,
						status: contact.status || "prospect",
					};
					existing.push(newContact);
					if (email) emailIndex.set(email, existing.length - 1);
					created++;
				}
			} catch {
				failed++;
			}

			// Reportar progreso por lotes
			if (onProgress && ((i + 1) % batchSize === 0 || i === total - 1)) {
				const batch = Math.ceil((i + 1) / batchSize);
				const totalBatches = Math.ceil(total / batchSize);
				const progress = 20 + ((i + 1) / total) * 75;
				onProgress(
					Math.round(progress),
					`Lote ${batch}/${totalBatches} completado (${i + 1} contactos)`,
				);
			}
		}

		this.saveAll(existing);
		return { created, updated, failed };
	}

	save(contact: GetClientResponseDto): GetClientResponseDto {
		const contacts = this.getAll();
		const newContact = {
			...contact,
			id: contact.id || crypto.randomUUID(),
			createdAt: contact.createdAt || new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		contacts.push(newContact);
		this.saveAll(contacts);
		return newContact;
	}

	update(
		id: string,
		updates: Partial<GetClientResponseDto>,
	): GetClientResponseDto | undefined {
		const contacts = this.getAll();
		const index = contacts.findIndex((c) => c.id === id);
		if (index === -1) return undefined;

		contacts[index] = {
			...contacts[index],
			...updates,
			id,
			updatedAt: new Date().toISOString(),
		};
		this.saveAll(contacts);
		return contacts[index];
	}

	delete(id: string): boolean {
		const contacts = this.getAll();
		const filtered = contacts.filter((c) => c.id !== id);
		if (filtered.length === contacts.length) return false;
		this.saveAll(filtered);
		return true;
	}

	deleteMany(ids: string[]): void {
		const idSet = new Set(ids);
		const contacts = this.getAll().filter((c) => !idSet.has(c.id || ""));
		this.saveAll(contacts);
	}

	/**
	 * Busca duplicados por email entre los contactos a importar y los existentes
	 */
	findDuplicatesByEmail(
		emails: string[],
	): Map<string, GetClientResponseDto> {
		const existing = this.getAll();
		const duplicates = new Map<string, GetClientResponseDto>();

		const emailIndex = new Map<string, GetClientResponseDto>();
		for (const contact of existing) {
			if (contact.email) {
				emailIndex.set(contact.email.toLowerCase(), contact);
			}
		}

		for (const email of emails) {
			const found = emailIndex.get(email.toLowerCase());
			if (found) {
				duplicates.set(email.toLowerCase(), found);
			}
		}

		return duplicates;
	}

	private saveAll(contacts: GetClientResponseDto[]): void {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
	}
}
