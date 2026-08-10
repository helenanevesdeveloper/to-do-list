import type { FormEvent } from 'react';
import type { AuthFieldModel } from '../shared/types.js';

export type RegisterFieldName = 'email' | 'password' | 'confirmPassword';

export type RegisterFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegisterFormErrorMessages = Record<RegisterFieldName, string[]>;

export type RegisterTouchedState = Record<RegisterFieldName, boolean>;

export type RegisterInputLimits = {
  email: number;
  password: number;
};

export type RegisterValidationResult = {
  errorMessages: RegisterFormErrorMessages;
  isValid: boolean;
};

export type RegisterRequestStatus = 'idle' | 'submitting' | 'success' | 'error';

export type RegisterRequestState = {
  status: RegisterRequestStatus;
  formError: string;
  fieldErrorMessages: RegisterFormErrorMessages;
  successEmail: string;
};

export type RegisterFieldModel = AuthFieldModel<RegisterFieldName> & {
  errorMessages: string[];
};

export type RegisterFieldModels = {
  emailField: RegisterFieldModel;
  passwordField: RegisterFieldModel;
  confirmPasswordField: RegisterFieldModel;
};

export type RegisterSubmitArgs = {
  formData: RegisterFormData;
  isValid: boolean;
  validationErrorMessages: RegisterFormErrorMessages;
  onSuccess?: (email: string) => void;
};

export type RegisterFormHookResult = RegisterFieldModels & {
  isSuccess: boolean;
  successEmail: string;
  redirectCountdown: number;
  goToHome: () => void;
  formProps: {
    onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    'aria-busy': boolean;
  };
  inputLimits: RegisterInputLimits;
  formData: RegisterFormData;
  requestState: RegisterRequestState;
  isSubmitting: boolean;
};
