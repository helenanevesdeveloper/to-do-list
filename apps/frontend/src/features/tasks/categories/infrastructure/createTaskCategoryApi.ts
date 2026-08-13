import type { TaskCategoryOption } from '../../shared/types';
import { taskApiClient } from '../../shared/infrastructure/taskApiClient';

type CreateTaskCategoryApiPayload = {
  color?: string | null;
  name: string;
};

type CreateTaskCategoryApiResponse = {
  id: string;
  name: string;
  color: string | null;
  created_at: string;
  updated_at: string;
};

/** Creates one task category for the authenticated user through the backend API. */
export async function createTaskCategoryApi(
  payload: CreateTaskCategoryApiPayload
): Promise<TaskCategoryOption> {
  const response = await taskApiClient.post<CreateTaskCategoryApiResponse>(
    '/api/tasks/categories/',
    payload
  );

  return {
    id: response.data.id,
    name: response.data.name
  };
}
