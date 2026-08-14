import {
  readDeleteTaskApiError,
  type DeleteTaskApiDetail
} from './readDeleteTaskApiError';
import { readDeleteTaskValidationMessage } from './readDeleteTaskValidationMessage';

const TASK_DELETE_NOOP_ERROR_MESSAGE = 'Task deletion response did not remove any task.';

function isTaskDeleteNoopError(error: unknown): boolean {
  return error instanceof Error && error.message === TASK_DELETE_NOOP_ERROR_MESSAGE;
}

function mapDeleteTaskStatusError(status: number, detail: DeleteTaskApiDetail): string {
  if (status === 400 || status === 422) {
    return (
      readDeleteTaskValidationMessage(detail) ||
      'Nao foi possivel excluir a tarefa com os dados informados.'
    );
  }

  if (status === 403) {
    return 'Voce nao tem permissao para excluir esta tarefa.';
  }

  if (status === 404) {
    return 'A tarefa nao foi encontrada ou ja foi removida.';
  }

  return 'Nao foi possivel excluir a tarefa.';
}

/** Maps backend task-deletion failures into short user-facing messages. */
export function mapDeleteTaskError(error: unknown): string {
  if (isTaskDeleteNoopError(error)) {
    return 'A tarefa nao foi encontrada, ja foi removida ou nao pertence ao usuario autenticado.';
  }

  const response = readDeleteTaskApiError(error);
  const status = response?.status;

  if (!status) {
    return 'Nao foi possivel conectar ao servidor para excluir a tarefa.';
  }

  return mapDeleteTaskStatusError(status, response?.data?.detail);
}
