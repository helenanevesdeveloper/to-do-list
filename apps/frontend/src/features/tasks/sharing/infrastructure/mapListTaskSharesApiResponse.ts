import type { TaskShare } from '../domain/taskShare';
import type { TaskSharePermission } from '../domain/taskSharePermission';
import { sortTaskShares } from '../presentation/state/sortTaskShares';

export type ListTaskSharesApiResponse = {
  count: number;
  is_owner: boolean;
  owner_email: string;
  results: ListTaskSharesApiItem[];
};

type ListTaskSharesApiItem = {
  id: string;
  shared_with_user_email: string;
  permission: string;
  created_at: string;
};

function mapTaskSharePermission(
  permission: string
): Exclude<TaskSharePermission, 'owner'> {
  return permission === 'editor' ? 'editor' : 'reader';
}

/** Maps the backend share-list payload into the modal access-list entities. */
export function mapListTaskSharesApiResponse(
  response: ListTaskSharesApiResponse
): TaskShare[] {
  const shares: TaskShare[] = [
    {
      email: response.owner_email,
      id: `owner:${response.owner_email}`,
      isOwner: true,
      permission: 'owner'
    },
    ...response.results.map((item) => ({
      email: item.shared_with_user_email,
      id: item.id,
      isOwner: false,
      permission: mapTaskSharePermission(item.permission)
    }))
  ];

  return sortTaskShares(shares);
}
