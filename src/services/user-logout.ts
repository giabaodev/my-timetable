import internalApi from './api-client';

export const userLogout = async () => {
  const result = await internalApi.post('/auth/logout');
  return result.data;
};
