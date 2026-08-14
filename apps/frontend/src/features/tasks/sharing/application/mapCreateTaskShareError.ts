type ApiValidationIssue = {
  message?: string;
  msg?: string;
};

type ApiErrorResponse = {
  status?: number;
  data?: {
    detail?: string | ApiValidationIssue[];
  };
};

type CreateTaskShareApiError = {
  response?: ApiErrorResponse;
};

function readValidationMessage(detail: string | ApiValidationIssue[] | undefined): string | null {
  if (typeof detail === 'string' && detail.trim()) {
    return detail;
  }

  if (!Array.isArray(detail) || detail.length === 0) {
    return null;
  }

  return detail[0]?.message || detail[0]?.msg || null;
}

/** Maps backend task-share creation failures into short user-facing messages. */
export function mapCreateTaskShareError(error: unknown): string {
  const response = (error as CreateTaskShareApiError | undefined)?.response;
  const status = response?.status;
  const validationMessage = readValidationMessage(response?.data?.detail);

  if (!status) {
    return 'Nao foi possivel conectar ao servidor para compartilhar a tarefa.';
  }

  if (status === 400 || status === 422) {
    return (
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
