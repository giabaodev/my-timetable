import { getGoogleLogin } from '@/services/get-google-login';
import { useQuery } from '@tanstack/react-query';

export const useGoogleLogin = () => {
  return useQuery({
    queryKey: ['google-login'],
    queryFn: () => getGoogleLogin(),
    enabled: false,
  });
};
