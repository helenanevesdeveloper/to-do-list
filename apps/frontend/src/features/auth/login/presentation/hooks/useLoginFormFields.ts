import { useState } from 'react';
import type { ChangeEvent, FocusEvent } from 'react';
import type {
  LoginFieldName,
  LoginFormData,
  LoginInputLimits,
  LoginTouchedState
} from '../../types.js';
import {
  loginInputLimits,
  normalizeLoginFormData,
  sanitizeLoginField
} from '../../domain/inputSanitization.js';
import {
  touchAllFields,
  touchField
} from '../../../shared/presentation/utils/formHelpers.js';

const FIELD_ORDER: LoginFieldName[] = ['email', 'password'];

type LoginFieldChangeHandler = (fieldName: LoginFieldName) => void;

type LoginFieldEvent = ChangeEvent<HTMLInputElement>;
type LoginBlurEvent = FocusEvent<HTMLInputElement>;

/**
 * Owns local login form field state and input-level interactions only.
 */
export function useLoginFormFields(): {
  inputLimits: LoginInputLimits;
  formData: LoginFormData;
  touched: LoginTouchedState;
  isSubmitted: boolean;
  handleChange: (
    event: LoginFieldEvent,
    onFieldChange?: LoginFieldChangeHandler
  ) => void;
  handleBlur: (event: LoginBlurEvent) => void;
  markSubmitted: () => void;
} {
  const inputLimits = loginInputLimits();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [touched, setTouched] = useState<LoginTouchedState>({
    email: false,
    password: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleChange(
    event: LoginFieldEvent,
    onFieldChange?: LoginFieldChangeHandler
  ) {
    const { name, value } = event.target;
    const fieldName = name as LoginFieldName;
    const sanitizedValue = sanitizeLoginField(fieldName, value);

    setFormData((current: LoginFormData) => ({
      ...current,
      [fieldName]: sanitizedValue
    }));

    onFieldChange?.(fieldName);
  }

  function handleBlur(event: LoginBlurEvent) {
    const { name } = event.target;
    const fieldName = name as LoginFieldName;

    if (fieldName === 'email') {
      setFormData((current: LoginFormData) => ({
        ...current,
        email: normalizeLoginFormData(current).email
      }));
    }

    setTouched((current: LoginTouchedState) =>
      touchField(current, fieldName) as LoginTouchedState
    );
  }

  function markSubmitted() {
    setIsSubmitted(true);
    setTouched(touchAllFields(FIELD_ORDER) as LoginTouchedState);
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
