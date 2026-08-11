import type { LoginFormData } from '../types.js';
import { httpClient } from '../../../../shared/infrastructure/http/httpClient.js';

export async function loginUserApi(payload: LoginFormData) {
  const response = await httpClient.post('/api/auth/login', payload);
  return response.data;
}
