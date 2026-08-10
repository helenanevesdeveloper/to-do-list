import { describe, expect, it } from 'vitest';
import {
  createEmptyFieldErrorMessages,
  mapRegisterUserError
} from './mapRegisterUserError.js';

describe('mapRegisterUserError', () => {
  it('maps network error to generic form error', () => {
    const mapped = mapRegisterUserError(new Error('Network error'));

    expect(mapped.fieldErrorMessages).toEqual(createEmptyFieldErrorMessages());
    expect(mapped.formError).toBe(
      'Could not connect to the server. Check your connection and try again.'
    );
  });

  it('maps 409 to email field error', () => {
    const mapped = mapRegisterUserError({
      response: {
        status: 409,
        data: {
          detail: 'user with this email already exists'
        }
      }
    });

    expect(mapped.fieldErrorMessages.email).toEqual([
      'This email is already registered.'
    ]);
    expect(mapped.formError).toBe('');
  });

  it('maps 400 password issue list to password field errors', () => {
    const mapped = mapRegisterUserError({
      response: {
        status: 400,
        data: {
          detail: [
            {
              field: 'password',
              message: 'password must be at least 8 characters long'
            },
            {
              field: 'password',
              message: 'password must contain at least one uppercase letter'
            }
          ]
        }
      }
    });

    expect(mapped.fieldErrorMessages.password).toEqual([
      'password must be at least 8 characters long',
      'password must contain at least one uppercase letter'
    ]);
    expect(mapped.formError).toBe('');
  });

  it('maps 422 validation detail by field location', () => {
    const mapped = mapRegisterUserError({
      response: {
        status: 422,
        data: {
          detail: [
            {
              loc: ['body', 'email'],
              msg: 'value is not a valid email address'
            }
          ]
        }
      }
    });

    expect(mapped.fieldErrorMessages.email).toEqual([
      'value is not a valid email address'
    ]);
    expect(mapped.formError).toBe('');
  });
});
