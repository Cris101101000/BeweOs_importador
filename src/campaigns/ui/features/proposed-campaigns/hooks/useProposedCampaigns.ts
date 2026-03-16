import { useState, useCallback } from 'react';
import type { IProposedCampaign } from '@campaigns/domain/proposed-campaigns/interfaces/ProposedCampaign';
import * as ProposedCampaignsDI from '../DependencyInjection';

/**
 * Hook personalizado para gestionar campañas propuestas por Linda
 */
export function useProposedCampaigns() {
  const [campaigns, setCampaigns] = useState<IProposedCampaign[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtiene las campañas propuestas paginadas
   */
  const fetchProposedCampaigns = useCallback(async (limit: number = 20, offset: number = 0) => {
    setLoading(true);
    setError(null);

    try {
      const result = await ProposedCampaignsDI.GetProposedCampaigns().execute(limit, offset);
      
      if (result.isSuccess && result.value) {
        setCampaigns(result.value.campaigns);
        setTotal(result.value.total);
      } else if (result.error) {
        setError(result.error.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar las campañas propuestas');
      console.error('Error fetching proposed campaigns:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Elimina una campaña propuesta
   */
  const deleteProposedCampaign = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await ProposedCampaignsDI.DeleteProposedCampaign().execute(id);
      
      if (result.isSuccess) {
        // Actualizar el estado local removiendo la campaña eliminada
        setCampaigns(prevCampaigns => prevCampaigns.filter(campaign => campaign.id !== id));
        setTotal(prevTotal => prevTotal - 1);
      } else if (result.error) {
        setError(result.error.message);
        throw new Error(result.error.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la campaña propuesta';
      setError(errorMessage);
      console.error('Error deleting proposed campaign:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    campaigns,
    total,
    loading,
    error,
    fetchProposedCampaigns,
    deleteProposedCampaign,
  };
}
