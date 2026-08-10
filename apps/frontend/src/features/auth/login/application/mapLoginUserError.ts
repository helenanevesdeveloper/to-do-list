import type { LoginFormErrors } from '../types.js';

type ApiValidationIssue = {
  loc?: unknown[];
  msg?: string;
};

type ApiErrorResponse = {
  status?: number;
  data?: {
    detail?: string | ApiValidationIssue[];
  };
};

type LoginApiError = {
  response?: ApiErrorResponse;
};

export type MappedLoginUserError = {
  fieldErrors: LoginFormErrors;
  formError: string;
};

const EMPTY_FIELD_ERRORS: LoginFormErrors = {
  email: '',
  password: ''
};

export function createEmptyLoginFieldErrors(): LoginFormErrors {
  return { ...EMPTY_FIELD_ERRORS };
}

export function mapLoginUserError(error: unknown): MappedLoginUserError {
  const response = (error as LoginApiError | undefined)?.response;
  const status = response?.status;
  const detail = response?.data?.detail;

  const mapped: MappedLoginUserError = {
    fieldErrors: createEmptyLoginFieldErrors(),
    formError: 'Could not sign in. Please try again.'
  };

  if (!status) {
    mapped.formError =
      'Could not connect to the server. Check your connection and try again.';
    return mapped;
  }

  if (status === 401) {
    if (detail === 'user is inactive') {
      mapped.formError = 'User is inactive.';
      return mapped;
    }

    mapped.formError = 'Invalid email or password.';
    return mapped;
  }

  if (status === 422 && Array.isArray(detail)) {
    for (const issue of detail) {
      const field = issue?.loc?.[1];
      const message = issue?.msg;

      if (field === 'email') {
        mapped.fieldErrors.email = message || 'Invalid email value.';
      }

      if (field === 'password') {
        mapped.fieldErrors.password = message || 'Invalid password value.';
      }
    }

    if (mapped.fieldErrors.email || mapped.fieldErrors.password) {
      mapped.formError = '';
      return mapped;
    }
  }

  return mapped;
}
