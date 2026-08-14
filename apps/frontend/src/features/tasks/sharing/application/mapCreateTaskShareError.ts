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

type CreateTaskShareApiError = {
  response?: ApiErrorResponse;
};

function mapCreateTaskShareValidationCode(code: string | null): string | null {
  if (code === 'shared_user_not_found') {
    return 'O usuario informado nao existe.';
  }

  if (code === 'task_share_already_exists') {
    return 'Este email ja possui acesso a esta tarefa.';
  }

  if (code === 'task_share_recipient_is_owner') {
    return 'O proprietario da tarefa ja aparece na lista de acesso.';
  }

  return null;
}

/** Maps backend task-share creation failures into short user-facing messages. */
export function mapCreateTaskShareError(error: unknown): string {
  const response = (error as CreateTaskShareApiError | undefined)?.response;
  const status = response?.status;
  const detail = response?.data?.detail;
  const validationCode = readApiDetailCode(detail);
  const validationMessage = readApiDetailMessage(detail);

  if (!status) {
    return 'Nao foi possivel conectar ao servidor para compartilhar a tarefa.';
  }

  if (status === 400 || status === 422) {
    return (
      mapCreateTaskShareValidationCode(validationCode) ||
      validationMessage ||
      'Nao foi possivel compartilhar a tarefa com os dados informados.'
    );
  }

  if (status === 403) {
    return 'Voce nao tem permissao para compartilhar esta tarefa.';
  }

  if (status === 404) {
    return 'A tarefa ou a pessoa informada nao foi encontrada.';
  }

  return 'Nao foi possivel compartilhar a tarefa.';
}
