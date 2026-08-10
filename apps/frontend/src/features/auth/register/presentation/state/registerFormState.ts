import type {
  RegisterFieldModel,
  RegisterFieldModels,
  RegisterFormData,
  RegisterFormErrorMessages,
  RegisterInputLimits,
  RegisterRequestState,
  RegisterTouchedState
} from '../../types.js';
import { createEmptyFieldErrorMessages } from '../../application/mapRegisterUserError.js';
import { createFieldModels } from '../../../shared/presentation/state/formState.js';

type CreateRegisterFieldModelsArgs = {
  inputLimits: RegisterInputLimits;
  formData: RegisterFormData;
  touched: RegisterTouchedState;
  isSubmitted: boolean;
  validationErrorMessages: RegisterFormErrorMessages;
  serverErrorMessages: RegisterFormErrorMessages;
  isSubmitting: boolean;
  handleChange: RegisterFieldModels['emailField']['onChange'];
  handleBlur: RegisterFieldModels['emailField']['onBlur'];
};

export function createIdleRequestState(): RegisterRequestState {
  return {
    status: 'idle',
    formError: '',
    fieldErrorMessages: createEmptyFieldErrorMessages(),
    successEmail: ''
  };
}

export function createSubmittingRequestState(): RegisterRequestState {
  return {
    ...createIdleRequestState(),
    status: 'submitting'
  };
}

export function createSuccessRequestState(
  successValue: string
): RegisterRequestState {
  return {
    ...createIdleRequestState(),
    status: 'success',
    successEmail: successValue
  };
}

export function createErrorRequestState(mappedError: {
  formError: string;
  fieldErrorMessages: RegisterFormErrorMessages;
}): RegisterRequestState {
  return {
    ...createIdleRequestState(),
    status: 'error',
    formError: mappedError.formError,
    fieldErrorMessages: mappedError.fieldErrorMessages
  };
}

export function updateRequestStateForFieldChange(
  currentRequestState: RegisterRequestState,
  fieldName: keyof RegisterFormErrorMessages
): RegisterRequestState {
  return {
    ...currentRequestState,
    status:
      currentRequestState.status === 'error'
        ? 'idle'
        : currentRequestState.status,
    formError: '',
    successEmail: '',
    fieldErrorMessages: {
      ...currentRequestState.fieldErrorMessages,
      [fieldName]: []
    }
  };
}

/**
 * Builds the register field view-models consumed by presentation components.
 */
export function createRegisterFieldModels({
  inputLimits,
  formData,
  touched,
  isSubmitted,
  validationErrorMessages,
  serverErrorMessages,
  isSubmitting,
  handleChange,
  handleBlur
}: CreateRegisterFieldModelsArgs): RegisterFieldModels {
  const validationErrors = {
    email: validationErrorMessages.email[0] || '',
    password: validationErrorMessages.password[0] || '',
    confirmPassword: validationErrorMessages.confirmPassword[0] || ''
  };
  const serverErrors = {
    email: serverErrorMessages.email[0] || '',
    password: serverErrorMessages.password[0] || '',
    confirmPassword: serverErrorMessages.confirmPassword[0] || ''
  };
  const baseFields = createFieldModels({
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
        autoComplete: 'new-password',
        placeholder: 'Enter your password',
        maxLength: inputLimits.password,
        value: formData.password
      },
      {
        modelKey: 'confirmPasswordField',
        name: 'confirmPassword',
        type: 'password',
        autoComplete: 'new-password',
        placeholder: 'Re-enter your password',
        maxLength: inputLimits.password,
        value: formData.confirmPassword
      }
    ],
    validationErrors,
    serverErrors,
    touched,
    isSubmitted,
    isSubmitting,
    handleChange,
    handleBlur
  }) as Record<keyof RegisterFieldModels, RegisterFieldModel>;

  const errorMessagesByField: Record<keyof RegisterFieldModels, string[]> = {
    emailField: validationErrorMessages.email.length
      ? validationErrorMessages.email
      : serverErrorMessages.email,
    passwordField: validationErrorMessages.password.length
      ? validationErrorMessages.password
      : serverErrorMessages.password,
    confirmPasswordField: validationErrorMessages.confirmPassword.length
      ? validationErrorMessages.confirmPassword
      : serverErrorMessages.confirmPassword
  };

  return Object.fromEntries(
    Object.entries(baseFields).map(([key, field]) => [
      key,
      {
        ...field,
        errorMessages: errorMessagesByField[key as keyof RegisterFieldModels]
      }
    ])
  ) as RegisterFieldModels;
}
