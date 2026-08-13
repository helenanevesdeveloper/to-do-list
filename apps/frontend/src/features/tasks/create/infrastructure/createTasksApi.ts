import {
  mapListTasksApiTaskItem,
  type ListTasksApiTaskItem
} from '../../list/infrastructure/mapListTasksApiResponse';
import type { TaskListItem } from '../../shared/types';
import { taskApiClient } from '../../shared/infrastructure/taskApiClient';
import type { TaskInlineCreateInput } from '../presentation/hooks/useTaskInlineCreate';

type CreateTasksApiRequest = {
  items: Array<{
    category_id?: string | null;
    description?: string | null;
    title: string;
  }>;
};

type CreateTasksApiResponse = {
  count: number;
  results: ListTasksApiTaskItem[];
};

function buildCreateTasksApiRequest(
  input: TaskInlineCreateInput
): CreateTasksApiRequest {
  return {
    items: [
      {
        category_id: input.categoryId,
        description: input.description,
        title: input.title
      }
    ]
  };
}

/** Creates one task through the backend batch-create endpoint. */
export async function createTasksApi(
  input: TaskInlineCreateInput
): Promise<TaskListItem> {
  const response = await taskApiClient.post<CreateTasksApiResponse>(
    '/api/tasks/',
    buildCreateTasksApiRequest(input)
  );
  const createdItem = response.data.results[0];

  if (!createdItem) {
    throw new Error('Task creation response did not include any created items.');
  }

  return mapListTasksApiTaskItem(createdItem);
}
