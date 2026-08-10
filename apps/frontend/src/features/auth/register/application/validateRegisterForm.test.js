import { describe, expect, it } from 'vitest';
import { validateRegisterForm } from './validateRegisterForm.js';

describe('validateRegisterForm', () => {
  it('returns invalid with field errors when form is incorrect', () => {
    const result = validateRegisterForm({
      email: 'bad-email',
      password: 'abc',
      confirmPassword: 'xyz'
    });

    expect(result.isValid).toBe(false);
    expect(result.errorMessages.email).toEqual([
      'Enter a valid email address.'
    ]);
    expect(result.errorMessages.password).toEqual([
      'Password must be at least 8 characters long.',
      'Password must contain at least one uppercase letter.',
      'Password must contain at least one digit.'
    ]);
    expect(result.errorMessages.confirmPassword).toEqual([
      'Passwords do not match.'
    ]);
  });

  it('returns valid and empty errors when form is correct', () => {
    const result = validateRegisterForm({
      email: 'user@example.com',
      password: 'StrongPass1',
      confirmPassword: 'StrongPass1'
    });

    expect(result).toEqual({
      isValid: true,
      errorMessages: {
        email: [],
        password: [],
        confirmPassword: []
      }
    });
  });
});
