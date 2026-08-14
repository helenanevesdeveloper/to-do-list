import {
  mapListTasksApiTaskItem,
  type ListTasksApiTaskItem
} from '../../list/infrastructure/mapListTasksApiResponse';
import type { TaskListItem } from '../../shared/types';
import { taskApiClient } from '../../shared/infrastructure/taskApiClient';
import type { TaskInlineEditInput } from '../presentation/hooks/useTaskInlineEdit';

export interface UpdateTaskApiInput extends TaskInlineEditInput {
  taskId: string;
}

type UpdateTaskApiRequest = {
  category_id: string | null;
  description: string | null;
  title: string;
};

function buildUpdateTaskApiRequest(
  input: UpdateTaskApiInput
): UpdateTaskApiRequest {
  return {
    category_id: input.categoryId,
    description: input.description,
    title: input.title
  };
}

/** Updates one task through the backend partial-update endpoint. */
export async function updateTaskApi(
  input: UpdateTaskApiInput
): Promise<TaskListItem> {
  const response = await taskApiClient.patch<ListTasksApiTaskItem>(
    `/api/tasks/${encodeURIComponent(input.taskId)}/`,
    buildUpdateTaskApiRequest(input)
  );

  return mapListTasksApiTaskItem(response.data);
}
