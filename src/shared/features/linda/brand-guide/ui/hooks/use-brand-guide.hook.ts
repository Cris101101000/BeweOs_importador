import { useState, useCallback } from 'react';
import type { IBrandGuide } from '../../domain/interfaces/brand-guide.interface';
import { GetBrandGuideUseCase } from '../../application/get-brand-guide.usecase';
import { UpdateBrandGuideUseCase } from '../../application/update-brand-guide.usecase';
import { PatchBrandGuideUseCase } from '../../application/patch-brand-guide.usecase';
import {
	GenerateBrandGuideUseCase,
	type GenerateBrandGuideData,
} from '../../application/generate-brand-guide.usecase';
import {
	ExtractSimpleBrandGuideUseCase,
	type ExtractSimpleBrandGuideData,
} from '../../application/extract-simple-brand-guide.usecase';
import { BrandGuideAdapter } from '../../infrastructure/adapters/brand-guide.adapter';

// Instanciar el repositorio y los casos de uso
const brandGuideRepository = new BrandGuideAdapter();
const getBrandGuideUseCase = new GetBrandGuideUseCase(brandGuideRepository);
const updateBrandGuideUseCase = new UpdateBrandGuideUseCase(brandGuideRepository);
const patchBrandGuideUseCase = new PatchBrandGuideUseCase(brandGuideRepository);
const generateBrandGuideUseCase = new GenerateBrandGuideUseCase(brandGuideRepository);
const extractSimpleBrandGuideUseCase = new ExtractSimpleBrandGuideUseCase(brandGuideRepository);

/**
 * Hook personalizado para gestionar la guía de marca de Linda
 *
 * Proporciona:
 * - Estado de la guía de marca
 * - Estado de carga
 * - Manejo de errores
 * - Función para obtener la guía de marca
 * - Función para actualizar la guía de marca
 *
 * @example
 * ```typescript
 * const { brandGuide, loading, error, fetchBrandGuide, updateBrandGuide } = useBrandGuide();
 *
 * useEffect(() => {
 *   fetchBrandGuide();
 * }, []);
 *
 * const handleSave = async () => {
 *   await updateBrandGuide({
 *     primaryColor: '#FF6B6B',
 *     smbAddedDescription: 'Nueva descripción'
 *   });
 * };
 * ```
 */
export function useBrandGuide() {
	const [brandGuide, setBrandGuide] = useState<IBrandGuide | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	/**
	 * Obtiene la guía de marca activa
	 */
	const fetchBrandGuide = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const response: IBrandGuide = await getBrandGuideUseCase.execute();
			setBrandGuide(response);

			// Console.log para debug según especificación
			console.log('🎨 Guía de Marca de Linda:', {
				brandGuide: response,
				timestamp: new Date().toISOString(),
			});
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Error desconocido al cargar la guía de marca';
			setError(errorMessage);
			console.error('Error fetching brand guide:', err);
		} finally {
			setLoading(false);
		}
	}, []);

	/**
	 * Actualiza la guía de marca con datos parciales (PUT completo)
	 */
	const updateBrandGuide = useCallback(
		async (data: Partial<IBrandGuide>) => {
			setLoading(true);
			setError(null);

			try {
				await updateBrandGuideUseCase.execute(data);
				// Refrescar la guía de marca después de actualizar
				await fetchBrandGuide();

				console.log('🎨 Guía de Marca actualizada:', {
					updatedFields: data,
					timestamp: new Date().toISOString(),
				});
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : 'Error al actualizar la guía de marca';
				setError(errorMessage);
				console.error('Error updating brand guide:', err);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[fetchBrandGuide]
	);

	/**
	 * Actualiza parcialmente la guía de marca (PATCH)
	 * Útil para actualizar un solo campo sin afectar los demás
	 */
	const patchBrandGuide = useCallback(
		async (data: Partial<IBrandGuide>) => {
			setLoading(true);
			setError(null);

			try {
				await patchBrandGuideUseCase.execute(data);
				// Refrescar la guía de marca después de actualizar
				await fetchBrandGuide();

				console.log('🎨 Guía de Marca parcheada:', {
					patchedFields: data,
					timestamp: new Date().toISOString(),
				});
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : 'Error al actualizar la guía de marca';
				setError(errorMessage);
				console.error('Error patching brand guide:', err);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[fetchBrandGuide]
	);

	/**
	 * Genera/regenera la guía de marca
	 * Llama al endpoint POST /linda/brand-guide/generate
	 */
	const generateBrandGuide = useCallback(
		async (data: GenerateBrandGuideData) => {
			setLoading(true);
			setError(null);

			try {
				await generateBrandGuideUseCase.execute(data);
				// Refrescar la guía de marca después de generar
				await fetchBrandGuide();

				console.log('🎨 Guía de Marca generada:', {
					generatedWith: data,
					timestamp: new Date().toISOString(),
				});
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : 'Error al generar la guía de marca';
				setError(errorMessage);
				console.error('Error generating brand guide:', err);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[fetchBrandGuide]
	);

	/**
	 * Extrae datos básicos de marca usando solo Brandfetch (sin LLM)
	 * Llama al endpoint POST /linda/brand-guide/extract-simple
	 */
	const extractSimpleBrandGuide = useCallback(
		async (data: ExtractSimpleBrandGuideData) => {
			setLoading(true);
			setError(null);

			try {
				const result = await extractSimpleBrandGuideUseCase.execute(data);

				if (!result.isSuccess) {
					const errorMessage = result.error instanceof Error ? result.error.message : 'Error al extraer la guía de marca';
					setError(errorMessage);
					return result;
				}

				console.log('🎨 Guía de Marca extraída (simple):', {
					extractedData: result.value,
					timestamp: new Date().toISOString(),
				});

				return result;
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : 'Error al extraer la guía de marca';
				setError(errorMessage);
				console.error('Error extracting simple brand guide:', err);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	return {
		brandGuide,
		loading,
		error,
		fetchBrandGuide,
		updateBrandGuide,
		patchBrandGuide,
		generateBrandGuide,
		extractSimpleBrandGuide,
	};
}

export type UseBrandGuideReturn = ReturnType<typeof useBrandGuide>;
