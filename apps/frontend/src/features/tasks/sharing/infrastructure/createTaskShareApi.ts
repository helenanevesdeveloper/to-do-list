import type { TaskShare } from '../domain/taskShare';
import type { TaskSharePermission } from '../domain/taskSharePermission';

/** Input contract for creating a task-sharing entry. */
export interface CreateTaskShareApiInput {
  taskId: string;
  email: string;
  permission: Exclude<TaskSharePermission, 'owner'>;
}

/** Placeholder API client for future task-share creation. */
export async function createTaskShareApi(
  _input: CreateTaskShareApiInput,
): Promise<TaskShare> {
  throw new Error('TODO: implement createTaskShareApi.');
}
