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

type TaskShareApiError = {
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

/** Maps task-sharing failures into short user-facing messages. */
export function mapTaskShareError(error: unknown): string {
  const response = (error as TaskShareApiError | undefined)?.response;
  const status = response?.status;
  const validationMessage = readValidationMessage(response?.data?.detail);

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
