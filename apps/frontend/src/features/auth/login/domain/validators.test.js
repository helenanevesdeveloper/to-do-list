import { describe, expect, it } from 'vitest';
import { validateLoginEmail, validateLoginPassword } from './validators.js';

describe('validateLoginEmail', () => {
  it('returns required message for empty email', () => {
    expect(validateLoginEmail('')).toBe('Email is required.');
  });

  it('returns invalid format message', () => {
    expect(validateLoginEmail('invalid-email')).toBe(
      'Enter a valid email address.'
    );
  });

  it('accepts valid email', () => {
    expect(validateLoginEmail('USER@example.com')).toBe('');
  });
});

describe('validateLoginPassword', () => {
  it('returns required message for empty password', () => {
    expect(validateLoginPassword('')).toBe('Password is required.');
  });

  it('accepts a non-empty password', () => {
    expect(validateLoginPassword('any-value')).toBe('');
  });
});
