import { readApiDetailCode } from '../../../../shared/infrastructure/http/apiErrorDetails';

type ApiErrorResponse = {
  status?: number;
  data?: {
    detail?: import('../../../../shared/infrastructure/http/apiErrorDetails').ApiErrorDetail;
  };
};

type DeleteTaskCategoryApiError = {
  response?: ApiErrorResponse;
};

/** Maps backend category-delete failures into short user-facing messages. */
export function mapDeleteTaskCategoryError(error: unknown): string {
  const response = (error as DeleteTaskCategoryApiError | undefined)?.response;
  const status = response?.status;
  const detail = response?.data?.detail;
  const code = readApiDetailCode(detail);

  if (!status) {
    return 'Nao foi possivel conectar ao servidor para deletar a categoria.';
  }

  if (status === 404 || code === 'task_category_not_found') {
    return 'A categoria nao foi encontrada.';
  }

  return 'Nao foi possivel deletar a categoria.';
}
