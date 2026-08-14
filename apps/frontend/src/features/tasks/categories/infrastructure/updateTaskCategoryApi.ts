/** Placeholder API client for future category updates. */
import type { TaskCategoryOption } from '../../shared/types';
import { taskApiClient } from '../../shared/infrastructure/taskApiClient';

export interface UpdateTaskCategoryApiInput {
  categoryId: string;
  name: string;
}

type UpdateTaskCategoryApiRequest = {
  name: string;
};

type UpdateTaskCategoryApiResponse = {
  id: string;
  name: string;
  color: string | null;
  created_at: string;
  updated_at: string;
};

/** Updates one task category through the backend partial-update endpoint. */
export async function updateTaskCategoryApi(
  input: UpdateTaskCategoryApiInput
): Promise<TaskCategoryOption> {
  const response = await taskApiClient.patch<UpdateTaskCategoryApiResponse>(
    `/api/tasks/categories/${encodeURIComponent(input.categoryId)}/`,
    buildUpdateTaskCategoryApiRequest(input)
  );

  return {
    id: response.data.id,
    name: response.data.name
  };
}

function buildUpdateTaskCategoryApiRequest(
  input: UpdateTaskCategoryApiInput
): UpdateTaskCategoryApiRequest {
  return {
    name: input.name
  };
}
