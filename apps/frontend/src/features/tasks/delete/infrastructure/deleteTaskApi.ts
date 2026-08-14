import { taskApiClient } from '../../shared/infrastructure/taskApiClient';

/** Input contract for deleting a single task from the dashboard. */
export interface DeleteTaskApiInput {
  taskId: string;
}

export interface DeleteTaskApiResult {
  deleted: number;
  failed: number;
  requested: number;
}

/** Deletes one task through the backend batch-delete endpoint. */
export async function deleteTaskApi(
  input: DeleteTaskApiInput
): Promise<DeleteTaskApiResult> {
  const response = await taskApiClient.delete<DeleteTaskApiResult>('/api/tasks/', {
    data: {
      ids: [input.taskId]
    }
  });

  if (response.data.deleted < 1) {
    throw new Error('Task deletion response did not remove any task.');
  }

  return response.data;
}
