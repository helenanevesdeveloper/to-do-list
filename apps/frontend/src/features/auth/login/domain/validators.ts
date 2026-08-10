const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export function validateLoginEmail(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return 'Email is required.';
  }
  if (!EMAIL_PATTERN.test(normalized)) {
    return 'Enter a valid email address.';
  }
  return '';
}

export function validateLoginPassword(value: string): string {
  if (!value) {
    return 'Password is required.';
  }
  return '';
}
