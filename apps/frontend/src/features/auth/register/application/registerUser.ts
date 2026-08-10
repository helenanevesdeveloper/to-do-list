import type { RegisterFormData } from '../types.js';
import { registerUserApi } from '../infrastructure/registerUserApi.js';
import { normalizeRegisterFormData } from '../domain/inputSanitization.js';

type RegisterPayload = Pick<RegisterFormData, 'email' | 'password'>;

function normalizePayload(formData: RegisterFormData): RegisterPayload {
  const normalizedData = normalizeRegisterFormData(formData);
  return {
    email: normalizedData.email,
    password: normalizedData.password
  };
}

export async function registerUser(formData: RegisterFormData) {
  const payload = normalizePayload(formData);
  return registerUserApi(payload);
}
