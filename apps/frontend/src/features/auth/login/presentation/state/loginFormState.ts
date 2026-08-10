import type {
  LoginFieldModels,
  LoginFormData,
  LoginFormErrors,
  LoginInputLimits,
  LoginRequestState,
  LoginTouchedState
} from '../../types.js';
import { createEmptyLoginFieldErrors } from '../../application/mapLoginUserError.js';
import {
  createFieldModels,
  createRequestStateFactory
} from '../../../shared/presentation/state/formState.js';

type CreateLoginFieldModelsArgs = {
  inputLimits: LoginInputLimits;
  formData: LoginFormData;
  touched: LoginTouchedState;
  isSubmitted: boolean;
  validationErrors: LoginFormErrors;
  serverErrors: LoginFormErrors;
  isSubmitting: boolean;
  handleChange: LoginFieldModels['emailField']['onChange'];
  handleBlur: LoginFieldModels['emailField']['onBlur'];
};

const requestStateFactory = createRequestStateFactory({
  createEmptyFieldErrors: createEmptyLoginFieldErrors,
  successFieldName: 'successMessage'
}) as {
  createIdleRequestState: () => LoginRequestState;
  createSubmittingRequestState: () => LoginRequestState;
  createSuccessRequestState: (successValue: string) => LoginRequestState;
  createErrorRequestState: (mappedError: {
    formError: string;
    fieldErrors: LoginFormErrors;
  }) => LoginRequestState;
  updateRequestStateForFieldChange: (
    currentRequestState: LoginRequestState,
    fieldName: keyof LoginFormErrors
  ) => LoginRequestState;
};

export const {
  createIdleRequestState,
  createSubmittingRequestState,
  createSuccessRequestState,
  createErrorRequestState,
  updateRequestStateForFieldChange
} = requestStateFactory;

/**
 * Builds the login field view-models consumed by presentation components.
 */
export function createLoginFieldModels({
  inputLimits,
  formData,
  touched,
  isSubmitted,
  validationErrors,
  serverErrors,
  isSubmitting,
  handleChange,
  handleBlur
}: CreateLoginFieldModelsArgs): LoginFieldModels {
  return createFieldModels({
    fieldConfigs: [
      {
        modelKey: 'emailField',
        name: 'email',
        type: 'email',
        autoComplete: 'email',
        placeholder: 'you@example.com',
        inputMode: 'email',
        maxLength: inputLimits.email,
        value: formData.email
      },
      {
        modelKey: 'passwordField',
        name: 'password',
        type: 'password',
        autoComplete: 'current-password',
        placeholder: 'Enter your password',
        maxLength: inputLimits.password,
        value: formData.password
      }
    ],
    validationErrors,
    serverErrors,
    touched,
    isSubmitted,
    isSubmitting,
    handleChange,
    handleBlur
  }) as LoginFieldModels;
}
