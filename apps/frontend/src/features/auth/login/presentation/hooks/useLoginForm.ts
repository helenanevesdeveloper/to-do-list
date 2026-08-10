import type { FormEvent } from 'react';
import type { LoginFormHookResult } from '../../types.js';
import { validateLoginForm } from '../../application/validateLoginForm.js';
import { createLoginFieldModels } from '../state/loginFormState.js';
import { useLoginFormFields } from './useLoginFormFields.js';
import { useLoginSubmission } from './useLoginSubmission.js';
import { useLoginSuccessNavigation } from './useLoginSuccessNavigation.js';

/**
 * Composes login field state, validation, submission, and field view-models
 * into one UI-friendly contract for the login screen.
 */
export function useLoginForm(): LoginFormHookResult {
  const {
    inputLimits,
    formData,
    touched,
    isSubmitted,
    handleChange,
    handleBlur,
    markSubmitted
  } = useLoginFormFields();
  const { requestState, isSubmitting, submit, handleFieldChange } =
    useLoginSubmission();
  const { goToDashboard } = useLoginSuccessNavigation();
  const { errors: validationErrors, isValid } = validateLoginForm(formData);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    markSubmitted();
    const session = await submit({
      formData,
      isValid
    });

    if (session) {
      goToDashboard();
    }
  }

  const fieldModels = createLoginFieldModels({
    inputLimits,
    formData,
    touched,
    isSubmitted,
    validationErrors,
    serverErrors: requestState.fieldErrors,
    isSubmitting,
    handleChange: (event) => handleChange(event, handleFieldChange),
    handleBlur
  });

  return {
    formProps: {
      onSubmit: handleSubmit,
      'aria-busy': isSubmitting
    },
    inputLimits,
    formData,
    requestState,
    isSubmitting,
    ...fieldModels
  };
}
