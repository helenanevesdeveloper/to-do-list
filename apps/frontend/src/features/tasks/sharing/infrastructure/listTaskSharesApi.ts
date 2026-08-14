import type { TaskShare } from '../domain/taskShare';

/** Input contract for loading task-sharing entries. */
export interface ListTaskSharesApiInput {
  taskId: string;
}

/** Placeholder API client for future task-share listing. */
export async function listTaskSharesApi(
  _input: ListTaskSharesApiInput,
): Promise<readonly TaskShare[]> {
  throw new Error('TODO: implement listTaskSharesApi.');
}
