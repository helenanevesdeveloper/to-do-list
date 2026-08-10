import type { FormEvent } from 'react';
import type { RegisterFormHookResult } from '../../types.js';
import { validateRegisterForm } from '../../application/validateRegisterForm.js';
import { createRegisterFieldModels } from '../state/registerFormState.js';
import { useRegisterFormFields } from './useRegisterFormFields.js';
import { useRegisterSubmission } from './useRegisterSubmission.js';
import { useRegisterSuccessNavigation } from './useRegisterSuccessNavigation.js';

/**
 * Composes register field state, validation, submission, success navigation,
 * and field view-models into one UI-facing contract.
 */
export function useRegisterForm(): RegisterFormHookResult {
  const {
    inputLimits,
    formData,
    touched,
    isSubmitted,
    handleChange,
    handleBlur,
    markSubmitted
  } = useRegisterFormFields();
  const { requestState, isSubmitting, submit, handleFieldChange } =
    useRegisterSubmission();
  const {
    errorMessages: validationErrorMessages,
    isValid
  } = validateRegisterForm(formData);
  const successEmail = requestState.successEmail;
  const { redirectCountdown, restartCountdown, goToHome } =
    useRegisterSuccessNavigation(successEmail);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    markSubmitted();
    await submit({
      formData,
      isValid,
      validationErrorMessages,
      onSuccess: restartCountdown
    });
  }

  const fieldModels = createRegisterFieldModels({
    inputLimits,
    formData,
    touched,
    isSubmitted,
    validationErrorMessages,
    serverErrorMessages: requestState.fieldErrorMessages,
    isSubmitting,
    handleChange: (event) => handleChange(event, handleFieldChange),
    handleBlur
  });

  return {
    isSuccess: Boolean(successEmail),
    successEmail,
    redirectCountdown,
    goToHome,
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
