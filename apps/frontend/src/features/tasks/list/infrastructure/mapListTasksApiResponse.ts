import { buildTaskListPage } from '../application/buildTaskListPage';
import type {
  TaskCategorySummary,
  TaskListItem,
  TaskListPage,
  TaskSharingSummary
} from '../../shared/types';

export type ListTasksApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ListTasksApiTaskItem[];
};

export type ListTasksApiTaskItem = {
  id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  category: ListTasksApiTaskCategory | null;
  sharing: ListTasksApiTaskSharing;
};

type ListTasksApiTaskCategory = {
  id: string;
  name: string;
  color: string | null;
};

type ListTasksApiTaskSharing = {
  is_owner: boolean;
  permission: string | null;
  is_shared: boolean;
  shared_count: number;
};

function mapTaskCategorySummary(
  category: ListTasksApiTaskCategory | null
): TaskCategorySummary | null {
  if (category === null) {
    return null;
  }

  return {
    id: category.id,
    name: category.name,
    color: category.color
  };
}

function mapTaskSharingSummary(
  sharing: ListTasksApiTaskSharing
): TaskSharingSummary {
  return {
    isOwner: sharing.is_owner,
    permission: sharing.permission,
    isShared: sharing.is_shared,
    sharedCount: sharing.shared_count
  };
}

/** Maps one backend task item into the camelCase UI shape. */
export function mapListTasksApiTaskItem(item: ListTasksApiTaskItem): TaskListItem {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    isCompleted: item.is_completed,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    category: mapTaskCategorySummary(item.category),
    sharing: mapTaskSharingSummary(item.sharing)
  };
}

/** Maps the backend paginated payload into the dashboard pagination state. */
export function mapListTasksApiResponse(args: {
  page: number;
  pageSize: number;
  response: ListTasksApiResponse;
}): TaskListPage {
  return buildTaskListPage({
    items: args.response.results.map(mapListTasksApiTaskItem),
    page: args.page,
    pageSize: args.pageSize,
    totalItems: args.response.count
  });
}
