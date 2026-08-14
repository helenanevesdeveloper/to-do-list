import type { DeleteTaskApiDetail } from './readDeleteTaskApiError';

/** Extracts the first validation message returned by the backend for task deletion. */
export function readDeleteTaskValidationMessage(detail: DeleteTaskApiDetail): string | null {
  if (!Array.isArray(detail) || detail.length === 0) {
    return null;
  }

  return (
    detail[0]?.message ||
    detail[0]?.msg ||
    'Nao foi possivel excluir a tarefa com os dados informados.'
  );
}
