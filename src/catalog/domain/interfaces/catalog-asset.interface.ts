import type {
	IAssetInfo,
	IAssetStorage,
} from "@shared/domain/interfaces/asset.interface";

export interface ICatalogAsset {
	id: string;
	url: string; // Backward compatibility
	name?: string; // Backward compatibility
	type?: string; // Backward compatibility
	mimeType?: string; // Backward compatibility
	size?: number; // Backward compatibility
	createdAt: Date;
	updatedAt: Date;
	metadata?: Record<string, unknown>;

	// New structured fields
	contexts?: string[];
	info?: IAssetInfo;
	storage?: IAssetStorage;
	isActive?: boolean;
	ownerType?: string;
	entityType?: string;
	entityId?: string;
}
