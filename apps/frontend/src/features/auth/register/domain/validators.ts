const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export function validateEmail(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return 'Email is required.';
  }
  if (!EMAIL_PATTERN.test(normalized)) {
    return 'Enter a valid email address.';
  }
  return '';
}

export function validatePassword(value: string): string {
  return validatePasswordMessages(value)[0] || '';
}

export function validatePasswordMessages(value: string): string[] {
  if (!value) {
    return ['Password is required.'];
  }
  const errors: string[] = []
  if (value.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }
  if (!/[A-Z]/.test(value)) {
    errors.push('Password must contain at least one uppercase letter.');
  }
  if (!/[a-z]/.test(value)) {
    errors.push('Password must contain at least one lowercase letter.');
  }
  if (!/[0-9]/.test(value)) {
    errors.push('Password must contain at least one digit.');
  }
  return errors;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): string {
  if (!confirmPassword) {
    return 'Please confirm your password.';
  }
  if (confirmPassword !== password) {
    return 'Passwords do not match.';
  }
  return '';
}
