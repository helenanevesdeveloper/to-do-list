import { buildListTasksParams } from '../application/buildListTasksParams';
import type { TaskListFilters, TaskListPage } from '../../shared/types';
import { taskApiClient } from '../../shared/infrastructure/taskApiClient';
import {
  mapListTasksApiResponse,
  type ListTasksApiResponse
} from './mapListTasksApiResponse';

/** Loads one backend task-list page using the current dashboard filters. */
export async function listTasksApi(
  filters: TaskListFilters
): Promise<TaskListPage> {
  const response = await taskApiClient.get<ListTasksApiResponse>('/api/tasks/', {
    params: buildListTasksParams(filters)
  });

  return mapListTasksApiResponse({
    page: filters.page,
    pageSize: filters.pageSize,
    response: response.data
  });
}
