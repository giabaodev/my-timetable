import internalApi from './api-client';

export const getGoogleLogin = (): Promise<void> => {
  return internalApi.get('auth/google/login');
};
