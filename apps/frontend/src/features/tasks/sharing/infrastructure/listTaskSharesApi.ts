import type { TaskShare } from '../domain/taskShare';
import { taskApiClient } from '../../shared/infrastructure/taskApiClient';
import {
  mapListTaskSharesApiResponse,
  type ListTaskSharesApiResponse
} from './mapListTaskSharesApiResponse';

/** Input contract for loading task-sharing entries. */
export interface ListTaskSharesApiInput {
  taskId: string;
}

/** Loads the access list for one task from the backend. */
export async function listTaskSharesApi(
  input: ListTaskSharesApiInput,
): Promise<readonly TaskShare[]> {
  const response = await taskApiClient.get<ListTaskSharesApiResponse>(
    `/api/tasks/${encodeURIComponent(input.taskId)}/shares/`
  );

  return mapListTaskSharesApiResponse(response.data);
}
