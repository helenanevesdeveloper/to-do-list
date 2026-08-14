import { taskApiClient } from '../../shared/infrastructure/taskApiClient';

/** Input contract for deleting a task-sharing entry. */
export interface DeleteTaskShareApiInput {
  taskId: string;
  shareId: string;
}

/** Deletes one task-sharing entry in the backend. */
export async function deleteTaskShareApi(
  input: DeleteTaskShareApiInput,
): Promise<void> {
  await taskApiClient.delete(
    `/api/tasks/${encodeURIComponent(input.taskId)}/shares/${encodeURIComponent(input.shareId)}/`
  );
}
