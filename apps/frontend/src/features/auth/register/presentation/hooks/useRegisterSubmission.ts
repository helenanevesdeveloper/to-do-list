import { useState } from 'react';
import type {
  RegisterFieldName,
  RegisterRequestState,
  RegisterSubmitArgs
} from '../../types.js';
import { mapRegisterUserError } from '../../application/mapRegisterUserError.js';
import { registerUser } from '../../application/registerUser.js';
import { focusFirstInvalidField } from '../../../shared/presentation/utils/formHelpers.js';
import {
  createErrorRequestState,
  createIdleRequestState,
  createSubmittingRequestState,
  createSuccessRequestState,
  updateRequestStateForFieldChange
} from '../state/registerFormState.js';

const FIELD_ORDER: RegisterFieldName[] = ['email', 'password', 'confirmPassword'];

function firstErrorsFromMessages(messages: Record<RegisterFieldName, string[]>) {
  return {
    email: messages.email[0] || '',
    password: messages.password[0] || '',
    confirmPassword: messages.confirmPassword[0] || ''
  };
}

/**
 * Owns the register request lifecycle, error mapping, and invalid-field focus.
 */
export function useRegisterSubmission(): {
  requestState: RegisterRequestState;
  isSubmitting: boolean;
  submit: (args: RegisterSubmitArgs) => Promise<void>;
  handleFieldChange: (fieldName: RegisterFieldName) => void;
} {
  const [requestState, setRequestState] = useState<RegisterRequestState>(
    createIdleRequestState()
  );

  async function submit({
    formData,
    isValid,
    validationErrorMessages,
    onSuccess
  }: RegisterSubmitArgs) {
    const isSubmitting = requestState.status === 'submitting';
    if (isSubmitting) {
      return;
    }

    setRequestState(createIdleRequestState());

    if (!isValid) {
      focusFirstInvalidField(
        FIELD_ORDER,
        firstErrorsFromMessages(validationErrorMessages)
      );
      return;
    }

    setRequestState(createSubmittingRequestState());
    try {
      const result = await registerUser(formData);
      setRequestState(createSuccessRequestState(result.email));
      onSuccess?.(result.email);
    } catch (error) {
      const mappedError = mapRegisterUserError(error);
      setRequestState(createErrorRequestState(mappedError));
      focusFirstInvalidField(
        FIELD_ORDER,
        firstErrorsFromMessages(mappedError.fieldErrorMessages)
      );
    }
  }

  function handleFieldChange(fieldName: RegisterFieldName) {
    setRequestState((current: RegisterRequestState) =>
      updateRequestStateForFieldChange(current, fieldName)
    );
  }

  return {
    requestState,
    isSubmitting: requestState.status === 'submitting',
    submit,
    handleFieldChange
  };
}
