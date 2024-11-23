import { toast } from '@/components/hooks/use-toast';
import { backendService } from '@/services';
import formatError from '@/utils/formatError';

import { Catalog } from './type';

export const getCatalog = async (): Promise<Catalog | null> => {
  try {
    const result = await backendService.get<Catalog>('/catalog');
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

export const updateCatalog = async (
  action: 'add' | 'edit' | 'delete',
  type:
    | 'users'
    | 'rooms'
    | 'roles'
    | 'device-status'
    | 'device-type'
    | 'request-status'
    | 'request-type',
  data: any
) => {
  try {
    const result = await backendService.put<any>('/catalog', {
      action,
      type,
      data,
    });
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
