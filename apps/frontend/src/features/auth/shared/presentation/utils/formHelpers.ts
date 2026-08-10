import type { FieldErrors, TouchedFields } from '../../types.js';
import { focusElementById } from '../platform/browserApi.js';

/** Returns the first field name that currently has an error. */
export function firstInvalidField<Name extends string>(
  fieldOrder: readonly Name[],
  errors: FieldErrors<Name>
): Name | undefined {
  return fieldOrder.find((field) => Boolean(errors[field]));
}

/** Focuses the DOM element that corresponds to the provided field name. */
export function focusField(fieldName: string | undefined): void {
  focusElementById(fieldName);
}

/** Focuses the first invalid field according to the provided field order. */
export function focusFirstInvalidField<Name extends string>(
  fieldOrder: readonly Name[],
  errors: FieldErrors<Name>
): void {
  focusField(firstInvalidField(fieldOrder, errors));
}

/** Marks a single field as touched without mutating the original object. */
export function touchField<Name extends string>(
  currentTouched: TouchedFields<Name>,
  fieldName: Name
): TouchedFields<Name> {
  return {
    ...currentTouched,
    [fieldName]: true
  };
}

/** Marks all fields as touched from a given field order list. */
export function touchAllFields<Name extends string>(
  fieldOrder: readonly Name[]
): TouchedFields<Name> {
  return Object.fromEntries(
    fieldOrder.map((fieldName) => [fieldName, true])
  ) as TouchedFields<Name>;
}

/** Clears a single field error without mutating the original error object. */
export function clearFieldError<Name extends string>(
  currentErrors: FieldErrors<Name>,
  fieldName: Name
): FieldErrors<Name> {
  return {
    ...currentErrors,
    [fieldName]: ''
  };
}
