import { toast } from '@/components/hooks/use-toast';
import { backendService } from '@/services';
import formatError from '@/utils/formatError';

import { Request } from './type';

export const getRequests = async (): Promise<Request[]> => {
  try {
    const result = await backendService.get<Request[]>('/requests/get/all');
    if (result.kind === 'ok') {
      return result.data;
    }
    throw result;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return [];
  }
};

export const getRequest = async (id: string): Promise<Request | null> => {
  try {
    const result = await backendService.get<Request>(`/requests/get/${id}`);
    if (result.kind === 'ok') {
      return result.data;
    }
    throw result;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return null;
  }
};

export const createRequest = async (
  request: Partial<Request>
): Promise<Request | null> => {
  try {
    const result = await backendService.post<Request>('/requests/create', {
      request,
    });
    if (result.kind === 'ok') {
      return result.data;
    }
    throw result;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return null;
  }
};

export const updateRequest = async (
  id: string,
  request: Partial<Request>
): Promise<Request | null> => {
  try {
    const result = await backendService.post<Request>('/requests/update', {
      id,
      request,
    });
    if (result.kind === 'ok') {
      return result.data;
    }
    throw result;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return null;
  }
};

export const deleteRequest = async (id: string): Promise<boolean> => {
  try {
    const result = await backendService.post('/requests/delete', { id });
    if (result.kind === 'ok') {
      return true;
    }
    throw result;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return false;
  }
};
