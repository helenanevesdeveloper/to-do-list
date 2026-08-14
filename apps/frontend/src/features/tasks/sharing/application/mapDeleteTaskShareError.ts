import type { ApiErrorDetail } from '../../../../shared/infrastructure/http/apiErrorDetails';
import {
  readApiDetailCode,
  readApiDetailMessage
} from '../../../../shared/infrastructure/http/apiErrorDetails';

type ApiErrorResponse = {
  status?: number;
  data?: {
    detail?: ApiErrorDetail;
  };
};

type DeleteTaskShareApiError = {
  response?: ApiErrorResponse;
};

function mapDeleteTaskShareValidationCode(code: string | null): string | null {
  if (code === 'task_share_not_found') {
    return 'Este acesso nao foi encontrado ou ja foi removido.';
  }

  return null;
}

/** Maps backend task-share deletion failures into short user-facing messages. */
export function mapDeleteTaskShareError(error: unknown): string {
  const response = (error as DeleteTaskShareApiError | undefined)?.response;
  const status = response?.status;
  const detail = response?.data?.detail;

  if (!status) {
    return 'Nao foi possivel conectar ao servidor para remover o acesso.';
  }

  if (status === 400 || status === 422) {
    return (
      mapDeleteTaskShareValidationCode(readApiDetailCode(detail)) ||
      readApiDetailMessage(detail) ||
      'Nao foi possivel remover o acesso com os dados informados.'
    );
  }

  if (status === 403) {
    return 'Voce nao tem permissao para remover este acesso.';
  }

  if (status === 404) {
    return 'Este acesso nao foi encontrado ou ja foi removido.';
  }

  return 'Nao foi possivel remover o acesso.';
}
