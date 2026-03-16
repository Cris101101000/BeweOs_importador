export interface IMetricRange {
	min: number;
	max: number;
	fuente: string;
}

export interface IDiagnosticResult {
	horasAhorradas: IMetricRange;
	dineroPerdido: IMetricRange;
	clientesAdicionales: IMetricRange;
}
