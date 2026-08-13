import type { TaskListFilters } from '../../shared/types';

export type ListTasksApiParams = {
  page: number;
  page_size: number;
  scope: TaskListFilters['scope'];
  is_completed?: boolean;
  category_id?: string;
};

/** Builds backend query params from the dashboard filter state. */
export function buildListTasksParams(filters: TaskListFilters): ListTasksApiParams {
  const params: ListTasksApiParams = {
    page: filters.page,
    page_size: filters.pageSize,
    scope: filters.scope
  };

  if (filters.status === 'pending') {
    params.is_completed = false;
  }

  if (filters.status === 'completed') {
    params.is_completed = true;
  }

  if (filters.categoryId) {
    params.category_id = filters.categoryId;
  }

  return params;
}
