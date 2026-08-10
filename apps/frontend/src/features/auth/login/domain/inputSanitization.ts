import type {
  LoginFieldName,
  LoginFormData,
  LoginInputLimits
} from '../types.js';
import {
  authInputLimits,
  sanitizeEmailInput,
  sanitizePasswordInput
} from '../../shared/domain/inputSanitization.js';

export function sanitizeLoginField(name: LoginFieldName, rawValue: string): string {
  if (name === 'email') {
    return sanitizeEmailInput(rawValue);
  }

  if (name === 'password') {
    return sanitizePasswordInput(rawValue);
  }

  return rawValue ?? '';
}

export function normalizeLoginFormData(formData: LoginFormData): LoginFormData {
  return {
    email: sanitizeLoginField('email', formData.email).trim(),
    password: sanitizeLoginField('password', formData.password)
  };
}

export function loginInputLimits(): LoginInputLimits {
  return authInputLimits();
}
