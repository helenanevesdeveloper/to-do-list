type ApiValidationIssue = {
  message?: string;
  msg?: string;
};

export type DeleteTaskApiDetail = string | ApiValidationIssue[] | undefined;

type ApiErrorResponse = {
  status?: number;
  data?: {
    detail?: DeleteTaskApiDetail;
  };
};

type DeleteTaskApiError = {
  response?: ApiErrorResponse;
};

/** Reads the response metadata exposed by the HTTP client for task-deletion failures. */
export function readDeleteTaskApiError(error: unknown): ApiErrorResponse | null {
  return (error as DeleteTaskApiError | undefined)?.response ?? null;
}
