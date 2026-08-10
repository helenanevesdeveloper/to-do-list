import type { LoginFormData } from '../types.js';
import { normalizeLoginFormData } from '../domain/inputSanitization.js';
import { loginUserApi } from '../infrastructure/loginUserApi.js';

function normalizePayload(formData: LoginFormData): LoginFormData {
  const normalizedData = normalizeLoginFormData(formData);
  return {
    email: normalizedData.email,
    password: normalizedData.password
  };
}

export async function loginUser(formData: LoginFormData) {
  const payload = normalizePayload(formData);
  return loginUserApi(payload);
}
