import type { LoginFormData, LoginValidationResult } from '../types.js';
import {
  validateLoginEmail,
  validateLoginPassword
} from '../domain/validators.js';

export function validateLoginForm(formData: LoginFormData): LoginValidationResult {
  const errors = {
    email: validateLoginEmail(formData.email),
    password: validateLoginPassword(formData.password)
  };

  return {
    errors,
    isValid: !errors.email && !errors.password
  };
}
