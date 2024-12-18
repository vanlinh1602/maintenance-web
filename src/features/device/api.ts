import { toast } from '@/components/hooks/use-toast';
import { backendService } from '@/services';
import formatError from '@/utils/formatError';

import { Device } from './type';

export const getDevices = async (): Promise<Device[]> => {
  try {
    const result = await backendService.get<Device[]>('/devices');
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

export const getFilterDevice = async (
  filter: Partial<Device>
): Promise<Device[]> => {
  try {
    const result = await backendService.get<Device[]>('/devices', filter);
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

export const createDevice = async (
  device: Partial<Device>
): Promise<Device | null> => {
  try {
    const result = await backendService.post<Device>('/devices', {
      device,
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

export const updateDevice = async (
  id: string,
  device: Partial<Device>
): Promise<Device | null> => {
  try {
    const result = await backendService.put<Device>('/devices', {
      id,
      device,
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

export const deleteDevice = async (id: string): Promise<boolean> => {
  try {
    const result = await backendService.delete('/devices', { id });
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
