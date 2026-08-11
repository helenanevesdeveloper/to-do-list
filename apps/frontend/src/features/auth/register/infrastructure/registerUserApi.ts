import type { RegisterFormData } from '../types.js';
import { httpClient } from '../../../../shared/infrastructure/http/httpClient.js';

type RegisterPayload = Pick<RegisterFormData, 'email' | 'password'>;

export async function registerUserApi(payload: RegisterPayload) {
  const response = await httpClient.post('/api/auth/register', payload);
  return response.data as { email: string };
}
