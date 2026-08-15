import type { RegisterFormErrorMessages } from '../types.js';

type ApiValidationIssue = {
  code?: string;
  loc?: unknown[];
  msg?: string;
  field?: string;
  message?: string;
  type?: string;
};

type ApiErrorResponse = {
  status?: number;
  data?: {
    detail?:
      | string
      | { code?: string; message?: string }
      | ApiValidationIssue[];
  };
};

type RegisterApiError = {
  response?: ApiErrorResponse;
};

export type MappedRegisterUserError = {
  fieldErrorMessages: RegisterFormErrorMessages;
  formError: string;
};

export function createEmptyFieldErrorMessages(): RegisterFormErrorMessages {
  return {
    email: [],
    password: [],
    confirmPassword: []
  };
}

export function mapRegisterUserError(error: unknown): MappedRegisterUserError {
  const response = (error as RegisterApiError | undefined)?.response;
  const status = response?.status;
  const detail = response?.data?.detail;

  const mapped: MappedRegisterUserError = {
    fieldErrorMessages: createEmptyFieldErrorMessages(),
    formError: 'Could not create account. Please try again.'
  };

  if (!status) {
    mapped.formError =
      'Could not connect to the server. Check your connection and try again.';
    return mapped;
  }

  if (status === 409) {
    const detailCode =
      typeof detail === 'string'
        ? null
        : Array.isArray(detail)
          ? detail[0]?.code || detail[0]?.type || null
          : detail?.code || null;

    const detailMessage =
      typeof detail === 'string'
        ? detail
        : Array.isArray(detail)
          ? detail[0]?.message || detail[0]?.msg || ''
          : detail?.message || '';

    if (
      detailCode === 'user_already_exists' ||
      detailMessage === 'user with this email already exists'
    ) {
      mapped.fieldErrorMessages.email = ['This email is already registered.'];
      mapped.formError = '';
      return mapped;
    }
  }

  if (status === 400 && Array.isArray(detail)) {
    for (const issue of detail) {
      const field = issue?.field;
      const message = issue?.message;

      if (field === 'email' && message) {
        mapped.fieldErrorMessages.email.push(message);
      }
      if (field === 'password' && message) {
        mapped.fieldErrorMessages.password.push(message);
      }
    }

    if (
      mapped.fieldErrorMessages.email.length ||
      mapped.fieldErrorMessages.password.length
    ) {
      mapped.formError = '';
      return mapped;
    }
  }

  if (status === 400 && typeof detail === 'string') {
    if (detail.includes('password')) {
      mapped.fieldErrorMessages.password = [detail];
      mapped.formError = '';
      return mapped;
    }

    if (detail.includes('email')) {
      mapped.fieldErrorMessages.email = [detail];
      mapped.formError = '';
      return mapped;
    }
  }

  if (status === 422 && Array.isArray(detail)) {
    for (const issue of detail) {
      const field = issue?.loc?.[1];
      const message = issue?.message || issue?.msg;

      if (field === 'email') {
        mapped.fieldErrorMessages.email = [
          message || 'Invalid email value.'
        ];
      }
      if (field === 'password') {
        mapped.fieldErrorMessages.password = [
          message || 'Invalid password value.'
        ];
      }
    }

    if (
      mapped.fieldErrorMessages.email.length ||
      mapped.fieldErrorMessages.password.length
    ) {
      mapped.formError = '';
      return mapped;
    }
  }

  return mapped;
}
