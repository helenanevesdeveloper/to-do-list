import {
  type ApiErrorDetail,
  readApiDetailCode,
  readFirstApiValidationIssue
} from '../../../../shared/infrastructure/http/apiErrorDetails';

type ApiErrorResponse = {
  status?: number;
  data?: {
    detail?: import('../../../../shared/infrastructure/http/apiErrorDetails').ApiErrorDetail;
  };
};

type UpdateTaskApiError = {
  response?: ApiErrorResponse;
};

function mapValidationError(detail: ApiErrorDetail): string {
  const issue = readFirstApiValidationIssue(detail);
  const code = readApiDetailCode(detail);

  if (code === 'task_category_not_owned') {
    return 'Selecione uma categoria que pertença a voce.';
  }

  return (
    issue?.message ||
    issue?.msg ||
    'Nao foi possivel salvar a tarefa com os dados informados.'
  );
}

/** Maps backend task-update failures into short inline messages for the edit row. */
export function mapUpdateTaskError(error: unknown): string {
  const response = (error as UpdateTaskApiError | undefined)?.response;
  const status = response?.status;
  const detail = response?.data?.detail;

  if (!status) {
    return 'Nao foi possivel conectar ao servidor para atualizar a tarefa.';
  }

  if ((status === 400 || status === 422) && Array.isArray(detail) && detail.length > 0) {
    return mapValidationError(detail);
  }

  if (status === 404) {
    return 'Nao foi possivel encontrar a tarefa para atualiza-la.';
  }

  return 'Nao foi possivel atualizar a tarefa.';
}
