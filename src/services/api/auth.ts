import { api } from 'boot/axios';

import type { AxiosResponse } from 'axios';
import type { RegisterData, LoginData, LoginResponse } from 'src/models/auth';

export const register = (data: RegisterData): Promise<AxiosResponse> => {
  return api.post('/register', data);
};

export const login = (data: LoginData): Promise<AxiosResponse<LoginResponse>> => {
  return api.post('/login', data);
};
