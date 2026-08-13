import { Box, Stack } from '@chakra-ui/react';
import type { TaskCategoryOption, TaskListFilters } from '../../../shared/types';
import type { TaskListFilterActions } from '../hooks/useTaskListFilters';
import { buildActiveTaskFilterChips } from '../mappers/buildActiveTaskFilterChips';
import ActiveTaskFilters from './ActiveTaskFilters';
import TaskListToolbar from './TaskListToolbar';

export type TaskListControlsProps = {
  actions: TaskListFilterActions;
  categoryOptions: TaskCategoryOption[];
  filters: TaskListFilters;
  isLoadingCategories?: boolean;
};

/** Composes the task-list toolbar and active-filter summary for the dashboard. */
export default function TaskListControls({
  actions,
  categoryOptions,
  filters,
  isLoadingCategories = false
}: TaskListControlsProps) {
  const activeFilterChips = buildActiveTaskFilterChips({
    filters,
    categoryOptions,
    onClearScope: actions.resetScope,
    onClearStatus: actions.resetStatus,
    onClearCategory: actions.resetCategory
  });

  return (
    <Box borderWidth="1px" borderRadius="lg" p={{ base: 5, md: 6 }}>
      <Stack spacing={5}>
        <TaskListToolbar
          filters={filters}
          categoryOptions={categoryOptions}
          isLoadingCategories={isLoadingCategories}
          onScopeChange={actions.setScope}
          onStatusChange={actions.setStatus}
          onCategoryChange={actions.setCategoryId}
          onPageSizeChange={actions.setPageSize}
        />

        <ActiveTaskFilters
          chips={activeFilterChips}
          onClearAll={actions.resetAll}
        />
      </Stack>
    </Box>
  );
}
