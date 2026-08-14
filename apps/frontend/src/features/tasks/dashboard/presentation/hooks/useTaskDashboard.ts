import { useTaskListFilters } from '../../../list/presentation/hooks/useTaskListFilters';
import { useTaskListQuery } from '../../../list/presentation/hooks/useTaskListQuery';
import { useTaskDashboardCategories } from './useTaskDashboardCategories';
import { useTaskDashboardPageSync } from './useTaskDashboardPageSync';
import { useTaskDashboardTaskActions } from './useTaskDashboardTaskActions';

/** Orchestrates dashboard state while reads and category/task creation use the backend. */
export function useTaskDashboard() {
  const categoryState = useTaskDashboardCategories();
  const { filters, actions } = useTaskListFilters();
  const { errorMessage, isLoading, page, reload } = useTaskListQuery(filters);
  const paginatedTasks = page;
  const taskActionState = useTaskDashboardTaskActions({
    currentPage: filters.page,
    reloadTasks: reload,
    setPage: actions.setPage,
    visibleItemCount: paginatedTasks.items.length
  });

  useTaskDashboardPageSync({
    currentPage: paginatedTasks.currentPage,
    filtersPage: filters.page,
    setPage: actions.setPage
  });

  return {
    actions,
    ...categoryState,
    ...taskActionState,
    errorMessage,
    filters,
    isLoading,
    paginatedTasks,
    reloadTasks: reload
  };
}
