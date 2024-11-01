import { toast } from '@/components/hooks/use-toast';
import { backendService } from '@/services';
import formatError from '@/utils/formatError';

import { Liquidation } from './type';

export const getLiquidations = async (): Promise<Liquidation[]> => {
  try {
    const result = await backendService.get<Liquidation[]>(
      '/liquidation/get/all'
    );
    if (result.kind === 'ok') {
      return result.data;
    }
    throw result.error;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return [];
  }
};

export const getLiquidation = async (
  id: string
): Promise<Liquidation | null> => {
  try {
    const result = await backendService.get<Liquidation>(
      `/liquidation/get/${id}`
    );
    if (result.kind === 'ok') {
      return result.data;
    }
    throw result.error;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return null;
  }
};

export const getLiquidationByFilter = async (
  filter: Partial<Liquidation>
): Promise<Liquidation[]> => {
  try {
    const result = await backendService.post<Liquidation[]>(
      '/liquidation/get',
      filter
    );
    if (result.kind === 'ok') {
      return result.data;
    }
    throw result.error;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return [];
  }
};

export const createLiquidation = async (
  liquidation: Partial<Liquidation>
): Promise<Liquidation | null> => {
  try {
    const result = await backendService.post<Liquidation>(
      '/liquidation/create',
      {
        liquidation,
      }
    );
    if (result.kind === 'ok') {
      return result.data;
    }
    throw result.error;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return null;
  }
};

export const updateLiquidation = async (
  id: string,
  liquidation: Partial<Liquidation>
): Promise<Liquidation | null> => {
  try {
    const result = await backendService.post<Liquidation>(
      '/liquidation/update',
      {
        id,
        liquidation,
      }
    );
    if (result.kind === 'ok') {
      return result.data;
    }
    throw result.error;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return null;
  }
};

export const deleteLiquidation = async (id: string): Promise<boolean> => {
  try {
    const result = await backendService.post('/liquidation/delete', { id });
    if (result.kind === 'ok') {
      return true;
    }
    throw result.error;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return false;
  }
};
