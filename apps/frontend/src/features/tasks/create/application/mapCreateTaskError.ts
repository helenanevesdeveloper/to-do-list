type ApiValidationIssue = {
  field?: unknown;
  message?: string;
  loc?: unknown[];
  msg?: string;
};

type ApiErrorResponse = {
  status?: number;
  data?: {
    detail?: string | ApiValidationIssue[];
  };
};

type CreateTaskApiError = {
  response?: ApiErrorResponse;
};

/** Maps backend task-create failures into short inline messages for the create row. */
export function mapCreateTaskError(error: unknown): string {
  const response = (error as CreateTaskApiError | undefined)?.response;
  const status = response?.status;
  const detail = response?.data?.detail;

  if (!status) {
    return 'Nao foi possivel conectar ao servidor para criar a tarefa.';
  }

  if ((status === 400 || status === 422) && Array.isArray(detail) && detail.length > 0) {
    const firstIssue = detail[0];
    return (
      firstIssue?.message ||
      firstIssue?.msg ||
      'Nao foi possivel criar a tarefa com os dados informados.'
    );
  }

  return 'Nao foi possivel criar a tarefa.';
}
