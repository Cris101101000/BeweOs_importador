import type { Result } from "@shared/domain/errors/Result";

export interface IBusinessVerticalRepository {
	getVerticals(): Promise<Result<string[], Error>>;
	saveVertical(vertical: string): Promise<Result<void, Error>>;
}
