import { taskApiClient } from '../../shared/infrastructure/taskApiClient';

export interface DeleteTaskCategoryApiInput {
  categoryId: string;
}

/** Deletes one task category through the backend detail endpoint. */
export async function deleteTaskCategoryApi(
  input: DeleteTaskCategoryApiInput
): Promise<void> {
  await taskApiClient.delete(
    `/api/tasks/categories/${encodeURIComponent(input.categoryId)}/`
  );
}
