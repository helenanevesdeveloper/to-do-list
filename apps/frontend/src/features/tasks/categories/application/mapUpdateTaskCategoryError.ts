import {
  readApiDetailCode,
  readFirstApiValidationIssue
} from '../../../../shared/infrastructure/http/apiErrorDetails';

type ApiErrorResponse = {
  status?: number;
  data?: {
    detail?: import('../../../../shared/infrastructure/http/apiErrorDetails').ApiErrorDetail;
  };
};

type UpdateTaskCategoryApiError = {
  response?: ApiErrorResponse;
};

/** Maps backend category-update failures into short user-facing messages. */
export function mapUpdateTaskCategoryError(error: unknown): string {
  const response = (error as UpdateTaskCategoryApiError | undefined)?.response;
  const status = response?.status;
  const detail = response?.data?.detail;

  if (!status) {
    return 'Nao foi possivel conectar ao servidor para atualizar a categoria.';
  }

  if ((status === 400 || status === 422) && Array.isArray(detail) && detail.length > 0) {
    const firstIssue = readFirstApiValidationIssue(detail);
    const code = readApiDetailCode(detail);

    if (code === 'task_category_name_already_exists') {
      return 'Ja existe uma categoria com esse nome.';
    }

    return (
      firstIssue?.message ||
      firstIssue?.msg ||
      'Nao foi possivel atualizar a categoria com os dados informados.'
    );
  }

  if (status === 404) {
    return 'A categoria nao foi encontrada.';
  }

  return 'Nao foi possivel atualizar a categoria.';
}
