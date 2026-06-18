import axios from 'axios';

const internalApi = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default internalApi;
