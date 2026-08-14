import type { DeleteTaskApiDetail } from './readDeleteTaskApiError';
import {
  readApiDetailMessage
} from '../../../../shared/infrastructure/http/apiErrorDetails';

/** Extracts the first validation message returned by the backend for task deletion. */
export function readDeleteTaskValidationMessage(detail: DeleteTaskApiDetail): string | null {
  return readApiDetailMessage(detail);
}
