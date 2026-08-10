import { useState } from 'react';
import type { LoginFieldName, LoginRequestState, LoginSubmitArgs } from '../../types.js';
import { loginUser } from '../../application/loginUser.js';
import { mapLoginUserError } from '../../application/mapLoginUserError.js';
import { useAuth } from '../../../session/presentation/hooks/useAuth.js';
import {
  createErrorRequestState,
  createIdleRequestState,
  createSubmittingRequestState,
  createSuccessRequestState,
  updateRequestStateForFieldChange
} from '../state/loginFormState.js';

/**
 * Owns the login request lifecycle and request-state transitions.
 */
export function useLoginSubmission(): {
  requestState: LoginRequestState;
  isSubmitting: boolean;
  submit: ({ formData, isValid }: LoginSubmitArgs) => Promise<unknown | null>;
  handleFieldChange: (fieldName: LoginFieldName) => void;
} {
  const { setSessionFromLogin } = useAuth();
  const [requestState, setRequestState] = useState<LoginRequestState>(
    createIdleRequestState()
  );

  async function submit({ formData, isValid }: LoginSubmitArgs) {
    const isSubmitting = requestState.status === 'submitting';
    if (isSubmitting) {
      return null;
    }

    setRequestState(createIdleRequestState());

    if (!isValid) {
      return null;
    }

    setRequestState(createSubmittingRequestState());
    try {
      const result = await loginUser(formData);
      const session = setSessionFromLogin(result);

      if (!session) {
        throw new Error('Could not sign in. Invalid session payload returned.');
      }

      setRequestState(
        createSuccessRequestState('Login request completed successfully.')
      );
      return session;
    } catch (error) {
      const mappedError = mapLoginUserError(error);
      setRequestState(createErrorRequestState(mappedError));
      return null;
    }
  }

  function handleFieldChange(fieldName: LoginFieldName) {
    setRequestState((current: LoginRequestState) =>
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
