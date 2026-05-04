import { User } from '@/interfaces/user';
import internalApi from './api-client';

export const getUserInfo = async (): Promise<User> => {
  const result = await internalApi.get('/auth/me');
  return result.data;
};
