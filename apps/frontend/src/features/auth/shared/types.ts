import type { ChangeEvent, FocusEvent, HTMLAttributes } from 'react';

export type AuthFieldModel<Name extends string> = {
  id: Name;
  name: Name;
  type: string;
  autoComplete: string;
  placeholder: string;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength: number;
  value: string;
  error: string;
  isInvalid: boolean;
  isDisabled: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
};

export type FieldErrors<Name extends string> = Record<Name, string>;
export type TouchedFields<Name extends string> = Record<Name, boolean>;

export type FieldConfig<ModelKey extends string, Name extends string> = {
  modelKey: ModelKey;
  name: Name;
  type: string;
  autoComplete: string;
  placeholder: string;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength: number;
  value: string;
};

export type RequestState<
  Name extends string,
  SuccessFieldName extends string
> = {
  status: 'idle' | 'submitting' | 'success' | 'error';
  formError: string;
  fieldErrors: FieldErrors<Name>;
} & Record<SuccessFieldName, string>;

export type MappedFieldError<Name extends string> = {
  fieldErrors: FieldErrors<Name>;
  formError: string;
};
