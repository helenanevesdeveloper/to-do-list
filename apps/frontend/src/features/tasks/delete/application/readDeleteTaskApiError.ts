import type { ApiErrorDetail } from '../../../../shared/infrastructure/http/apiErrorDetails';

export type DeleteTaskApiDetail = ApiErrorDetail;

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
