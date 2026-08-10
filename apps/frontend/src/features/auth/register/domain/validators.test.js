import { describe, expect, it } from 'vitest';
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validatePasswordMessages
} from './validators.js';

describe('validateEmail', () => {
  it('returns required message for empty email', () => {
    expect(validateEmail('')).toBe('Email is required.');
  });

  it('returns invalid format message', () => {
    expect(validateEmail('invalid-email')).toBe('Enter a valid email address.');
  });

  it('accepts valid email', () => {
    expect(validateEmail('USER@example.com')).toBe('');
  });
});

describe('validatePassword', () => {
  it('returns required message for empty password', () => {
    expect(validatePassword('')).toBe('Password is required.');
    expect(validatePasswordMessages('')).toEqual(['Password is required.']);
  });

  it('aggregates minimum length and character class errors', () => {
    expect(validatePasswordMessages('abc')).toEqual([
      'Password must be at least 8 characters long.',
      'Password must contain at least one uppercase letter.',
      'Password must contain at least one digit.'
    ]);
    expect(validatePassword('Abc123')).toBe(
      'Password must be at least 8 characters long.'
    );
    expect(validatePassword('lowercase1')).toBe(
      'Password must contain at least one uppercase letter.'
    );
    expect(validatePassword('UPPERCASE1')).toBe(
      'Password must contain at least one lowercase letter.'
    );
    expect(validatePassword('NoDigitsHere')).toBe(
      'Password must contain at least one digit.'
    );
  });

  it('accepts strong password', () => {
    expect(validatePassword('StrongPass1')).toBe('');
    expect(validatePasswordMessages('StrongPass1')).toEqual([]);
  });
});

describe('validateConfirmPassword', () => {
  it('requires confirm password', () => {
    expect(validateConfirmPassword('StrongPass1', '')).toBe(
      'Please confirm your password.'
    );
  });

  it('requires both passwords to match', () => {
    expect(validateConfirmPassword('StrongPass1', 'StrongPass2')).toBe(
      'Passwords do not match.'
    );
  });

  it('accepts matching passwords', () => {
    expect(validateConfirmPassword('StrongPass1', 'StrongPass1')).toBe('');
  });
});
