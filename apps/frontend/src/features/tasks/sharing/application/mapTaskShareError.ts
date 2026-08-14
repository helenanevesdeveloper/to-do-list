import type { ApiErrorDetail } from '../../../../shared/infrastructure/http/apiErrorDetails';
import { readApiDetailMessage } from '../../../../shared/infrastructure/http/apiErrorDetails';

type ApiErrorResponse = {
  status?: number;
  data?: {
    detail?: ApiErrorDetail;
  };
};

type TaskShareApiError = {
  response?: ApiErrorResponse;
};

/** Maps task-sharing failures into short user-facing messages. */
export function mapTaskShareError(error: unknown): string {
  const response = (error as TaskShareApiError | undefined)?.response;
  const status = response?.status;
  const validationMessage = readApiDetailMessage(response?.data?.detail);

  if (!status) {
    return 'Nao foi possivel conectar ao servidor para carregar os compartilhamentos.';
  }

  if (status === 400 || status === 422) {
    return (
      validationMessage ||
      'Nao foi possivel carregar os compartilhamentos com os dados informados.'
    );
  }

  if (status === 403) {
    return 'Voce nao tem permissao para visualizar os compartilhamentos desta tarefa.';
  }

  if (status === 404) {
    return 'A tarefa nao foi encontrada ou nao esta mais disponivel.';
  }

  return 'Nao foi possivel carregar os compartilhamentos.';
}
