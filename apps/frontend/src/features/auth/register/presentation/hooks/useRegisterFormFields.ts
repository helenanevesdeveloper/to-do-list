import { useState } from 'react';
import type { ChangeEvent, FocusEvent } from 'react';
import type {
  RegisterFieldName,
  RegisterFormData,
  RegisterInputLimits,
  RegisterTouchedState
} from '../../types.js';
import {
  normalizeRegisterFormData,
  registerInputLimits,
  sanitizeRegisterField
} from '../../domain/inputSanitization.js';
import {
  touchAllFields,
  touchField
} from '../../../shared/presentation/utils/formHelpers.js';

const FIELD_ORDER: RegisterFieldName[] = ['email', 'password', 'confirmPassword'];

type RegisterFieldChangeHandler = (fieldName: RegisterFieldName) => void;

type RegisterFieldEvent = ChangeEvent<HTMLInputElement>;
type RegisterBlurEvent = FocusEvent<HTMLInputElement>;

/**
 * Owns local register form field state and input-level interactions only.
 */
export function useRegisterFormFields(): {
  inputLimits: RegisterInputLimits;
  formData: RegisterFormData;
  touched: RegisterTouchedState;
  isSubmitted: boolean;
  handleChange: (
    event: RegisterFieldEvent,
    onFieldChange?: RegisterFieldChangeHandler
  ) => void;
  handleBlur: (event: RegisterBlurEvent) => void;
  markSubmitted: () => void;
} {
  const inputLimits = registerInputLimits();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [touched, setTouched] = useState<RegisterTouchedState>({
    email: false,
    password: false,
    confirmPassword: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleChange(
    event: RegisterFieldEvent,
    onFieldChange?: RegisterFieldChangeHandler
  ) {
    const { name, value } = event.target;
    const fieldName = name as RegisterFieldName;
    const sanitizedValue = sanitizeRegisterField(fieldName, value);

    setFormData((current: RegisterFormData) => ({
      ...current,
      [fieldName]: sanitizedValue
    }));

    onFieldChange?.(fieldName);
  }

  function handleBlur(event: RegisterBlurEvent) {
    const { name } = event.target;
    const fieldName = name as RegisterFieldName;

    if (fieldName === 'email') {
      setFormData((current: RegisterFormData) => ({
        ...current,
        email: normalizeRegisterFormData(current).email
      }));
    }

    setTouched((current: RegisterTouchedState) =>
      touchField(current, fieldName) as RegisterTouchedState
    );
  }

  function markSubmitted() {
    setIsSubmitted(true);
    setTouched(touchAllFields(FIELD_ORDER) as RegisterTouchedState);
  }

  return {
    inputLimits,
    formData,
    touched,
    isSubmitted,
    handleChange,
    handleBlur,
    markSubmitted
  };
}
