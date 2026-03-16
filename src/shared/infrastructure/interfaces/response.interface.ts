//TODO: COMO TODOS VAN A USAR ESTA INTERFAZ, DEBERIAMOS MOVERLA A LA LIBRERIA DE UTILS
export interface IResponse<T> {
	success: boolean;
	message: string;
	data?: T;
	timestamp: string;
	error?: IResponseError;
}
export interface IResponseError {
	code: string;
	message: string;
	fields?: string[];
	quantity?: number;
}
