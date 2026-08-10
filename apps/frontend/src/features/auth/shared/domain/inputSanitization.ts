const MAX_EMAIL_LENGTH = 254;
const MAX_PASSWORD_LENGTH = 128;

function stripUnsafeCharacters(value: string): string {
  // Intentional: strip null bytes from user input.
  // eslint-disable-next-line no-control-regex
  return value.replace(/\u0000/g, '').replace(/\r?\n/g, '');
}

function clampLength(value: string, maxLength: number): string {
  return value.slice(0, maxLength);
}

export function sanitizeEmailInput(rawValue: string | null | undefined): string {
  const safeValue = stripUnsafeCharacters(rawValue ?? '');
  return clampLength(safeValue.toLowerCase(), MAX_EMAIL_LENGTH);
}

export function sanitizePasswordInput(rawValue: string | null | undefined): string {
  const safeValue = stripUnsafeCharacters(rawValue ?? '');
  return clampLength(safeValue, MAX_PASSWORD_LENGTH);
}

export function authInputLimits(): { email: number; password: number } {
  return {
    email: MAX_EMAIL_LENGTH,
    password: MAX_PASSWORD_LENGTH
  };
}
