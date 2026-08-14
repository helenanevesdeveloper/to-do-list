/** Input contract for deleting a task-sharing entry. */
export interface DeleteTaskShareApiInput {
  taskId: string;
  shareId: string;
}

/** Placeholder API client for future task-share removal. */
export async function deleteTaskShareApi(
  _input: DeleteTaskShareApiInput,
): Promise<void> {
  throw new Error('TODO: implement deleteTaskShareApi.');
}
