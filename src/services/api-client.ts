import { APP_CONFIG } from '@/configs';
import axios from 'axios';

const internalApi = axios.create({
  baseURL: APP_CONFIG.API_ENDPOINT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default internalApi;
