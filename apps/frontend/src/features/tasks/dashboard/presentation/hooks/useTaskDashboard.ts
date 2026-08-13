import { useEffect, useState } from 'react';
import { createLocalTaskListItem } from '../../../create/application/createLocalTaskListItem';
import type { TaskInlineCreateInput } from '../../../create/presentation/hooks/useTaskInlineCreate';
import { selectVisibleTaskListItems } from '../../../list/application/selectVisibleTaskListItems';
import { useTaskListFilters } from '../../../list/presentation/hooks/useTaskListFilters';
import {
  TASK_CATEGORY_SAMPLE_OPTIONS,
  TASK_LIST_SAMPLE_DATA
} from '../../../list/presentation/state/taskListSampleData';

/** Orchestrates local dashboard state while the task feature is still using sample data. */
export function useTaskDashboard() {
  const categoryOptions = TASK_CATEGORY_SAMPLE_OPTIONS;
  const [taskItems, setTaskItems] = useState(TASK_LIST_SAMPLE_DATA);
  const { filters, actions } = useTaskListFilters();
  const paginatedTasks = selectVisibleTaskListItems({
    items: taskItems,
    filters
  });

  useEffect(() => {
    if (paginatedTasks.currentPage !== filters.page) {
      actions.setPage(paginatedTasks.currentPage);
    }
  }, [actions, filters.page, paginatedTasks.currentPage]);

  function handleCreateTask(input: TaskInlineCreateInput): void {
    setTaskItems((current) => [
      createLocalTaskListItem({
        categoryOptions,
        input
      }),
      ...current
    ]);
    actions.setPage(1);
  }

  function handleTaskClick(): void {}

  return {
    actions,
    categoryOptions,
    filters,
    handleCreateTask,
    handleTaskClick,
    paginatedTasks
  };
}
