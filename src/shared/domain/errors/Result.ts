export class Result<T, E = Error> {
	public isSuccess: boolean;
	public value?: T;
	public error?: E;

	constructor(isSuccess: boolean, value?: T, error?: E) {
		this.isSuccess = isSuccess;
		this.value = value;
		this.error = error;
	}

	static Ok<T>(value?: T): Result<T, never> {
		return new Result<T, never>(true, value as T, undefined);
	}

	static Err<E>(error: E): Result<never, E> {
		return new Result<never, E>(false, undefined, error);
	}
}
