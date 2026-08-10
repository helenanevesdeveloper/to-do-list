import type { RegisterFormData, RegisterValidationResult } from '../types.js';
import {
  validateConfirmPassword,
  validateEmail,
  validatePasswordMessages
} from '../domain/validators.js';

export function validateRegisterForm(
  formData: RegisterFormData
): RegisterValidationResult {
  const passwordMessages = validatePasswordMessages(formData.password);
  const errorMessages = {
    email: (() => {
      const message = validateEmail(formData.email);
      return message ? [message] : [];
    })(),
    password: passwordMessages,
    confirmPassword: (() => {
      const message = validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      );
      return message ? [message] : [];
    })()
  };

  return {
    errorMessages,
    isValid:
      !errorMessages.email.length &&
      !errorMessages.password.length &&
      !errorMessages.confirmPassword.length
  };
}
