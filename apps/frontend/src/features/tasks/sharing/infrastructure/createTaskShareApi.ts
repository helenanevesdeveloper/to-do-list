import type { TaskSharePermission } from '../domain/taskSharePermission';
import { taskApiClient } from '../../shared/infrastructure/taskApiClient';

/** Input contract for creating a task-sharing entry. */
export interface CreateTaskShareApiInput {
  taskId: string;
  email: string;
  permission: Exclude<TaskSharePermission, 'owner'>;
}

type CreateTaskShareApiResponse = {
  id: string;
  shared_with_user_email: string;
  permission: string;
  created_at: string;
};

/** Creates one task-sharing entry in the backend. */
export async function createTaskShareApi(
  _input: CreateTaskShareApiInput,
): Promise<void> {
  await taskApiClient.post<CreateTaskShareApiResponse>(
    `/api/tasks/${encodeURIComponent(_input.taskId)}/shares/`,
    {
      shared_with_user_email: _input.email.trim().toLowerCase(),
      permission: _input.permission
    }
  );
}
