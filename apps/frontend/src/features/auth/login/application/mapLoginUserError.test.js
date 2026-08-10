import { describe, expect, it } from 'vitest';
import {
  createEmptyLoginFieldErrors,
  mapLoginUserError
} from './mapLoginUserError.js';

describe('createEmptyLoginFieldErrors', () => {
  it('returns a clean field error object', () => {
    expect(createEmptyLoginFieldErrors()).toEqual({
      email: '',
      password: ''
    });
  });
});

describe('mapLoginUserError', () => {
  it('maps network failures to a form error', () => {
    expect(mapLoginUserError({})).toEqual({
      fieldErrors: {
        email: '',
        password: ''
      },
      formError:
        'Could not connect to the server. Check your connection and try again.'
    });
  });

  it('maps invalid credentials to a form error', () => {
    expect(
      mapLoginUserError({
        response: {
          status: 401,
          data: {
            detail: 'invalid credentials'
          }
        }
      })
    ).toEqual({
      fieldErrors: {
        email: '',
        password: ''
      },
      formError: 'Invalid email or password.'
    });
  });

  it('maps inactive users to a specific form error', () => {
    expect(
      mapLoginUserError({
        response: {
          status: 401,
          data: {
            detail: 'user is inactive'
          }
        }
      })
    ).toEqual({
      fieldErrors: {
        email: '',
        password: ''
      },
      formError: 'User is inactive.'
    });
  });

  it('maps 422 field validation errors', () => {
    expect(
      mapLoginUserError({
        response: {
          status: 422,
          data: {
            detail: [
              {
                loc: ['body', 'email'],
                msg: 'value is not a valid email address'
              },
              {
                loc: ['body', 'password'],
                msg: 'field required'
              }
            ]
          }
        }
      })
    ).toEqual({
      fieldErrors: {
        email: 'value is not a valid email address',
        password: 'field required'
      },
      formError: ''
    });
  });
});
