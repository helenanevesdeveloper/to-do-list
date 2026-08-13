import type { TaskCategoryOption } from '../../shared/types';
import { taskApiClient } from '../../shared/infrastructure/taskApiClient';
import {
  mapListTaskCategoriesApiResponse,
  type ListTaskCategoriesApiResponse
} from './mapListTaskCategoriesApiResponse';

/** Loads the authenticated user's task categories from the backend. */
export async function listTaskCategoriesApi(): Promise<TaskCategoryOption[]> {
  const response = await taskApiClient.get<ListTaskCategoriesApiResponse>(
    '/api/tasks/categories/'
  );

  return mapListTaskCategoriesApiResponse(response.data);
}
