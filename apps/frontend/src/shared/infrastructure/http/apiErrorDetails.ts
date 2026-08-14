export type ApiValidationIssue = {
  code?: string;
  field?: string;
  loc?: unknown[];
  message?: string;
  msg?: string;
  type?: string;
};

export type ApiDetailObject = {
  code?: string;
  message?: string;
};

export type ApiErrorDetail = string | ApiDetailObject | ApiValidationIssue[] | undefined;

export function readApiDetailCode(detail: ApiErrorDetail): string | null {
  if (typeof detail === 'string') {
    return null;
  }

  if (Array.isArray(detail)) {
    return detail[0]?.code || detail[0]?.type || null;
  }

  return detail?.code || null;
}

export function readApiDetailMessage(detail: ApiErrorDetail): string | null {
  if (typeof detail === 'string') {
    return detail.trim() || null;
  }

  if (Array.isArray(detail)) {
    return detail[0]?.message || detail[0]?.msg || null;
  }

  return detail?.message || null;
}

export function readFirstApiValidationIssue(
  detail: ApiErrorDetail
): ApiValidationIssue | null {
  if (!Array.isArray(detail) || detail.length === 0) {
    return null;
  }

  return detail[0] ?? null;
}
