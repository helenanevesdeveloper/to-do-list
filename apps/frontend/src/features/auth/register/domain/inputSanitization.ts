import type {
  RegisterFieldName,
  RegisterFormData,
  RegisterInputLimits
} from '../types.js';
import {
  authInputLimits,
  sanitizeEmailInput,
  sanitizePasswordInput
} from '../../shared/domain/inputSanitization.js';

export function sanitizeRegisterField(
  name: RegisterFieldName,
  rawValue: string
): string {
  if (name === 'email') {
    return sanitizeEmailInput(rawValue);
  }

  if (name === 'password' || name === 'confirmPassword') {
    return sanitizePasswordInput(rawValue);
  }

  return rawValue ?? '';
}

export function normalizeRegisterFormData(
  formData: RegisterFormData
): RegisterFormData {
  return {
    email: sanitizeRegisterField('email', formData.email).trim(),
    password: sanitizeRegisterField('password', formData.password),
    confirmPassword: sanitizeRegisterField(
      'confirmPassword',
      formData.confirmPassword
    )
  };
}

export function registerInputLimits(): RegisterInputLimits {
  return authInputLimits();
}
