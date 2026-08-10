import type { FormEvent } from 'react';
import type { AuthFieldModel } from '../shared/types.js';

export type LoginFieldName = 'email' | 'password';

export type LoginFormData = {
  email: string;
  password: string;
};

export type LoginFormErrors = Record<LoginFieldName, string>;

export type LoginTouchedState = Record<LoginFieldName, boolean>;

export type LoginInputLimits = Record<LoginFieldName, number>;

export type LoginValidationResult = {
  errors: LoginFormErrors;
  isValid: boolean;
};

export type LoginRequestStatus = 'idle' | 'submitting' | 'success' | 'error';

export type LoginRequestState = {
  status: LoginRequestStatus;
  formError: string;
  fieldErrors: LoginFormErrors;
  successMessage: string;
};

export type LoginFieldModel = AuthFieldModel<LoginFieldName>;

export type LoginFieldModels = {
  emailField: LoginFieldModel;
  passwordField: LoginFieldModel;
};

export type LoginSubmitArgs = {
  formData: LoginFormData;
  isValid: boolean;
};

export type LoginFormHookResult = LoginFieldModels & {
  formProps: {
    onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    'aria-busy': boolean;
  };
  inputLimits: LoginInputLimits;
  formData: LoginFormData;
  requestState: LoginRequestState;
  isSubmitting: boolean;
};
