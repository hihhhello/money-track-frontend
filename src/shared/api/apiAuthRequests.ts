import { axiosInstance } from './apiBase';

const register = ({ body }: { body: { email: string; password: string } }) => {
  return axiosInstance.post('/register', body);
};

export const apiAuthRequests = {
  register,
};
