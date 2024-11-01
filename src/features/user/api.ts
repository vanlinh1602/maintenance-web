import { getAuth } from 'firebase/auth';

import { toast } from '@/components/hooks/use-toast';
import { backendService } from '@/services';
import formatError from '@/utils/formatError';

import { User } from './type';

export const auth = async (): Promise<{
  info: User;
  isAdmin: boolean;
  isManager: boolean;
  isMaintenance: boolean;
} | null> => {
  try {
    const user = getAuth().currentUser;
    const data = {
      name: user?.displayName || '',
      email: user?.email || '',
      phone: user?.phoneNumber || '',
      avatar: user?.photoURL || '',
    };
    const token = await user?.getIdToken();
    const result = await backendService.post<{
      info: User;
      isAdmin: boolean;
      isManager: boolean;
      isMaintenance: boolean;
    }>('/user/auth', {
      info: data,
      token,
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

export const signOut = async (): Promise<void> => {
  try {
    await backendService.post('/user/signOut');
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
  }
};
